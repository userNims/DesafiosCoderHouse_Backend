const socket = io.connect();

    //~ SCHEMAS
    const authorSchema = new normalizr.schema.Entity('authorSchema');
    const messageSchema = new normalizr.schema.Entity('messageSchema', {
        commenter: authorSchema
        })

    const chat = new normalizr.schema.Entity('chats', {
        comments: [messageSchema],
        author: authorSchema
    })


    //* ENVIAR AL SERVIDOR - PRODUCTO
    function renderCompression(desnormalizerData, normalizerData) {
        console.log('DES', desnormalizerData.length, 'NORMAL', normalizerData.result.length);

        let normalizedData = JSON.stringify(normalizerData).length;
        let desnormalizedData = JSON.stringify(desnormalizerData).length;
        // let compressionRate = desnormalizedData * 100 / normalizedData;
        let compressionRate = normalizedData * 100 / desnormalizedData;
        return (100 - compressionRate).toFixed(2);
    }


    //* ENVIAR AL SERVIDOR - PRODUCTO
    function render(data) {
        // console.log("Holas Bv");
        const html = data.map((elem, index) => {
            return(`
                <tr>
                    <td>${elem.id}</td>
                    <td>${elem.title}</td>
                    <td>${elem.price}</td>
                    <td><img src="${elem.thumbnail}"/></td>
                </tr>
    `)
        }).join(" ");
        // console.log(html);
        document.getElementById('tablaProductos').innerHTML = html;
    }


    //* ENVIAR AL SERVIDOR - MENSAJE
    function renderMessages(data) {
        console.log('DATA', data);

        let denormalizeMessage = normalizr.denormalize(data.result, [chat], data.entities);
        let compressionRate = renderCompression(denormalizeMessage, data);

        if(data != 'Chat vacio'){
            const html = denormalizeMessage.map((elem) => {
                return(`
                    <table style="width:100%" class="chatTable">
                        <tr>
                            <th rowspan="2"><img src="${elem.author.avatar}" class='avatarChar'/></th>
                            <td><span>${elem.time} <strong>${elem.author.id}</strong></span></td>
                        </tr>
                        <tr>
                            <td><em>${elem.text}</em></td>
                        </tr>
                    </table>
                `) 
            }).join(" ");
            // console.log(html);
            document.getElementById('chat-mensajes').innerHTML = html;
            document.getElementById('compressionRate').innerHTML = 'Compresión: ' + compressionRate + '%';

        } else {
            document.getElementById('chat-mensajes').innerHTML = '<br/>Chat vacio';
        }
        
    }


    //* ENVIAR AL SERVIDOR - PRODUCTO
    function addMessage(e) {
        const mensaje = {
            title: document.getElementById('title').value,
            price: document.getElementById('price').value,
            thumbnail: document.getElementById('thumbnail').value,
        };
        
        console.log(mensaje);
        socket.emit('new-message', mensaje);

        return false;
    }


    //* ENVIAR AL SERVIDOR - MENSAJE DE USUARIO EXISTENTE
    function addHistory(e) {
        const mensaje = {
            id: document.getElementById('emailChat').value,
            message: document.getElementById('textChat').value
        };

        socket.emit('chat-mensajes', mensaje);

        return false;
    }


    //* ENVIAR AL SERVIDOR - MENSAJE DE USUARIO NUEVO
    function addNewHistoryUser(e) {
        const nuevoUsuario = {
            id: 'userMessage',
            author: {
                id: document.getElementById('email').value,
                nombre: document.getElementById('name').value,
                apellido: document.getElementById('last_name').value,
                edad: document.getElementById('age').value,
                alias: document.getElementById('alias').value,
                avatar: document.getElementById('avatar').value
            },
            text: document.getElementById('text').value
        };
        
        //& Enviamos el dato Normalizado
        console.log('nuevoUsuario', nuevoUsuario);
        const normalizedMessage = normalizr.normalize(nuevoUsuario, messageSchema);
        alert(JSON.stringify(normalizedMessage));
        console.log('AGREGANDO Bv', JSON.stringify(normalizedMessage));
        socket.emit('nuevo-usuario', normalizedMessage);

        return false;
    }


    //* PRODUCTOS
    socket.on('messages', data => {
        // console.log(data);
        render(data);
    })

    //* MENSAJES
    socket.on('chat', data => {
        renderMessages(data);
    })