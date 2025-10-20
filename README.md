# SoundCloud DM Sender

Automated tool to send personalized direct messages to SoundCloud followers using Tampermonkey.

## 📁 Project Structure

```
sc-dm/
├── all-in-one.user.js           # Main Tampermonkey script (sends DMs)
├── semi-auto-script.js          # Script to collect follower data
├── followers.json               # Your 2170 followers data
├── tampermonkey-minimal-test.js # Test script
└── test/                        # Test files
```

## 🚀 Quick Start

### Step 1: Collect Followers (Optional - already done!)

You already have `followers.json` with 2170 followers, so **skip this step**.

If you need to update your followers list:
1. Go to https://soundcloud.com/YOUR_USERNAME/followers
2. Open Console (F12)
3. Paste `semi-auto-script.js` content
4. Type: `getAllFollowers()`
5. Copy the output to `followers.json`

### Step 2: Install Tampermonkey

- **Chrome**: https://chrome.google.com/webstore/detail/tampermonkey/
- **Firefox**: https://addons.mozilla.org/firefox/addon/tampermonkey/

### Step 3: Install the Script

1. **Drag and drop** `all-in-one.user.js` into your browser
   - Or press **Cmd+O** → select `all-in-one.user.js`
2. Click **Install** when Tampermonkey prompts
3. Done! ✅

### Step 4: Send Messages

1. Go to **https://soundcloud.com**
2. Open Console (F12)
3. Type:
   ```javascript
   start()      // Send to 2 users
   start(10)    // Send to 10 users
   start(100)   // Send to 100 users
   ```

The script will automatically:
- Navigate to each follower's profile
- Click Message button
- Type personalized message with their nickname
- Send the message
- Move to next user
- Track who was messaged (no duplicates)

## 📝 Commands

| Command | What it does |
|---------|-------------|
| `start()` | Start sending (default: 2 users) |
| `start(N)` | Send to N users |
| `stop()` | Stop automation |
| `checkStatus()` | View progress |
| `viewHistory()` | See who was messaged |
| `clearHistory()` | Clear ALL history |
| `removeFromHistory("/username")` | Remove one user from history |
| `showLogs()` | Show log overlay on page |
| `hideLogs()` | Hide log overlay |
| `clearLogs()` | Clear log history |
| `testSendClick()` | Test if Send button works |
| `findSendButton()` | Debug Send button detection |

## ⚙️ Configuration

Edit inside `all-in-one.user.js`:

```javascript
const CONFIG = {
    MESSAGE: `Your message here with {nickname} placeholder`,
    MAX_PER_RUN: 2,              // Users per start()
    TYPING_DELAY_MIN: 35,        // Human-like typing (ms)
    TYPING_DELAY_MAX: 95,
    DELAY_BEFORE_NEXT: 30000,    // Wait 30s between users
};
```

## 🔍 Message Personalization

Use these placeholders in your message:
- `{nickname}` - User's display name (e.g., "DJ Johnny K")
- `{username}` - Same as nickname
- `{name}` - Same as nickname
- `{user}` - Same as nickname

**Example:**
```javascript
MESSAGE: `Hey {nickname}, the new Tonica is out!
If you are reading this, it means you appreciate true sound...`
```

Sends:
```
Hey DJ Johnny K, the new Tonica is out!
If you are reading this, it means you appreciate true sound...
```

## 📊 Data Format

`followers.json` structure:
```json
[
  {
    "nickname": "DJ Johnny K",
    "url": "/user-279578505",
    "fullUrl": "https://soundcloud.com/user-279578505"
  },
  {
    "nickname": "Jawher",
    "url": "/jawherr",
    "fullUrl": "https://soundcloud.com/jawherr"
  }
]
```

## 🛑 Stopping the Automation

**Method 1: Console**
```javascript
stop()
```

**Method 2: Close tab**
- Queue is saved in localStorage
- Continues when you reopen SoundCloud

**Method 3: Disable script**
- Click Tampermonkey icon → Toggle script OFF

## 📊 Persistent Log Overlay

The script now includes a **visual log overlay** that stays visible even when navigating between profiles!

**Features:**
- Shows real-time progress in bottom-right corner of the page
- Persists across page navigations (doesn't clear like console)
- Keeps last 50 log entries
- Auto-scrolls to show latest activity
- Color-coded messages (green = success, red = error, orange = warning)

**Commands:**
```javascript
showLogs()   // Show the overlay
hideLogs()   // Hide the overlay
clearLogs()  // Clear all log history
```

**Why it's useful:**
When the script navigates to different user profiles, the browser console clears. The persistent overlay lets you track what's happening throughout the entire automation process.

## 🔧 Troubleshooting

### Messages not sending?

1. Test the Send button:
   ```javascript
   testSendClick()
   ```

2. Check button detection:
   ```javascript
   findSendButton()
   ```

3. Look at console logs - they show detailed debug info

### Want to re-send to someone?

```javascript
removeFromHistory("/username")
```

### Clear everything and start over?

```javascript
clearHistory()
stop()
```

## ⚠️ Important Notes

- **Be respectful**: Don't spam users
- **Reasonable delays**: Default is 30 seconds between messages
- **Monitor for blocks**: SoundCloud may rate-limit if you send too fast
- **History is saved**: Users won't receive duplicate messages
- **Manual control**: You can stop anytime with `stop()`

## 📄 Files Explained

### `all-in-one.user.js`
Main Tampermonkey script. Contains:
- All 2170 followers embedded
- Message automation logic
- History tracking
- Human-like behavior (typing delays, keyboard events)

### `semi-auto-script.js`
Helper script to collect followers from SoundCloud. Features:
- Auto-scrolls to load all followers
- Extracts real nicknames (not just URLs)
- Returns JSON array format

### `followers.json`
Your follower data (2170 users). Already collected and ready to use.

### `tampermonkey-minimal-test.js`
Minimal test script to verify Tampermonkey is working.

## 🎯 Example Workflow

```bash
# 1. Install script (one-time)
# Drag all-in-one.user.js into browser → Install

# 2. Go to SoundCloud
# Open console (F12)

# 3. Start sending
start(5)  # Send to 5 users

# 4. Check progress
checkStatus()  # See: sent, skipped, failed

# 5. View history
viewHistory()  # See who received messages

# 6. Continue later
start(10)  # Send to 10 more (skips already-messaged users)
```

## 📞 Support

If something isn't working:
1. Check console for error messages
2. Use `findSendButton()` to debug
3. Make sure you're logged into SoundCloud
4. Try `testSendClick()` to test sending manually

## 🎵 Current Message

```
Hey {nickname}, the new Tonica is out!
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

https://soundcloud.com/andygart/tonica-8
```

---

**Status**: ✅ Ready to use - 2170 followers loaded
