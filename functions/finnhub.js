export async function onRequest(context) {
  const url = new URL(context.request.url);
  const symbol = url.searchParams.get('symbol');
  const type = url.searchParams.get('type') || 'quote';
  const query = url.searchParams.get('query');
  const finnhubKey = context.env.FINNHUB_API_KEY;
  const alphaKey = context.env.ALPHA_VANTAGE_KEY;

  const today = new Date();
  const pad = n => String(n).padStart(2,'0');
  const fmt = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const fromDate = fmt(today);
  const toDate = fmt(new Date(today.getTime() + 90*24*60*60*1000));
  const newsFrom = fmt(new Date(today.getTime() - 7*24*60*60*1000));

  let finnhubUrl;
  let useAlpha = false;

  if(type === 'quote') {
    finnhubUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubKey}`;
  } else if(type === 'news') {
    finnhubUrl = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${newsFrom}&to=${fmt(today)}&token=${finnhubKey}`;
  } else if(type === 'search') {
    finnhubUrl = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${finnhubKey}`;
  } else if(type === 'calendar') {
    finnhubUrl = `https://finnhub.io/api/v1/calendar/earnings?from=${fromDate}&to=${toDate}&token=${finnhubKey}`;
  } else if(type === 'earnings') {
    finnhubUrl = `https://finnhub.io/api/v1/calendar/earnings?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${finnhubKey}`;
  } else if(type === 'profile') {
    finnhubUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${finnhubKey}`;
  } else if(type === 'analyst') {
    finnhubUrl = `https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${finnhubKey}`;
  } else if(type === 'overview') {
    finnhubUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${alphaKey}`;
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