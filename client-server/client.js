const ws = new WebSocket('ws://localhost:8000');

//Send message when the client establishes the connection with the server
ws.onopen = (event) => {
    ws.send('Hello, you are now connected to the client!');
}
ws.onmessage = (event) => {
    console.log(event);
}
