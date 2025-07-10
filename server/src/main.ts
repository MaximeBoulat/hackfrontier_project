import express, { Request, Response } from 'express';
import cors from 'cors';
import { chatWithOxen } from './chatWithOxen.js';

const app = express();
const port = 8080;


interface ChatRequest {
  message: string
}

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world jack test!');
});

app.use(express.json()); // This middleware parses incoming JSON requests
app.use(cors())

app.post('/chat', async (req: Request, res: Response) => {
  const { message } : ChatRequest = req.body;
  if (typeof message !== 'string') {
    res.status(400).json({ error: 'Missing or invalid "message" field' });
  }
  const resp = await chatWithOxen(message);
  res.json({chatResponse: resp});
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});