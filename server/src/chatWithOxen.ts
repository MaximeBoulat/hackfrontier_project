import 'dotenv/config'

interface OxenContent {
    text: string
}

interface OxenResponse {
    model: string,
    output: {
        content: OxenContent[],
        role: string,
        status: string,
        type: string
    }
}


export async function chatWithOxen(msg: string): Promise<string> {
    const response = await fetch('https://hub.oxen.ai/api/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OXEN_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "google:gemini-2_5-pro-preview-05-06",
            messages: [
                {
                    role: 'user', content: msg
                },
            ]
        })
    });
    const data : OxenResponse = await response.json();
    if (data.output.content.length !==1 ){
        throw Error("Unexpected response length")
    }
    return data.output.content[0].text
}
