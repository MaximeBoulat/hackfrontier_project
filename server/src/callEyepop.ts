import{ Prediction, EyePop } from "@eyepop.ai/eyepop";

export async function callEyepop(imageBuffer : Buffer) : Promise<Prediction[]> {
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
    return results;
  } catch (e) {
    console.error("Error uploading");
    console.error(e);
    return [];
  }
  finally {
    await endpoint.disconnect()
  }
}