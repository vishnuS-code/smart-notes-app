const translate = async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    if (!text?.trim() || !targetLanguage?.trim()) {
      return res.status(400).json({ error: 'text and targetLanguage are required' });
    }

    // Dynamic import required because @vitalets/google-translate-api is ESM-only
    const { translate: googleTranslate } = await import('@vitalets/google-translate-api');

    const result = await googleTranslate(text, { to: targetLanguage });
    res.json({ translatedText: result.text });
  } catch (err) {
    console.error('Translation error:', err.message);
    if (err.name === 'TooManyRequestsError') {
      return res.status(429).json({ error: 'Translation rate limit exceeded. Please wait and try again.' });
    }
    res.status(500).json({ error: 'Translation failed' });
  }
};

module.exports = { translate };
