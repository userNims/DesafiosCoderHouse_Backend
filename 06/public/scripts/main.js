const socket = io.connect();
console.log('Me conecte :D');

function render(data) {
    console.log("Holas Bv");
    const html = data.map((elem) => {
        return(`
            <tr>
                <td>${elem.title}:</td>
                <td>${elem.price}:</td>
                <td>${elem.id}:</td>
            </tr>

`)
    }).join(" ");
    console.log("html: ", html);
    document.getElementById('messages').innerHTML = html;
    
}

function addMessage(e) {
    const mensaje = {
        author: document.getElementById('username').value,
        text: document.getElementById('texto').value
    };
    
    socket.emit('new-message', mensaje);

    return false;
}


// Recibir los datos del JSON contenedor
socket.on('messages', data => {
    console.log(data);
    render(data);
})