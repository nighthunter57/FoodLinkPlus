import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors()); // allow your frontend to call the backend

app.get('/restaurants', async (req, res) => {
  try {
    const restaurants = await prisma.newrestaurants.findMany();
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching restaurants' });
  }
});

const PORT = 4000;
console.log("Starting server…")
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
