import { EyePop } from '@eyepop.ai/eyepop'
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import 'dotenv/config'

const EYEPOP_SECRET_KEY = process.env.EYEPOP_SECRET_KEY
if(!EYEPOP_SECRET_KEY){
    throw Error("no secret key");
}
const EYEPOP_POP_ID = process.env.EYEPOP_POP_ID
if(!EYEPOP_POP_ID){
    throw Error("no eyepop id key");
}

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the image path
const example_image_path = path.resolve(__dirname, '..', 'images','bottles2.jpg');
const imageBuffer = fs.readFileSync(example_image_path);

console.log(example_image_path);
(async() => {
    const endpoint = EyePop.workerEndpoint({
        // By default the SDK will use these environment vars. This can be omitted
        popId: EYEPOP_POP_ID,
        // By default the SDK will use these environment vars. This can be omitted
        auth : {secretKey: EYEPOP_SECRET_KEY},
    });
    await endpoint.connect()
    try {
        // let results = await endpoint.process({path: example_image_path})
        let results = await endpoint.process({stream: imageBuffer, mimeType: 'image/jpeg'});
        for await (let result of results) {
            console.log(result)
        }        
    } catch (e){
        console.error("Error uploading");
        console.error(e);
    } 
    finally {
        await endpoint.disconnect()
    }
})();