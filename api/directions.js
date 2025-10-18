// Vercel Serverless Function for Naver Directions API
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { start, goal, option = 'trafast' } = req.query;

    if (!start || !goal) {
      res.status(400).json({ error: 'start and goal parameters are required' });
      return;
    }

    const clientId = process.env.VITE_NAVER_MAPS_CLIENT_ID;
    const clientSecret = process.env.VITE_NAVER_MAPS_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      res.status(500).json({ error: 'Server configuration error: Missing API credentials' });
      return;
    }

    const url = `https://maps.apigw.ntruss.com/map-direction/v1/driving?start=${start}&goal=${goal}&option=${option}`;

    const response = await fetch(url, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': clientId,
        'X-NCP-APIGW-API-KEY': clientSecret,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Naver API Error:', errorText);
      res.status(response.status).json({ error: errorText });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
