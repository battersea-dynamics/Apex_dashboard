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

  // ── REDDIT LIMIT: 50 posts per subreddit
  // TODO: increase to 100 when app becomes profitable (requires pagination)
  const REDDIT_LIMIT = 50;

  let finnhubUrl;

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
  } else if(type === 'social') {
    finnhubUrl = `https://finnhub.io/api/v1/stock/social-sentiment?symbol=${symbol}&from=${newsFrom}&to=${fmt(today)}&token=${finnhubKey}`;

  // ── REDDIT SUBREDDITS ──────────────────────────────────────────────────────
  // Trading & general investing
  } else if(type === 'reddit-wsb') {
    finnhubUrl = `https://www.reddit.com/r/wallstreetbets/hot.json?limit=${REDDIT_LIMIT}`;
  } else if(type === 'reddit-stocks') {
    finnhubUrl = `https://www.reddit.com/r/stocks/hot.json?limit=${REDDIT_LIMIT}`;
  } else if(type === 'reddit-investing') {
    finnhubUrl = `https://www.reddit.com/r/investing/hot.json?limit=${REDDIT_LIMIT}`;
  } else if(type === 'reddit-options') {
    finnhubUrl = `https://www.reddit.com/r/options/hot.json?limit=${REDDIT_LIMIT}`;
  } else if(type === 'reddit-stockmarket') {
    finnhubUrl = `https://www.reddit.com/r/StockMarket/hot.json?limit=${REDDIT_LIMIT}`;
  } else if(type === 'reddit-daytrading') {
    finnhubUrl = `https://www.reddit.com/r/Daytrading/hot.json?limit=${REDDIT_LIMIT}`;
  } else if(type === 'reddit-valueinvesting') {
    finnhubUrl = `https://www.reddit.com/r/ValueInvesting/hot.json?limit=${REDDIT_LIMIT}`;
  } else if(type === 'reddit-pennystocks') {
    finnhubUrl = `https://www.reddit.com/r/pennystocks/hot.json?limit=${REDDIT_LIMIT}`;
  // Biotech & pharma
  } else if(type === 'reddit-biotech') {
    finnhubUrl = `https://www.reddit.com/r/biotech/hot.json?limit=${REDDIT_LIMIT}`;
  } else if(type === 'reddit-pharma') {
    finnhubUrl = `https://www.reddit.com/r/investing/search.json?q=pharma&sort=hot&limit=${REDDIT_LIMIT}`;
  // Tech
  } else if(type === 'reddit-tech') {
    finnhubUrl = `https://www.reddit.com/r/technology/hot.json?limit=${REDDIT_LIMIT}`;
  } else if(type === 'reddit-securityanalysis') {
    finnhubUrl = `https://www.reddit.com/r/SecurityAnalysis/hot.json?limit=${REDDIT_LIMIT}`;
  // Energy & commodities
  } else if(type === 'reddit-energy') {
    finnhubUrl = `https://www.reddit.com/r/energy/hot.json?limit=${REDDIT_LIMIT}`;
  // Dividends & ETFs
  } else if(type === 'reddit-dividends') {
    finnhubUrl = `https://www.reddit.com/r/dividends/hot.json?limit=${REDDIT_LIMIT}`;
  } else if(type === 'reddit-etfs') {
    finnhubUrl = `https://www.reddit.com/r/ETFs/hot.json?limit=${REDDIT_LIMIT}`;
  }

  try {
    const isReddit = finnhubUrl && finnhubUrl.includes('reddit.com');
    const response = await fetch(finnhubUrl, isReddit ? {
      headers: {
        'User-Agent': 'APEX:StockDashboard:1.0 (personal project)'
      }
    } : {});
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
