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
        const endpoint = elm.getAttribute('ns'); 
        console.log(endpoint);
        joinNS(endpoint);
      }); 
    });
    //Join a default namespace
    joinNS('/wiki');

  });
});


function joinNS(endpoint) {
  if(nsSocket) {
    //Check if there was an open socket and close it
    nsSocket.close();
    //Remove the event listener on the submit button or else it will send to all rooms
    document.querySelector('#user-input').removeEventListener('submit', formSubmitCallback);
  }
  nsSocket =  io(`http://localhost:9000${endpoint}`);
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
        joinRoom(event.target.innerText);
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
  document.querySelector('.message-form').addEventListener('submit', formSubmitCallback)
}


function formSubmitCallback(event) {
  event.preventDefault();
  const messageSelector = document.querySelector('#user-message');
  const newMessage = messageSelector.value;
  nsSocket.emit('newMessageToServer', newMessage);
  messageSelector.value = '';
}

function joinRoom(roomToJoin) {
  nsSocket.emit('joinRoom', roomToJoin, (memberCount) => {
    //document.querySelector('.curr-room-num-users').innerHTML = `${memberCount} <span class="glyphicon glyphicon-user">`;
  });
  nsSocket.on('roomHistory', (history) => {
    const messagesUL = document.querySelector('#messages');
    messagesUL.innerHTML = '';
    history.forEach((message) => {
      const messageLI = messageHTML(message);
      messagesUL.innerHTML += messageLI;
    })
  })
  nsSocket.on('roomMembers', (roomMembers) => {
    document.querySelector('.curr-room-num-users').innerHTML = `${roomMembers} <span class="glyphicon glyphicon-user">`;
    document.querySelector('.curr-room-text').innerHTML = `${roomToJoin}`;
  });
  let searchBox = document.querySelector('#search-box');
  searchBox.addEventListener('input', (event) => {
      let messages = Array.from(document.getElementsByClassName('message-text'));
      messages.forEach((message) => {
          //Get parent div
          var parent = message.closest('li');            
          if(message.innerText.toLowerCase().indexOf(event.target.value.toLowerCase()) === -1) {            
            parent.style.display = 'none';            
          } else {
            parent.style.display = 'block';
          }
      });
  });
}

function messageHTML(message) {
  const dateLocalString = new Date(message.time).toLocaleString();
  const html = `
  <li class="text">
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
