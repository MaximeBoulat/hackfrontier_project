import express, { Request, Response } from 'express';
import cors from 'cors';
import { chatWithOxen } from './chatWithOxen.js';
import multer from 'multer';
import { EyePop } from '@eyepop.ai/eyepop'
import 'dotenv/config'
import { callEyepop } from './callEyepop.js';


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
  const { message }: ChatRequest = req.body;
  if (typeof message !== 'string') {
    res.status(400).json({ error: 'Missing or invalid "message" field' });
  }
  const resp = await chatWithOxen(message);
  res.json({ chatResponse: resp });
});

// Use multer with memory storage to get the file buffer directly
const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload-story', upload.single('image'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const imageBuffer: Buffer = req.file.buffer;
  const eyepopResults = await callEyepop(imageBuffer)
  const oxenResult = await chatWithOxen(`
    Give an interesting summary this scene: 
    ${JSON.stringify(eyepopResults)}  
  `)
  res.send(oxenResult);

});


app.post('/upload-inventory', upload.single('image'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const imageBuffer: Buffer = req.file.buffer;
  const eyepopResults = await callEyepop(imageBuffer)
  console
  const oxenResult = await chatWithOxen(`
    You are an inventory management system, give a list of the items in the message formatted as a nice html table typical of an advanced inventory management system UI. Do not include any other text in your response:
    ${JSON.stringify(eyepopResults)}  
  `)
  res.send(oxenResult);

});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});