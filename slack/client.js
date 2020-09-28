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
    console.log(nameSpaceArray); 
    (Array.from(nameSpaceCollction)).forEach((elm) => { 
      elm.addEventListener('click', (event) => { 
        console.log('clicked'); 
        const endpoint = elm.getAttribute('ns'); 
        console.log(endpoint); 
      }); 
    });
  });
});
