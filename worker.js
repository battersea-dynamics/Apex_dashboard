export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    return new Response(JSON.stringify({
      hasKey: !!env.FINNHUB_API_KEY,
      keyLength: env.FINNHUB_API_KEY ? env.FINNHUB_API_KEY.length : 0,
      fullUrl: request.url,
      searchParams: Object.fromEntries(url.searchParams),
      type: url.searchParams.get('type'),
      symbol: url.searchParams.get('symbol')
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};