const socket = io('http://localhost:9000');
//Send message when the client establishes the connection with the server
socket.on('connect', (data) => {
    socket.on('nsList', (namespaces) => {
       let namespacesDiv = document.querySelector('.namespaces');
       namespacesDiv.innerHTML = "";
       //Add the namespace list dynamically
       namespaces.forEach((namespace) => {
           namespacesDiv.innerHTML += `<div class="namespace" ns="${namespace.endpoint}"><img src="${namespace.img}"></div>`;
       });

    //Wait for above to lead
    var nameSpaceCollction = document.getElementsByClassName("namespace");
    var nameSpaceArray = Array.from(nameSpaceCollction); 
    (Array.from(nameSpaceCollction)).forEach((elm) => { 
      elm.addEventListener('click', (event) => { 
        console.log('clicked'); 
        const endpoint = elm.getAttribute('ns'); 
      }); 
    });
    joinNS('wiki');

  });
});


function joinNS(endpoint) {
  const nsSocket =  io(`http://localhost:9000/${endpoint}`);
  nsSocket.on('nsRoomLoad', (nsRooms) => {
    let roomList = document.querySelector('.room-list');
    roomList.innerHTML = '';
    nsRooms.forEach((room) => {
      const glyph = (room.privateRoom ? 'lock' : 'globe');
      roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`;
    });
    let roomNodes = document.getElementsByClassName('room');
    Array.from(roomNodes).forEach((room) => {
      room.addEventListener('click', (event) => {
        console.log(event.target.innerHTML);
      })
    })
  });

  nsSocket.on('messageToClients', (message) => {
    console.log(message);
    document.querySelector('#messages').innerHTML += `<li>${message.text}</li>`;
  });
  document.querySelector('.message-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    nsSocket.emit('newMessageToServer', {text: newMessage});
  })
}