export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    // Temporary debug — shows if key is being received
    return new Response(JSON.stringify({
      hasKey: !!env.FINNHUB_API_KEY,
      keyLength: env.FINNHUB_API_KEY ? env.FINNHUB_API_KEY.length : 0,
      type: type
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};