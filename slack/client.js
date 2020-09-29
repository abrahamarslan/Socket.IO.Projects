const socket = io('http://localhost:9000');
var nsSocket = "";
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
  nsSocket =  io(`http://localhost:9000/${endpoint}`);
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
    // On joining a namespace, join the first room automatically and load its chats
    const topRoom = document.querySelector('.room');
    const topRoomName = topRoom.innerText;
    joinRoom(topRoomName)
  });

  nsSocket.on('messageToClients', (message) => {
    console.log(message);
    document.querySelector('#messages').innerHTML += messageHTML(message);
  });
  document.querySelector('.message-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const messageSelector = document.querySelector('#user-message');
    const newMessage = messageSelector.value;
    nsSocket.emit('newMessageToServer', newMessage);
    messageSelector.value = '';
  })
}

function joinRoom(roomToJoin) {
  nsSocket.emit('joinRoom', roomToJoin, (memberCount) => {
    document.querySelector('.curr-room-num-users').innerHTML = `${memberCount} <span class="glyphicon glyphicon-user">`;
  })
}

function messageHTML(message) {
  const dateLocalString = new Date(message.time).toLocaleString();
  const html = `
  <li>
      <div class="user-image">
          <img src="${message.avatar}" />
      </div>
      <div class="user-message">
          <div class="user-name-time">${message.username} <span>${dateLocalString}</span></div>
          <div class="message-text">${message.text}</div>
      </div>
  </li>
  `;
  return html;
}