const https = require('https');

exports.handler = async function(event) {
  const symbol = event.queryStringParameters.symbol;
  const type = event.queryStringParameters.type || 'quote';
  const query = event.queryStringParameters.query;
  const apiKey = process.env.FINNHUB_API_KEY;

  let path;
  if(type === 'quote') {
    path = `/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
  } else if(type === 'news') {
    path = `/api/v1/company-news?symbol=${symbol}&from=2026-04-13&to=2026-04-20&token=${apiKey}`;
  } else if(type === 'calendar') {
    path = `/api/v1/calendar/earnings?from=2026-04-20&to=2026-05-20&token=${apiKey}`;
  } else if(type === 'search') {
    path = `/api/v1/search?q=${encodeURIComponent(query)}&token=${apiKey}`;
  } else if(type === 'profile') {
    path = `/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`;
  }

  return new Promise((resolve) => {
    https.get(`https://finnhub.io${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: data
        });
      });
    }).on('error', (err) => {
      resolve({
        statusCode: 500,
        body: JSON.stringify({ error: err.message })
      });
    });
  });
};