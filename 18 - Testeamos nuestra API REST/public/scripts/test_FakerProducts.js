const socket = io.connect();

function render(data){
    const html = data.map((elem) => {
        return(`
            <tr>
                <td>${elem.id}</td>
                <td>${elem.title}</td>
                <td>${elem.price}</td>
                <td><img src="${elem.thumbnail}"></td>
            </tr>
    
    `)
    }).join(" ");
    document.getElementById('tablaProductos').innerHTML = html;
}

socket.on('productos', data => {
    // console.log(data);
    render(data);
})

// console.log('datosArray');
// document.getElementById('tablaProductos').innerHTML = 'Holas';