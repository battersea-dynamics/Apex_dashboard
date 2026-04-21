export async function onRequest(context) {
  const url = new URL(context.request.url);
  const symbol = url.searchParams.get('symbol');
  const type = url.searchParams.get('type') || 'quote';
  const query = url.searchParams.get('query');
  const apiKey = context.env.FINNHUB_API_KEY;

  let finnhubUrl;
  if(type === 'quote') {
    finnhubUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
  } else if(type === 'news') {
    finnhubUrl = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=2026-04-13&to=2026-04-21&token=${apiKey}`;
  } else if(type === 'search') {
    finnhubUrl = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${apiKey}`;
  } else if(type === 'calendar') {
    finnhubUrl = `https://finnhub.io/api/v1/calendar/earnings?from=2026-04-21&to=2026-05-21&token=${apiKey}`;
  } else if(type === 'profile') {
    finnhubUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`;
  }

  try {
    const response = await fetch(finnhubUrl);
    const data = await response.text();
    return new Response(data, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch(err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}