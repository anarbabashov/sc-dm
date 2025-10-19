#!/usr/bin/env node

/**
 * Simple test server for mock SoundCloud pages
 * Serves mock HTML pages to test the worker script
 */

import { createServer } from "http";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;

const server = createServer(async (req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  try {
    // Route: Followers page
    if (req.url === "/andygart/followers" || req.url === "/") {
      const html = await readFile(join(__dirname, "mock-followers.html"), "utf-8");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
      return;
    }

    // Route: Profile without message button
    if (req.url === "/test-user-no-message") {
      const html = await readFile(join(__dirname, "mock-profile-no-message.html"), "utf-8");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
      return;
    }

    // Route: Any other profile (valid profiles with message button)
    const profileMatch = req.url.match(/^\/([a-zA-Z0-9_-]+)$/);
    if (profileMatch) {
      const html = await readFile(join(__dirname, "mock-profile.html"), "utf-8");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
      return;
    }

    // 404
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  } catch (err) {
    console.error("Error:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("500 Internal Server Error");
  }
});

server.listen(PORT, () => {
  console.log(`\n🧪 Mock SoundCloud Test Server Running\n`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   Followers page: http://localhost:${PORT}/andygart/followers`);
  console.log(`\n💡 To test the worker:`);
  console.log(`   1. Update .env with: FOLLOWERS_URL=http://localhost:${PORT}/andygart/followers`);
  console.log(`   2. Set: MAX_PER_RUN=3`);
  console.log(`   3. Run: node worker.js\n`);
  console.log(`Press Ctrl+C to stop\n`);
});
