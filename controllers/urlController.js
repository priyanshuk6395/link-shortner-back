const URL = require("../models/url");

async function generateShortUrl(req, res) {
  const body = req.body;
  if (!body.url) return res.status(404).json({ error: "URL is required" });
  const { nanoid } = await import("nanoid"); // imported only when needed
  const shortId = await nanoid(8);
  await URL.create({
    shortId,
    redirectUrl: body.url,
    visitHistory: [],
    totalClicks: 0,
  });
  return res.status(201).json({ id: shortId });
}

async function FetchUrl(req, res) {
  try {
    const shortId = req.params.shortId?.trim();
    if (!shortId) {
      return res.status(400).json({ error: "shortID is required" });
    }
    const entry = await URL.findOneAndUpdate(
      { shortId: new RegExp(`^${shortId}$`, "i") },
      {
        $push: { visitHistory: { timeStamp: Date.now() } },
        $inc: { totalClicks: 1 },
      },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    let redirectUrl = entry.redirectUrl;
    if (!/^https?:\/\//i.test(redirectUrl)) {
      redirectUrl = "https://" + redirectUrl;
    }
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error in FetchUrl:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function Anayltics(req, res) {
  try {
    const shortId = req.params.shortId?.trim();
    if (!shortId) {
      return res.status(400).json({ error: "shortID is required" });
    }

    const entry = await URL.findOne(
      { shortId: new RegExp(`^${shortId}$`, "i") },
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    // Transform visit history to readable format
    const visitHistory = entry.visitHistory.map((visit) => ({
      visitedAt: new Date(visit.timeStamp).toISOString(),
    }));

    const response = {
      id: entry._id,
      shortUrlId: entry.shortId,
      originalUrl: entry.redirectUrl,
      totalClicks: entry.totalClicks,
      createdAt: new Date(entry.createdAt).toISOString(),
      updatedAt: new Date(entry.updatedAt).toISOString(),
      visitHistory: visitHistory,
    };

    return res.status(200).json({ data: response });

  } catch (error) {
    console.error("Error in Analytics:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


module.exports = { generateShortUrl, FetchUrl,Anayltics };
