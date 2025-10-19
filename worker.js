#!/usr/bin/env node

/**
 * SoundCloud DM Worker
 * Robust, single-file script to send messages to followers
 * Node 18+, puppeteer-extra with stealth
 */

import "dotenv/config";
import puppeteerExtra from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { readFileSync, writeFileSync, existsSync } from "fs";

puppeteerExtra.use(StealthPlugin());

// ========== CONFIGURATION ==========
const CONFIG = {
  MESSAGE: process.env.MESSAGE || "Hey! Thanks for following.",
  MAX_PER_RUN: parseInt(process.env.MAX_PER_RUN || "5", 10),
  FOLLOWERS_URL:
    process.env.FOLLOWERS_URL || "https://soundcloud.com/andygart/followers",
  USER_DATA_DIR: "./profile-andygart",
  HISTORY_FILE: "./sent-history.json",

  // Browser connection mode
  USE_EXISTING_CHROME: process.env.USE_EXISTING_CHROME === "true",
  CHROME_DEBUG_PORT: process.env.CHROME_DEBUG_PORT || "9222",

  // Timing configs (in ms) - conservative for anti-bot
  SCROLL_DURATION: 60000, // 60s max scroll
  LOGIN_POLL_INTERVAL: 3000,
  LOGIN_POLL_MAX: 120000, // 2 min max wait for login

  // Anti-bot timing (very conservative)
  DELAY_BETWEEN_USERS_MIN: 30000, // 30s minimum
  DELAY_BETWEEN_USERS_MAX: 300000, // 5min maximum
  TYPING_DELAY_MIN: 35,
  TYPING_DELAY_MAX: 95,
  LONG_BREAK_CHANCE: 0.2, // 20% chance of longer break
  LONG_BREAK_MULTIPLIER: 2,

  // Retry & timeout config
  NAV_TIMEOUT: 30000,
  SELECTOR_TIMEOUT: 10000,
};

// ========== UTILITIES ==========

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (min, max) => Math.floor(min + Math.random() * (max - min + 1));

/**
 * Load message history from file
 * Returns Set of profile paths already messaged
 */
function loadHistory() {
  try {
    if (!existsSync(CONFIG.HISTORY_FILE)) {
      return new Set();
    }
    const data = readFileSync(CONFIG.HISTORY_FILE, "utf-8");
    const history = JSON.parse(data);
    return new Set(history.messaged || []);
  } catch (err) {
    console.log(`⚠️  Warning: Could not load history file: ${err.message}`);
    return new Set();
  }
}

/**
 * Save a profile to the message history
 * Atomic append to prevent losing data on crash
 */
function saveToHistory(profilePath, historySet) {
  try {
    historySet.add(profilePath);
    const data = {
      lastUpdated: new Date().toISOString(),
      totalMessaged: historySet.size,
      messaged: Array.from(historySet),
    };
    writeFileSync(CONFIG.HISTORY_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.log(`  ⚠️  Warning: Could not save to history: ${err.message}`);
  }
}

/**
 * Human-like typing with random delays
 * HOTSPOT: Adjust typing delays here for faster/slower typing
 */
async function typeHuman(page, selector, text) {
  await page.waitForSelector(selector, {
    timeout: CONFIG.SELECTOR_TIMEOUT,
    visible: true,
  });
  await page.click(selector);

  for (const char of text) {
    await page.keyboard.type(char);
    await sleep(rand(CONFIG.TYPING_DELAY_MIN, CONFIG.TYPING_DELAY_MAX));

    // Occasional longer pause (like thinking)
    if (Math.random() < 0.03) {
      await sleep(rand(150, 400));
    }
  }
}

/**
 * Random human-like behavior: mouse movement and scroll
 */
async function randomHumanBehavior(page) {
  // Random mouse movement
  const x = rand(200, 1000);
  const y = rand(150, 600);
  await page.mouse.move(x, y, { steps: rand(5, 15) });

  // Occasional scroll
  if (Math.random() > 0.4) {
    const scrollAmount = rand(-200, 300);
    await page.evaluate((amount) => {
      window.scrollBy(0, amount);
    }, scrollAmount);
  }

  await sleep(rand(500, 1500));
}

/**
 * Take screenshot on error for debugging
 */
async function takeErrorScreenshot(page, prefix = "error") {
  const timestamp = Date.now();
  const filename = `./${prefix}-${timestamp}.png`;
  try {
    await page.screenshot({ path: filename, fullPage: true });
    console.log(`  📸 Screenshot: ${filename}`);
  } catch (err) {
    console.log(`  ⚠️  Screenshot failed: ${err.message}`);
  }
}

/**
 * Check if user is logged in to SoundCloud
 */
async function isLoggedIn(page) {
  try {
    // Multiple heuristics for login detection
    const loggedIn = await page.evaluate(() => {
      // Check for sign-in link (means NOT logged in)
      if (document.querySelector('a[href="/signin"]')) return false;

      // Look for user navigation elements (means logged in)
      const userNav = document.querySelector('[class*="userNav"]');
      const userMenu = document.querySelector('[class*="userMenu"]');
      const avatar = document.querySelector('[class*="header"] img[class*="image"]');

      return !!(userNav || userMenu || avatar);
    });

    return loggedIn;
  } catch {
    return false;
  }
}

/**
 * Wait for user to log in manually
 */
async function waitForLogin(page) {
  console.log("\n⏳ Not logged in. Please log in manually in the browser...");
  console.log("   Polling every 3s for authentication...\n");

  const startTime = Date.now();

  while (Date.now() - startTime < CONFIG.LOGIN_POLL_MAX) {
    await sleep(CONFIG.LOGIN_POLL_INTERVAL);

    if (await isLoggedIn(page)) {
      console.log("✅ Login detected!\n");
      return true;
    }
  }

  throw new Error("Login timeout - user did not log in within 2 minutes");
}

/**
 * Auto-scroll to load all followers
 * HOTSPOT: Adjust SCROLL_DURATION in CONFIG for longer/shorter scroll
 */
async function autoScroll(page) {
  console.log("📜 Auto-scrolling to load followers (max 60s)...");

  const startTime = Date.now();
  let previousHeight = 0;
  let stableCount = 0;

  while (Date.now() - startTime < CONFIG.SCROLL_DURATION) {
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight * 0.8);
    });

    await sleep(rand(800, 1500));

    const currentHeight = await page.evaluate(
      () => document.scrollingElement.scrollHeight
    );

    // If height hasn't changed for 3 checks, we've reached the end
    if (currentHeight === previousHeight) {
      stableCount++;
      if (stableCount >= 3) {
        console.log("  ✓ Reached end of followers list");
        break;
      }
    } else {
      stableCount = 0;
    }

    previousHeight = currentHeight;
  }
}

/**
 * Extract follower profile links from the page
 * HOTSPOT: Adjust profile pattern regex if SoundCloud changes URL structure
 */
async function extractFollowerLinks(page) {
  console.log("🔍 Extracting follower profile links...");

  const links = await page.evaluate(() => {
    const profileLinks = new Set();
    const anchors = document.querySelectorAll('a[href]');

    // Pattern: /{username} (single path segment, exclude special pages)
    const profilePattern = /^\/([a-zA-Z0-9_-]+)$/;
    const excludePatterns = [
      "/you",
      "/likes",
      "/sets",
      "/tracks",
      "/reposts",
      "/following",
      "/followers",
      "/popular",
      "/stream",
    ];

    anchors.forEach((anchor) => {
      const href = anchor.getAttribute("href");
      if (!href) return;

      // Get pathname
      let pathname;
      try {
        if (href.startsWith("/")) {
          pathname = href.split("?")[0].split("#")[0];
        } else if (href.includes("soundcloud.com")) {
          const url = new URL(href);
          pathname = url.pathname;
        } else {
          return;
        }
      } catch {
        return;
      }

      // Check if it matches profile pattern
      if (profilePattern.test(pathname)) {
        // Exclude special pages
        if (!excludePatterns.some((exclude) => pathname.startsWith(exclude))) {
          profileLinks.add(pathname);
        }
      }
    });

    return Array.from(profileLinks);
  });

  console.log(`  ✓ Found ${links.length} unique follower profiles`);
  return links;
}

/**
 * Find and click the Message button
 * HOTSPOT: Add more selectors here if SoundCloud changes button structure
 */
async function clickMessageButton(page) {
  const messageSelectors = [
    'button:has-text("Message")',
    'a:has-text("Message")',
    'button[aria-label*="Message" i]',
    'a[aria-label*="Message" i]',
    'button[class*="sendMessage"]',
    'a[class*="sendMessage"]',
  ];

  // Try each selector
  for (const selector of messageSelectors) {
    try {
      const element = await page.waitForSelector(selector, {
        timeout: 3000,
        visible: true,
      });
      if (element) {
        await element.click();
        return true;
      }
    } catch {
      continue;
    }
  }

  // Fallback: search by text content
  try {
    const clicked = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll("button, a"));
      const messageButton = elements.find((el) => {
        const text = el.textContent.trim().toLowerCase();
        return text === "message" || text.includes("send message");
      });

      if (messageButton) {
        messageButton.click();
        return true;
      }
      return false;
    });

    if (clicked) return true;
  } catch {
    // Continue to error
  }

  throw new Error("Message button not found");
}

/**
 * Find and focus the message composer
 * HOTSPOT: Add more selectors if composer structure changes
 */
async function focusComposer(page) {
  const composerSelectors = [
    'textarea[placeholder*="message" i]',
    'textarea[aria-label*="message" i]',
    '[contenteditable="true"]',
    '[role="textbox"]',
    "textarea",
  ];

  for (const selector of composerSelectors) {
    try {
      await page.waitForSelector(selector, {
        timeout: 5000,
        visible: true,
      });
      return selector;
    } catch {
      continue;
    }
  }

  throw new Error("Message composer not found");
}

/**
 * Send the message
 */
async function sendMessage(page) {
  // Try to find and click Send button
  const sendSelectors = [
    'button:has-text("Send")',
    'button[aria-label*="Send" i]',
    'button[class*="send"]',
  ];

  let sentViaButton = false;

  for (const selector of sendSelectors) {
    try {
      const element = await page.waitForSelector(selector, {
        timeout: 2000,
        visible: true,
      });
      if (element) {
        await element.click();
        sentViaButton = true;
        break;
      }
    } catch {
      continue;
    }
  }

  // Fallback: press Enter
  if (!sentViaButton) {
    await page.keyboard.press("Enter");
  }

  await sleep(rand(1000, 2000));
}

/**
 * Check for captcha or anti-bot detection
 */
async function checkForCaptcha(page) {
  try {
    const hasCaptcha = await page.evaluate(() => {
      const bodyText = document.body.textContent.toLowerCase();
      return (
        bodyText.includes("captcha") ||
        bodyText.includes("verify you") ||
        bodyText.includes("unusual activity") ||
        document.querySelector('[class*="captcha"]') !== null
      );
    });

    return hasCaptcha;
  } catch {
    return false;
  }
}

/**
 * Process a single follower profile
 * Returns: { success, error?, skipped? }
 */
async function processFollower(browser, baseUrl, profilePath, message) {
  const url = `${baseUrl}${profilePath}`;
  let page = null;

  try {
    // Extract username from profile path (e.g., "/andygart" -> "andygart")
    const username = profilePath.replace(/^\//, '');

    // Personalize message by replacing placeholders
    // Supports: {nickname}, {username}, {name}, {user}
    const personalizedMessage = message
      .replace(/\{nickname\}/gi, username)
      .replace(/\{username\}/gi, username)
      .replace(/\{name\}/gi, username)
      .replace(/\{user\}/gi, username);

    // Open new tab
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate to profile
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: CONFIG.NAV_TIMEOUT,
    });

    // Check for captcha
    if (await checkForCaptcha(page)) {
      throw new Error("Captcha detected - stopping");
    }

    // Human-like behavior: wait and move mouse
    await sleep(rand(2000, 4000));
    await randomHumanBehavior(page);

    // Click Message button
    await clickMessageButton(page);
    await sleep(rand(800, 1500));

    // Focus composer and type personalized message
    const composerSelector = await focusComposer(page);
    await sleep(rand(500, 1000));
    await typeHuman(page, composerSelector, personalizedMessage);

    // Send message
    await sendMessage(page);

    // Brief wait before closing
    await sleep(rand(1500, 3000));

    return { success: true };
  } catch (err) {
    // Take screenshot on error
    if (page) {
      const safeFilename = profilePath.replace(/\//g, "_");
      await takeErrorScreenshot(page, `error${safeFilename}`);
    }

    return {
      success: false,
      error: err.message,
      skipped: err.message.includes("Message button not found"),
    };
  } finally {
    // Always close the tab
    if (page) {
      try {
        await page.close();
      } catch {
        // Ignore close errors
      }
    }
  }
}

/**
 * Calculate delay between users with occasional longer breaks
 * HOTSPOT: Adjust timing in CONFIG for faster/slower processing
 */
function getDelayBetweenUsers() {
  const baseDelay = rand(
    CONFIG.DELAY_BETWEEN_USERS_MIN,
    CONFIG.DELAY_BETWEEN_USERS_MAX
  );

  // Occasional longer break
  if (Math.random() < CONFIG.LONG_BREAK_CHANCE) {
    return baseDelay * CONFIG.LONG_BREAK_MULTIPLIER;
  }

  return baseDelay;
}

// ========== MAIN EXECUTION ==========

async function main() {
  console.log("🚀 SoundCloud DM Worker Starting...\n");
  console.log(`Config:
  - Message: "${CONFIG.MESSAGE}"
  - Max per run: ${CONFIG.MAX_PER_RUN}
  - Followers URL: ${CONFIG.FOLLOWERS_URL}
  - User data dir: ${CONFIG.USER_DATA_DIR}\n`);

  const results = {
    found: 0,
    alreadyMessaged: 0,
    processed: 0,
    sent: 0,
    failed: 0,
    skipped: 0,
    details: [],
  };

  let browser = null;

  try {
    // Connect to browser (existing Chrome or launch new)
    if (CONFIG.USE_EXISTING_CHROME) {
      console.log("🌐 Connecting to existing Chrome browser...");
      console.log(`   Debug port: ${CONFIG.CHROME_DEBUG_PORT}`);
      try {
        browser = await puppeteerExtra.connect({
          browserURL: `http://127.0.0.1:${CONFIG.CHROME_DEBUG_PORT}`,
        });
        console.log("✅ Connected to existing Chrome!");
      } catch (err) {
        console.error("\n❌ Could not connect to Chrome!");
        console.error("   Make sure Chrome is running with:");
        console.error('   /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222 --user-data-dir="$HOME/Library/Application Support/Google/Chrome"\n');
        throw err;
      }
    } else {
      console.log("🌐 Launching browser (headful mode)...");
      browser = await puppeteerExtra.launch({
        headless: false,
        userDataDir: CONFIG.USER_DATA_DIR,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-blink-features=AutomationControlled",
          "--window-size=1280,800",
        ],
      });
    }

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate to followers page
    console.log(`📍 Navigating to ${CONFIG.FOLLOWERS_URL}...`);
    await page.goto(CONFIG.FOLLOWERS_URL, {
      waitUntil: "networkidle2",
      timeout: CONFIG.NAV_TIMEOUT,
    });

    // Check if logged in
    if (!(await isLoggedIn(page))) {
      await waitForLogin(page);

      // Refresh page after login
      await page.reload({ waitUntil: "networkidle2" });
    } else {
      console.log("✅ Already logged in\n");
    }

    // Check for captcha
    if (await checkForCaptcha(page)) {
      console.error("\n🛑 CAPTCHA or anti-bot detection detected!");
      console.error("   Please solve it manually or stop the script.\n");
      throw new Error("Captcha detected - stopping execution");
    }

    // Scroll to load all followers
    await autoScroll(page);

    // Extract follower links
    const followerLinks = await extractFollowerLinks(page);
    results.found = followerLinks.length;

    if (followerLinks.length === 0) {
      console.log("⚠️  No followers found. Check if the page loaded correctly.");
      return results;
    }

    // Load message history to avoid duplicates
    console.log("📋 Loading message history...");
    const history = loadHistory();
    if (history.size > 0) {
      console.log(`  ✓ Found ${history.size} previously messaged users`);
    }

    // Filter out already-messaged users
    const notYetMessaged = followerLinks.filter(
      (link) => !history.has(link)
    );
    results.alreadyMessaged = followerLinks.length - notYetMessaged.length;

    if (results.alreadyMessaged > 0) {
      console.log(`  ✓ Filtered out ${results.alreadyMessaged} already-messaged users`);
    }

    if (notYetMessaged.length === 0) {
      console.log("\n✅ All followers have already been messaged!");
      console.log("   To reset history: delete sent-history.json\n");
      return results;
    }

    // Extract base URL from FOLLOWERS_URL for profile navigation
    const baseUrl = new URL(CONFIG.FOLLOWERS_URL).origin;

    // Process up to MAX_PER_RUN followers from the not-yet-messaged list
    const toProcess = notYetMessaged.slice(0, CONFIG.MAX_PER_RUN);
    console.log(`\n📨 Processing ${toProcess.length} followers...\n`);

    for (let i = 0; i < toProcess.length; i++) {
      const profilePath = toProcess[i];
      const userNum = i + 1;

      console.log(`[${userNum}/${toProcess.length}] Processing ${profilePath}...`);

      const result = await processFollower(browser, baseUrl, profilePath, CONFIG.MESSAGE);
      results.processed++;

      if (result.success) {
        results.sent++;
        console.log(`  ✅ Message sent successfully`);

        // Save to history immediately to prevent duplicates on crash
        saveToHistory(profilePath, history);
      } else if (result.skipped) {
        results.skipped++;
        console.log(`  ⏭️  Skipped: ${result.error}`);
      } else {
        results.failed++;
        console.log(`  ❌ Failed: ${result.error}`);

        // Stop if captcha detected
        if (result.error.includes("Captcha detected")) {
          console.error("\n🛑 CAPTCHA detected! Stopping execution.\n");
          break;
        }
      }

      results.details.push({
        profile: profilePath,
        success: result.success,
        skipped: result.skipped || false,
        error: result.error || null,
      });

      // Delay before next user (except after last one)
      if (i < toProcess.length - 1) {
        const delay = getDelayBetweenUsers();
        console.log(`  ⏱️  Waiting ${Math.round(delay / 1000)}s before next user...\n`);
        await sleep(delay);
      }
    }
  } catch (err) {
    console.error(`\n❌ Fatal error: ${err.message}`);
    if (err.stack) {
      console.error(err.stack);
    }
  } finally {
    // Close browser
    if (browser) {
      console.log("\n🔒 Closing browser...");
      await browser.close();
    }

    // Print summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 SUMMARY");
    console.log("=".repeat(50));
    console.log(`Found profiles:     ${results.found}`);
    console.log(`Already messaged:   ${results.alreadyMessaged}`);
    console.log(`Processed:          ${results.processed}`);
    console.log(`Successfully sent:  ${results.sent}`);
    console.log(`Skipped:            ${results.skipped}`);
    console.log(`Failed:             ${results.failed}`);
    console.log("=".repeat(50));

    // JSON output for parsing
    console.log("\nJSON Result:");
    console.log(JSON.stringify(results, null, 2));

    process.exit(0);
  }
}

// Run main function
main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
