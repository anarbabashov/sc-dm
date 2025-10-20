/**
 * SoundCloud DM Sender - SEMI-AUTOMATED VERSION
 *
 * This is a "half automation" script where YOU are in control!
 *
 * HOW IT WORKS:
 * - You manually click buttons to proceed
 * - Script helps you by highlighting buttons and filling text
 * - You can pause/stop anytime
 * - More human-like, less detectable
 *
 * SETUP:
 * 1. Go to https://soundcloud.com/YOUR_USERNAME/followers
 * 2. Log in normally
 * 3. Scroll to load followers
 * 4. Open Console (F12)
 * 5. Paste this script
 * 6. Press Enter
 * 7. Type: startSemiAuto()
 */

(function() {
    'use strict';

    const CONFIG = {
        MESSAGE: `Hey {nickname}, the new Tonica is out!
If you are reading this, it means you appreciate true sound and real music made by
someone who, just like you, cannot live a day without it.

This is the Eighth episode - a truly special number that symbolizes infinity. Maybe
it is because of the long journey I have been on this past year, and through music,
I want to share that experience with you.

During our time together, we will travel across stunning places on our beautiful
planet. The journey blends House, Progressive, Deep, and Breaks - everything we love
for a great time and a lifted mood. It will make you dance, smile, and maybe even
think about something beyond the material world.

Be kind to yourself and to others, and the world will respond with love.
Your, Andy Gart!

https://soundcloud.com/andygart/tonica-8`,

        MAX_PER_RUN: 10, // Doesn't auto-send, so this is just how many to queue
    };

    // ========== STATE ==========

    let currentQueue = [];
    let currentIndex = 0;
    let historySet = new Set();

    function loadHistory() {
        try {
            const data = localStorage.getItem('sc_dm_history');
            if (!data) return new Set();
            const history = JSON.parse(data);
            return new Set(history.messaged || []);
        } catch (err) {
            return new Set();
        }
    }

    function saveToHistory(profilePath) {
        try {
            historySet.add(profilePath);
            const data = {
                lastUpdated: new Date().toISOString(),
                totalMessaged: historySet.size,
                messaged: Array.from(historySet),
            };
            localStorage.setItem('sc_dm_history', JSON.stringify(data));
        } catch (err) {
            console.warn('Could not save history');
        }
    }

    // ========== UI HELPERS ==========

    function log(msg, color = '#3b82f6') {
        console.log(`%c[SEMI-AUTO] ${msg}`, `color: ${color}; font-weight: bold; font-size: 14px;`);
    }

    function createButton(text, onClick, color = '#10b981') {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 999999;
            padding: 15px 25px;
            font-size: 16px;
            font-weight: bold;
            color: white;
            background: ${color};
            border: none;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        `;
        btn.addEventListener('click', onClick);
        btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.05)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
        btn.style.transition = 'transform 0.2s';
        return btn;
    }

    function highlightElement(element) {
        element.style.outline = '3px solid #10b981';
        element.style.outlineOffset = '3px';
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function unhighlightElement(element) {
        element.style.outline = '';
        element.style.outlineOffset = '';
    }

    // ========== MAIN FUNCTIONS ==========

    window.startSemiAuto = function(useLoadedFollowers = false) {
        log('🚀 Starting Semi-Auto DM Sender', '#10b981');

        if (!window.location.href.includes('/followers') && !useLoadedFollowers) {
            log('❌ Please run this on your followers page!', '#ef4444');
            log('   Or use: startSemiAuto(true) to use previously loaded followers', '#f59e0b');
            return;
        }

        // Load history
        historySet = loadHistory();
        log(`📋 Loaded history: ${historySet.size} previously messaged`, '#3b82f6');

        let followers = [];

        if (useLoadedFollowers) {
            // Use previously saved followers
            try {
                const data = localStorage.getItem('sc_dm_all_followers');
                if (!data) {
                    log('❌ No saved followers found. Run getAllFollowers() first!', '#ef4444');
                    return;
                }
                const saved = JSON.parse(data);
                followers = saved.followers;
                log(`📂 Loaded ${followers.length} followers from storage`, '#10b981');
            } catch (err) {
                log('❌ Error loading followers', '#ef4444');
                return;
            }
        } else {
            // Extract from current page
            const anchors = Array.from(document.querySelectorAll('a[href]'));
            const hrefs = anchors.map(a => a.getAttribute('href'));

            const profileLinks = hrefs.filter(href =>
                href &&
                href.startsWith('/') &&
                !href.startsWith('//') &&
                !href.includes('/you') &&
                !href.includes('/likes') &&
                !href.includes('/tracks') &&
                !href.includes('/albums') &&
                !href.includes('/sets') &&
                !href.includes('/reposts') &&
                !href.includes('/followers') &&
                !href.includes('/following') &&
                !href.match(/\/(discover|search|messages|settings|upload)/)
            );

            const uniqueLinks = [...new Set(profileLinks)];
            followers = uniqueLinks.map(url => ({
                nickname: url.replace(/^\//, ''),
                url: url,
                fullUrl: window.location.origin + url
            }));
        }

        // Filter out already messaged
        const unmessaged = followers.filter(user => !historySet.has(user.url));

        log(`✓ Found ${followers.length} followers, ${unmessaged.length} unmessaged`, '#10b981');

        if (unmessaged.length === 0) {
            log('✅ All followers already messaged!', '#10b981');
            if (!useLoadedFollowers) {
                log('   Scroll to load more, then run again.', '#f59e0b');
            }
            return;
        }

        currentQueue = unmessaged.slice(0, CONFIG.MAX_PER_RUN);
        currentIndex = 0;

        log(`📨 Queue ready with ${currentQueue.length} profiles`, '#10b981');
        log('✨ Click the green button on the screen to open first profile!', '#f59e0b');

        showNextButton();
    };

    function showNextButton() {
        // Remove old button
        const oldBtn = document.getElementById('semi-auto-btn');
        if (oldBtn) oldBtn.remove();

        if (currentIndex >= currentQueue.length) {
            log('🎉 All done! Queue completed.', '#10b981');
            log(`📊 Total messaged in history: ${historySet.size}`, '#3b82f6');
            return;
        }

        const user = currentQueue[currentIndex];
        const username = user.nickname;

        const btn = createButton(
            `Open ${username} (${currentIndex + 1}/${currentQueue.length})`,
            () => {
                btn.remove();
                window.location.href = user.fullUrl || (window.location.origin + user.url);
            },
            '#10b981'
        );

        btn.id = 'semi-auto-btn';
        document.body.appendChild(btn);
    }

    window.fillMessage = function() {
        log('✍️ Filling message...', '#3b82f6');

        const username = window.location.pathname.replace(/^\//, '');
        const personalizedMessage = CONFIG.MESSAGE
            .replace(/\{nickname\}/gi, username)
            .replace(/\{username\}/gi, username)
            .replace(/\{name\}/gi, username)
            .replace(/\{user\}/gi, username);

        const selectors = [
            'textarea[placeholder*="message" i]',
            'textarea[placeholder*="Write" i]',
            'textarea',
        ];

        for (const selector of selectors) {
            const textarea = document.querySelector(selector);
            if (textarea && textarea.offsetParent !== null) {
                textarea.value = personalizedMessage;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                highlightElement(textarea);
                log('✅ Message filled! Review it and click Send manually.', '#10b981');
                log('⚠️ IMPORTANT: After sending, type: markSentAndNext()', '#f59e0b');
                return;
            }
        }

        log('❌ Could not find message composer', '#ef4444');
    };

    window.markSentAndNext = function() {
        const user = currentQueue[currentIndex];
        saveToHistory(user.url);
        log(`✅ Marked ${user.nickname} (${user.url}) as sent`, '#10b981');

        currentIndex++;

        if (currentIndex < currentQueue.length) {
            log(`⏩ Next profile ready. Click the button to continue!`, '#3b82f6');
            setTimeout(() => {
                const oldBtn = document.getElementById('semi-auto-btn');
                if (!oldBtn && window.location.href.includes('/followers')) {
                    showNextButton();
                }
            }, 2000);
        } else {
            log('🎉 Queue completed!', '#10b981');
            log(`📊 Total sent in this session: ${currentQueue.length}`, '#3b82f6');
            log(`📊 Total in history: ${historySet.size}`, '#3b82f6');
        }

        // Go back to followers page
        const followersUrl = `https://soundcloud.com/${window.location.pathname.split('/')[1]}/followers`;
        setTimeout(() => {
            window.location.href = followersUrl;
        }, 1000);
    };

    window.skipUser = function() {
        const user = currentQueue[currentIndex];
        log(`⏭️ Skipping ${user.nickname} (${user.url})`, '#f59e0b');
        currentIndex++;

        if (currentIndex < currentQueue.length) {
            const followersUrl = `https://soundcloud.com/${window.location.pathname.split('/')[1]}/followers`;
            window.location.href = followersUrl;
        } else {
            log('✅ Queue completed', '#10b981');
        }
    };

    window.viewDMHistory = function() {
        const history = loadHistory();
        console.log(`📊 Total messaged: ${history.size}`);
        console.log('Users:', Array.from(history));
        return Array.from(history);
    };

    window.clearDMHistory = function() {
        if (confirm('Are you sure you want to clear message history?')) {
            localStorage.removeItem('sc_dm_history');
            historySet = new Set();
            log('🗑️ History cleared', '#f59e0b');
        }
    };

    window.getAllFollowers = async function() {
        if (!window.location.href.includes('/followers')) {
            log('❌ Please run this on your followers page!', '#ef4444');
            return [];
        }

        log('📜 Starting auto-scroll to load ALL followers...', '#3b82f6');
        log('⏳ This may take 1-2 minutes. Please wait...', '#f59e0b');

        // Auto-scroll to bottom
        let previousHeight = 0;
        let noChangeCount = 0;
        let scrollAttempts = 0;
        const maxScrollAttempts = 200; // Prevent infinite loops

        while (scrollAttempts < maxScrollAttempts) {
            const currentHeight = document.body.scrollHeight;

            if (currentHeight === previousHeight) {
                noChangeCount++;
                if (noChangeCount >= 5) {
                    log('✓ Reached end of followers list', '#10b981');
                    break;
                }
            } else {
                noChangeCount = 0;
                log(`  Scrolling... (found ~${Math.floor(currentHeight / 200)} followers so far)`, '#3b82f6');
            }

            previousHeight = currentHeight;
            window.scrollBy(0, window.innerHeight);
            await new Promise(r => setTimeout(r, 800 + Math.random() * 400)); // 800-1200ms delay
            scrollAttempts++;
        }

        // Scroll back to top
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 1000));

        log('🔍 Extracting follower data from badgeList__item elements...', '#3b82f6');

        // Find all follower badge items
        const badgeItems = Array.from(document.querySelectorAll('.badgeList__item'));
        log(`  Found ${badgeItems.length} badge items`, '#3b82f6');

        const uniqueMap = new Map();

        badgeItems.forEach((item, index) => {
            try {
                // Find the heading element with the nickname
                const headingElement = item.querySelector('.userBadgeListItem__heading');

                // Find the link with href
                const linkElement = item.querySelector('a[href]');

                if (linkElement && headingElement) {
                    const url = linkElement.getAttribute('href');
                    const nickname = headingElement.textContent.trim();

                    // Only add valid profile links
                    if (url &&
                        url.startsWith('/') &&
                        !url.startsWith('//') &&
                        !url.includes('/you') &&
                        !url.includes('/likes') &&
                        !url.includes('/tracks') &&
                        nickname) {

                        if (!uniqueMap.has(url)) {
                            uniqueMap.set(url, {
                                nickname: nickname,
                                url: url,
                                fullUrl: window.location.origin + url
                            });
                        }
                    }
                }
            } catch (err) {
                // Skip items that don't have the expected structure
            }
        });

        const followers = Array.from(uniqueMap.values());

        log(`✅ Found ${followers.length} unique followers!`, '#10b981');
        log('📊 Sample:', '#3b82f6');
        console.log(followers.slice(0, 5));
        console.log('Full array:', followers);

        // Save to localStorage
        localStorage.setItem('sc_dm_all_followers', JSON.stringify({
            lastUpdated: new Date().toISOString(),
            total: followers.length,
            followers: followers,
        }));

        log('💾 Saved to localStorage as "sc_dm_all_followers"', '#10b981');
        log(`📋 Array format: [{ nickname: "user1", url: "/user1", fullUrl: "..." }, ...]`, '#3b82f6');

        return followers;
    };

    window.loadAllFollowers = function() {
        try {
            const data = localStorage.getItem('sc_dm_all_followers');
            if (!data) {
                log('❌ No saved followers found. Run getAllFollowers() first.', '#ef4444');
                return [];
            }
            const saved = JSON.parse(data);
            log(`📋 Loaded ${saved.total} followers from ${saved.lastUpdated}`, '#3b82f6');
            console.log('Followers:', saved.followers);
            return saved.followers;
        } catch (err) {
            log('❌ Error loading followers', '#ef4444');
            return [];
        }
    };

    // Auto-show helper on profile pages
    if (!window.location.href.includes('/followers') && currentQueue.length > 0) {
        log('👋 On profile page. Type: fillMessage()', '#3b82f6');
        log('   Then manually click Message button first!', '#f59e0b');
    }

    // Instructions
    log('📖 SEMI-AUTO DM SENDER LOADED', '#10b981');
    log('', '#3b82f6');
    log('Commands:', '#3b82f6');
    log('  getAllFollowers() - Extract all follower links to array', '#3b82f6');
    log('  loadAllFollowers() - Load previously saved followers', '#3b82f6');
    log('  startSemiAuto() - Start from followers page', '#3b82f6');
    log('  fillMessage() - Fill message text on profile page', '#3b82f6');
    log('  markSentAndNext() - Mark as sent and go to next', '#3b82f6');
    log('  skipUser() - Skip current user', '#3b82f6');
    log('  viewDMHistory() - View message history', '#3b82f6');
    log('  clearDMHistory() - Clear history', '#3b82f6');
    log('', '#3b82f6');
    log('🎯 Workflow:', '#f59e0b');
    log('  1. Go to followers page', '#f59e0b');
    log('  2. Type: getAllFollowers() - Auto-scrolls and extracts ALL followers', '#f59e0b');
    log('  3. Type: startSemiAuto(true) - Uses saved followers', '#f59e0b');
    log('  4. Click green button to open profile', '#f59e0b');
    log('  5. Manually click "Message" button', '#f59e0b');
    log('  6. Type: fillMessage()', '#f59e0b');
    log('  7. Review message, manually click "Send"', '#f59e0b');
    log('  8. Type: markSentAndNext()', '#f59e0b');
    log('  9. Repeat steps 4-8!', '#f59e0b');
    log('', '#3b82f6');
    log('📊 Data format returned by getAllFollowers():', '#3b82f6');
    log('  [', '#3b82f6');
    log('    { nickname: "user1", url: "/user1", fullUrl: "https://..." },', '#3b82f6');
    log('    { nickname: "user2", url: "/user2", fullUrl: "https://..." },', '#3b82f6');
    log('    ...', '#3b82f6');
    log('  ]', '#3b82f6');

})();
