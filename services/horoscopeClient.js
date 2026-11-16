
/**
 * Pulls the horoscope text out of the different shapes free APIs use.
 * @param {object} body - Parsed JSON body.
 * @returns {string} The text, or '' when none is found.
 */
function extractText(body) {
  const candidates = [
    body && body.data && body.data.horoscope_data,
    body && body.horoscope,
    body && body.description,
    body && body.prediction
  ];
  const text = candidates.find((value) => typeof value === 'string' && value.trim());
  return text ? text.trim() : '';
}

/**
 * Creates a client for a free horoscope API. The URL comes from the environment
 * (HOROSCOPE_API_URL) as a template where {sign} is replaced by the sign name.
 * Without a URL the client is "not configured" and callers use the local readings.
 * @param {object} [options]
 * @param {string} [options.baseUrl=''] - URL template, e.g. https://example.com/daily?sign={sign}
 * @param {Function} [options.fetchImpl=globalThis.fetch] - fetch implementation (mocked in tests).
 * @param {number} [options.timeoutMs=3000] - Maximum time to wait for the API.
 * @returns {{isConfigured: function(): boolean, getDailyHoroscope: function(string): Promise<string>}}
 */
function createHoroscopeClient({ baseUrl = '', fetchImpl = globalThis.fetch, timeoutMs = 3000 } = {}) {
  return {
    isConfigured() {
      return Boolean(baseUrl);
    },

    /**
     * Fetches today's horoscope text of a sign.
     * @param {string} sign - Lower-case sign name.
     * @returns {Promise<string>} The horoscope text.
     */
    async getDailyHoroscope(sign) {
      if (!baseUrl) {
        throw new Error('Horoscope API is not configured');
      }
      const name = sign.charAt(0).toUpperCase() + sign.slice(1);
      const url = baseUrl.replace('{sign}', encodeURIComponent(name));
      const response = await fetchImpl(url);
      if (!response.ok) {
        throw new Error(`Horoscope API responded with ${response.status}`);
      }
      const text = extractText(await response.json());
      if (!text) {
        throw new Error('Horoscope API returned no text');
      }
      return text;
    }
  };
}

module.exports = { createHoroscopeClient };
