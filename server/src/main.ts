import express, { Request, Response } from 'express';
import cors from 'cors';
import { chatWithOxen } from './chatWithOxen.js';
import multer from 'multer';
import { EyePop } from '@eyepop.ai/eyepop'
import 'dotenv/config'




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

app.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const imageBuffer: Buffer = req.file.buffer;

  console.log('Image buffer size:', imageBuffer.length);

  const EYEPOP_SECRET_KEY = process.env.EYEPOP_SECRET_KEY
  if (!EYEPOP_SECRET_KEY) {
    throw Error("no secret key");
  }
  const EYEPOP_POP_ID = process.env.EYEPOP_POP_ID
  if (!EYEPOP_POP_ID) {
    throw Error("no eyepop id key");
  }

  // You can now process the buffer (e.g., save to disk, upload to S3, etc.)
  const endpoint = EyePop.workerEndpoint({
    // By default the SDK will use these environment vars. This can be omitted
    popId: EYEPOP_POP_ID,
    // By default the SDK will use these environment vars. This can be omitted
    auth: { secretKey: EYEPOP_SECRET_KEY },
  });
  await endpoint.connect()
  try {
    // let results = await endpoint.process({path: example_image_path})
    let resultsP = await endpoint.process({ stream: imageBuffer, mimeType: 'image/jpeg' });
    let results = [];
    for await (let result of resultsP) {
      results.push(result);
    }
    res.send(results);
  } catch (e) {
    console.error("Error uploading");
    console.error(e);
  }
  finally {
    await endpoint.disconnect()
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});