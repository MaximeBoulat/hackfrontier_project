console.log("running test chat")
const resp = await fetch("http://localhost:8080/chat", {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: "give a short sample response no more than 2 sentences" })
});
console.log(await resp.json())
