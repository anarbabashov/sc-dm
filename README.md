# SoundCloud DM Worker

Robust Puppeteer automation to send direct messages to your SoundCloud followers. Single-file, human-like behavior, conservative timing to avoid anti-bot detection.

## Features

- **Message personalization** - use `{nickname}` to insert follower's username
- **Duplicate prevention** - automatic history tracking, never messages the same user twice
- **Persistent session** - log in once, session saved forever
- **Chrome browser support** - use your existing Chrome to avoid login issues
- **Human-like behavior** - realistic typing delays, mouse movements, random pauses
- **Conservative timing** - 30s-5min delays between users, occasional longer breaks
- **Automated scheduling** - cron integration for hands-free operation
- **Robust selectors** - multiple fallback strategies for Message/Send buttons
- **Error handling** - automatic screenshots on failure, graceful degradation
- **Captcha detection** - stops execution if anti-bot measures detected
- **Sequential processing** - one user at a time, no mass parallelism
- **Mock testing** - test locally before running on real followers

## Requirements

- Node.js 18+
- npm or pnpm

## Installation

```bash
npm install
# or
pnpm install
```

Dependencies:
- `puppeteer-extra`
- `puppeteer-extra-plugin-stealth`
- `dotenv`

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your configuration:
   ```env
   MESSAGE=Your message here
   MAX_PER_RUN=5
   FOLLOWERS_URL=https://soundcloud.com/andygart/followers
   ```

### Message Personalization

You can personalize messages with the follower's username using placeholders:

```env
# Use {nickname}, {username}, {name}, or {user}
MESSAGE=Hey {nickname}! Thanks for following.
```

**Example:**
- Profile: `/johndoe`
- Message template: `Hey {nickname}! Check out my new track.`
- Actual message sent: `Hey johndoe! Check out my new track.`

**Supported placeholders:**
- `{nickname}` - Most natural (recommended)
- `{username}` - Same as nickname
- `{name}` - Same as nickname
- `{user}` - Same as nickname

All placeholders are **case-insensitive** (`{NICKNAME}`, `{Nickname}`, `{nickname}` all work).

## Testing with Mock Data

**Recommended:** Test the script locally before running on real SoundCloud.

### Quick Test

Terminal 1 - Start mock server:
```bash
npm run test:server
```

Terminal 2 - Run worker against mock data:
```bash
npm run test:worker
```

This will:
- Serve mock SoundCloud pages at `http://localhost:3000`
- Run the worker against 3 mock profiles
- Let you verify the full flow (scroll, extract, message, send)
- No risk of hitting SoundCloud rate limits or captchas

See [test/README.md](test/README.md) for detailed testing guide.

## Usage

### Manual Run

```bash
node worker.js
# or
npm start
```

### Automated Scheduling (Recommended)

Set up automatic runs 6 times/day (9 AM - 11 PM):

```bash
npm run cron:setup
```

**Schedule:** 9AM, 12PM, 3PM, 6PM, 9PM, 11PM
**Volume:** 120 users/day (6 runs × 20 users)
**Timeline:** ~17 days for 2000 users

**Manage automation:**
```bash
npm run cron:list    # View installed jobs
npm run logs         # Monitor runs in real-time
npm run cron:remove  # Stop automation
```

See [CRON.md](CRON.md) for complete automation guide.

### First Run

On first run, the script will:
1. Launch a browser window (headful mode)
2. Navigate to your followers page
3. Detect you're not logged in
4. Pause and wait for you to log in manually
5. Once logged in, your session is saved to `./profile-andygart/`
6. Subsequent runs will reuse this session

### What It Does

1. Opens your SoundCloud followers page
2. Auto-scrolls for up to 60s to load follower profiles
3. Extracts unique profile links (excludes `/you`, `/likes`, `/tracks`, etc.)
4. For each follower (up to `MAX_PER_RUN`):
   - Opens profile in new tab
   - Adds human-like delays and mouse movements
   - Clicks "Message" button
   - Types your message with realistic delays (35-95ms per character)
   - Sends the message
   - Closes tab
   - Waits 30s-5min before next user (with occasional longer breaks)

5. Prints summary and JSON results at the end

## Message History & Duplicate Prevention

The script automatically tracks who you've already messaged to **prevent duplicate messages**.

### How It Works

- Every successful message is saved to `sent-history.json`
- On each run, already-messaged users are automatically filtered out
- Works across multiple runs, even weeks/months apart
- Crash-safe: saves after each successful send

### Example Workflow

**First run:**
```bash
node worker.js
# Finds 100 followers, messages first 5
# sent-history.json now contains 5 users
```

**Second run:**
```bash
node worker.js
# Finds 100 followers, filters out 5 already-messaged
# Messages next 5 from remaining 95
# sent-history.json now contains 10 users
```

**After interruption/crash:**
```bash
node worker.js
# Automatically skips anyone already in sent-history.json
# Continues from where it left off
```

### Managing History

**View message history:**
```bash
cat sent-history.json
```

Output:
```json
{
  "lastUpdated": "2025-01-18T10:30:00.000Z",
  "totalMessaged": 15,
  "messaged": [
    "/user1",
    "/user2",
    "/user3",
    ...
  ]
}
```

**Reset history (start fresh):**
```bash
rm sent-history.json
# Next run will message everyone again
```

**Backup history:**
```bash
cp sent-history.json sent-history-backup.json
```

### In The Output

```
📋 Loading message history...
  ✓ Found 10 previously messaged users
  ✓ Filtered out 10 already-messaged users

📨 Processing 5 followers...
```

Summary includes history stats:
```
==================================================
📊 SUMMARY
==================================================
Found profiles:     100
Already messaged:   10
Processed:          5
Successfully sent:  5
...
==================================================
```

### Output

```
🚀 SoundCloud DM Worker Starting...

Config:
  - Message: "Hey! Thanks for following."
  - Max per run: 5
  - Followers URL: https://soundcloud.com/andygart/followers
  - User data dir: ./profile-andygart

🌐 Launching browser (headful mode)...
📍 Navigating to https://soundcloud.com/andygart/followers...
✅ Already logged in

📜 Auto-scrolling to load followers (max 60s)...
  ✓ Reached end of followers list
🔍 Extracting follower profile links...
  ✓ Found 42 unique follower profiles

📨 Processing 5 followers...

[1/5] Processing /user1...
  ✅ Message sent successfully
  ⏱️  Waiting 127s before next user...

[2/5] Processing /user2...
  ⏭️  Skipped: Message button not found
  ⏱️  Waiting 83s before next user...

...

==================================================
📊 SUMMARY
==================================================
Found profiles:     42
Processed:          5
Successfully sent:  4
Skipped:            1
Failed:             0
==================================================

JSON Result:
{
  "found": 42,
  "processed": 5,
  "sent": 4,
  "failed": 0,
  "skipped": 1,
  "details": [...]
}
```

## Configuration

All timing and behavior settings are at the top of `worker.js` in the `CONFIG` object:

```javascript
const CONFIG = {
  MESSAGE: process.env.MESSAGE || "Hey! Thanks for following.",
  MAX_PER_RUN: parseInt(process.env.MAX_PER_RUN || "5", 10),
  FOLLOWERS_URL: process.env.FOLLOWERS_URL || "...",

  // Timing configs (in ms)
  SCROLL_DURATION: 60000,        // Max scroll time
  DELAY_BETWEEN_USERS_MIN: 30000,   // 30s minimum
  DELAY_BETWEEN_USERS_MAX: 300000,  // 5min maximum
  TYPING_DELAY_MIN: 35,
  TYPING_DELAY_MAX: 95,
  // ...
};
```

### Adjusting for Speed vs Safety

**For faster processing** (higher risk):
- Reduce `DELAY_BETWEEN_USERS_MIN/MAX` to 10-30s
- Increase `MAX_PER_RUN` to 20-50

**For safer processing** (lower risk):
- Keep defaults or increase delays
- Keep `MAX_PER_RUN` low (5-10)
- Run multiple times per day instead of bulk runs

## HOTSPOTS for Customization

The code includes `HOTSPOT` comments at key locations you might need to adjust:

1. **Typing speed** - `typeHuman()` function (worker.js:50)
2. **Scroll duration** - `autoScroll()` function (worker.js:151)
3. **Profile link pattern** - `extractFollowerLinks()` (worker.js:188)
4. **Message button selectors** - `clickMessageButton()` (worker.js:248)
5. **Composer selectors** - `focusComposer()` (worker.js:302)
6. **Delay timing** - `CONFIG` object (worker.js:16)

## Error Handling

- **Screenshots**: Saved to `./error-{username}-{timestamp}.png` on failures
- **Captcha**: Script stops immediately if captcha detected
- **Retries**: No automatic retries (to avoid being flagged)
- **Skip**: If Message button not found, marks as "skipped" and continues

## Anti-Bot Hygiene

This script uses conservative, non-evasive measures:

- Headful browser (not headless)
- Stealth plugin to mask automation
- Human-like typing delays (35-95ms per character)
- Random mouse movements and scrolling
- Low throughput (5-10 per run recommended)
- Long delays between users (30s-5min with jitter)
- Occasional longer breaks (20% chance of 2x delay)

**Not included**: Proxy rotation, captcha solving, mass parallelism (all out of scope).

## Troubleshooting

### "Message button not found"
SoundCloud may have changed their UI. Update selectors in `clickMessageButton()` function.

### "Captcha detected"
- Wait 24-48 hours before next run
- Reduce `MAX_PER_RUN`
- Increase delays between users

### Session expired
Delete `./profile-andygart/` folder and log in again.

### Can't log in / "Unexpected error" / Google blocks Chromium

**Problem:** SoundCloud shows "unexpected error" or Google login says "This browser is not safe"

**Solution:** Use your existing Chrome browser instead of Chromium

1. **Terminal 1 - Launch Chrome with debugging:**
   ```bash
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir="$HOME/Library/Application Support/Google/Chrome"
   ```

2. **Update `.env`:**
   ```env
   USE_EXISTING_CHROME=true
   CHROME_DEBUG_PORT=9222
   ```

3. **Terminal 2 - Run worker:**
   ```bash
   node worker.js
   ```

The script will connect to your Chrome (where you're already logged in) instead of launching Chromium.

See [CHROME-LOGIN-FIX.md](CHROME-LOGIN-FIX.md) for detailed instructions.

### Script hangs
- Check browser window for manual interaction needed
- Look for captcha or login prompts

## Safety & Ethics

- **Rate limits**: Start with 5-10 messages per run
- **Frequency**: Don't run multiple times per hour
- **Content**: Keep messages personal and relevant
- **Consent**: Only message people who followed you
- **Compliance**: Respect SoundCloud's ToS

## License

MIT
