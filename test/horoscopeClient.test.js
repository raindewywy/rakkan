const { createHoroscopeClient, HoroscopeTimeoutError } = require('../services/horoscopeClient');

function okResponse(body) {
  return { ok: true, status: 200, json: () => Promise.resolve(body) };
}

describe('createHoroscopeClient', () => {
  test('is not configured without a URL', async () => {
    const client = createHoroscopeClient({ baseUrl: '' });

    expect(client.isConfigured()).toBe(false);
    await expect(client.getDailyHoroscope('leo')).rejects.toThrow('not configured');
  });

  test('puts the sign into the URL and reads the text from the response', async () => {
    const fetchImpl = jest.fn(() => Promise.resolve(okResponse({ data: { horoscope_data: ' Be brave. ' } })));
    const client = createHoroscopeClient({ baseUrl: 'https://example.test/daily?sign={sign}', fetchImpl });

    const text = await client.getDailyHoroscope('leo');

    expect(fetchImpl.mock.calls[0][0]).toBe('https://example.test/daily?sign=Leo');
    expect(text).toBe('Be brave.');
  });

  test('throws when the API answers with an error status', async () => {
    const fetchImpl = jest.fn(() => Promise.resolve({ ok: false, status: 500 }));
    const client = createHoroscopeClient({ baseUrl: 'https://example.test/{sign}', fetchImpl });

    await expect(client.getDailyHoroscope('leo')).rejects.toThrow('500');
  });

  test('throws when the response has no text', async () => {
    const fetchImpl = jest.fn(() => Promise.resolve(okResponse({})));
    const client = createHoroscopeClient({ baseUrl: 'https://example.test/{sign}', fetchImpl });

    await expect(client.getDailyHoroscope('leo')).rejects.toThrow('no text');
  });

  test('gives up with a timeout error when the API is too slow', async () => {
    const fetchImpl = jest.fn(
      (url, { signal }) =>
        new Promise((resolve, reject) => {
          signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
        })
    );
    const client = createHoroscopeClient({ baseUrl: 'https://example.test/{sign}', fetchImpl, timeoutMs: 20 });

    await expect(client.getDailyHoroscope('leo')).rejects.toBeInstanceOf(HoroscopeTimeoutError);
  });
});
