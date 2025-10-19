# Test Setup for SoundCloud DM Worker

This directory contains mock pages and a test server to verify the worker script locally before running it on real SoundCloud.

## Files

- `test-server.js` - Simple HTTP server serving mock pages
- `mock-followers.html` - Simulates SoundCloud followers page with profile links
- `mock-profile.html` - Generic profile page with Message button and composer
- `mock-profile-no-message.html` - Profile without Message button (to test skip logic)

## Quick Start

### 1. Start the Test Server

In terminal 1:

```bash
npm run test:server
```

This will start a server at `http://localhost:3000` with:
- Followers page: `http://localhost:3000/andygart/followers`
- Mock profiles: `http://localhost:3000/test-user-1`, etc.

### 2. Run the Worker in Test Mode

In terminal 2:

```bash
npm run test:worker
```

This runs the worker with `.env.test` configuration pointing to localhost.

Alternatively, you can manually:

```bash
# Copy test config
cp .env.test .env

# Run worker
node worker.js
```

## What the Test Will Do

1. Launch browser (headful) to `http://localhost:3000/andygart/followers`
2. Auto-scroll the mock followers page
3. Extract profile links (should find ~8 valid profiles)
4. Process first 3 profiles (as set in `.env.test`)
   - `test-user-1`: ✅ Should send successfully
   - `test-user-2`: ✅ Should send successfully
   - `test-user-3`: ✅ Should send successfully
5. Skip `test-user-no-message` (no Message button)
6. Print summary with JSON results

## Expected Output

```
🚀 SoundCloud DM Worker Starting...

Config:
  - Message: "Hey! This is a test message from the automation script."
  - Max per run: 3
  - Followers URL: http://localhost:3000/andygart/followers
  - User data dir: ./profile-andygart

🌐 Launching browser (headful mode)...
📍 Navigating to http://localhost:3000/andygart/followers...
✅ Already logged in

📜 Auto-scrolling to load followers (max 60s)...
  ✓ Reached end of followers list
🔍 Extracting follower profile links...
  ✓ Found 8 unique follower profiles

📨 Processing 3 followers...

[1/3] Processing /test-user-1...
  ✅ Message sent successfully
  ⏱️  Waiting XXs before next user...

[2/3] Processing /test-user-2...
  ✅ Message sent successfully
  ⏱️  Waiting XXs before next user...

[3/3] Processing /test-user-3...
  ✅ Message sent successfully

==================================================
📊 SUMMARY
==================================================
Found profiles:     8
Processed:          3
Successfully sent:  3
Skipped:            0
Failed:             0
==================================================
```

## What to Verify

Watch the browser window to confirm:

1. **Followers Page**
   - Scrolls automatically
   - Yellow test banner visible
   - Links to profiles extracted

2. **Profile Pages** (for each user)
   - New tab opens
   - Mouse moves randomly
   - "Message" button is clicked
   - Modal opens with textarea
   - Text is typed character-by-character (35-95ms delays)
   - "Send" button is clicked or Enter is pressed
   - Tab closes

3. **Timing**
   - Realistic typing speed (watch individual characters appear)
   - Long delays between users (30s-5min)
   - Occasional mouse movements/scrolls

4. **Console Output**
   - Clear progress for each user
   - Success/skip/error messages
   - Final summary matches expectations

## Testing Different Scenarios

### Test Skip Logic

Modify `.env.test` to include the no-message profile:

```env
MAX_PER_RUN=6
```

Run again. When it reaches `test-user-no-message`, it should:
- Attempt to find Message button
- Fail after trying all selectors
- Mark as "skipped"
- Continue to next profile

Expected output:
```
[X/X] Processing /test-user-no-message...
  ⏭️  Skipped: Message button not found
```

### Test Different Timing

Edit `worker.js` CONFIG object (line 16) temporarily:

```javascript
// Faster testing (WARNING: Don't use in production!)
DELAY_BETWEEN_USERS_MIN: 3000,   // 3s
DELAY_BETWEEN_USERS_MAX: 10000,  // 10s
TYPING_DELAY_MIN: 10,
TYPING_DELAY_MAX: 30,
```

This will make the test run much faster for verification.

### Test Error Handling

Manually stop the test server mid-run to trigger navigation errors and verify:
- Error screenshots are captured
- Script continues to next user or exits gracefully
- Summary shows failed count

## Mock Data Structure

### Valid Profiles (8 total)
Extracted from mock-followers.html:
- `/test-user-1` through `/test-user-8`

### Excluded Profiles
These should NOT be extracted:
- `/you` - Your own profile
- `/test-user-1/tracks` - Sub-pages
- `/test-user-2/likes` - Sub-pages

### Special Profile
- `/test-user-no-message` - No Message button (tests skip logic)

## Server Logs

The test server logs all requests:

```
2025-01-XX - GET /andygart/followers
2025-01-XX - GET /test-user-1
2025-01-XX - GET /test-user-2
2025-01-XX - GET /test-user-3
```

This confirms which profiles the worker visited.

## Troubleshooting

### "Connection refused"
Make sure test server is running: `npm run test:server`

### Browser doesn't open
Check that puppeteer is installed: `npm install`

### Wrong .env used
Make sure to either:
- Copy `.env.test` to `.env`, OR
- Use `npm run test:worker` which loads `.env.test`

### No profiles found
Check browser console - the mock page should load with yellow banner

## After Testing

Once you've verified everything works with mock data:

1. Restore original `.env` with real SoundCloud URL
2. Update `MAX_PER_RUN` to your desired value (5-10 recommended)
3. Run: `node worker.js`

The worker will:
- Navigate to real SoundCloud
- Prompt for login if needed (first time)
- Process real followers

## Tips

- Keep test server running for multiple test iterations
- Use test mode to tweak selectors/timing safely
- Screenshots from tests go to project root (error-*.png)
- Delete `./profile-andygart/` between tests if needed (to test login flow)

## Next Steps

After successful local testing:
1. Review timing configs in `worker.js` CONFIG object
2. Set conservative values for real run (defaults are good)
3. Start with MAX_PER_RUN=5 for first real run
4. Monitor for captchas or rate limits
