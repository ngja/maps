import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

// Naver Directions API proxy endpoint
app.get('/api/directions', async (req, res) => {
  try {
    const { start, goal, option = 'trafast' } = req.query;

    if (!start || !goal) {
      return res.status(400).json({ error: 'start and goal parameters are required' });
    }

    const url = `https://maps.apigw.ntruss.com/map-direction/v1/driving?start=${start}&goal=${goal}&option=${option}`;

    const response = await fetch(url, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': process.env.VITE_NAVER_MAPS_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': process.env.VITE_NAVER_MAPS_CLIENT_SECRET,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Naver API Error:', errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
