const express = require('express');
const { fetch } = require('undici');
const router = express.Router();

// Resolve channelId from handle by scraping YouTube channel page
async function resolveChannelIdFromHandle(handle) {
  const normalized = handle.startsWith('@') ? handle : `@${handle}`;
  const url = `https://www.youtube.com/${normalized}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`Failed to fetch channel page: ${res.status}`);
  const html = await res.text();
  // Try various patterns that appear on channel pages
  const patterns = [
    /"channelId":"(UC[\w-]{22})"/,
    /"externalId":"(UC[\w-]{22})"/,
    /"browseId":"(UC[\w-]{22})"/,
    /\/channel\/(UC[\w-]{22})/
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m && m[1]) return m[1];
  }
  throw new Error('channelId not found for handle');
}

// Parse minimal fields from YouTube channel feed XML
function parseYouTubeFeed(xml, limit = 6) {
  const entries = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];
    const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
    const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
    if (!idMatch) continue;
    const id = idMatch[1];
    const title = titleMatch ? titleMatch[1] : 'Untitled';
    const published = publishedMatch ? publishedMatch[1] : null;
    entries.push({
      id,
      title,
      url: `https://www.youtube.com/watch?v=${id}`,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      published
    });
    if (entries.length >= limit) break;
  }
  return entries;
}

router.get('/youtube', async (req, res) => {
  try {
    const { handle, channelId: qChannelId, max } = req.query;
    const limit = Math.min(parseInt(max || '6', 10) || 6, 20);
    let channelId = qChannelId;
    if (!channelId) {
      if (!handle) return res.status(400).json({ error: 'handle_or_channelId_required' });
      channelId = await resolveChannelIdFromHandle(handle);
    }
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const resp = await fetch(feedUrl, { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/atom+xml' } });
    if (!resp.ok) throw new Error(`Feed fetch failed: ${resp.status}`);
    const xml = await resp.text();
    const items = parseYouTubeFeed(xml, limit);
    return res.json({ channelId, handle: handle || null, items });
  } catch (err) {
    return res.status(500).json({ error: 'youtube_fetch_failed', message: err.message });
  }
});

module.exports = router;
