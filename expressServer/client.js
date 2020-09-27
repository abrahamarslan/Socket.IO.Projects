const socket = io('http://localhost:9000');
console.log(socket);
//Send message when the client establishes the connection with the server
socket.on('connect', (data) => {
    //Listen to welcome event
    socket.emit('messageToServer', {data: 'Connection established: Message from client!'});
    socket.on('ping', () => {
        console.log('Client: Ping to Server');
    });
    socket.on('pong', (latency) => {
        console.log('Client: Pong from Server | Latency: ', latency);
    });
    const btn = document.querySelector('#btn-chat').addEventListener('click', (event) => {
        const btn = document.querySelector('#btn-input');
        const message = btn.value;
        socket.emit('post-message', {message, id: socket.id});
        btn.value = '';
    });
    socket.on('new-message', (data) => {
        const message = data.message;
        const chatClass = (message.id === socket.id ? 'right' : 'left');
        document.querySelector('.chat').innerHTML += `<li class="${chatClass} clearfix">
                            <span class="chat-img pull-${chatClass}">
                                <img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" class="img-circle" />
                            </span>
                            <div class="chat-body clearfix">
                                <div class="header">
                                    <strong class="primary-font">${message.id}</strong> <small class="pull-right text-muted">
                                    <span class="glyphicon glyphicon-time"></span>12 mins ago</small>
                                </div>
                                <p>
                                    ${message.message}
                                </p>
                            </div>
                        </li>`;
    });
});
