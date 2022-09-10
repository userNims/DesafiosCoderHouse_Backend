//~~~~~~~~~~~~~~ VARIABLES ~~~~~~~~~~~~~~//
const socket = io.connect();
const TIME = 60;


//~~~~~~~~~~~~~~ SCHEMAS ~~~~~~~~~~~~~~//
const authorSchema = new normalizr.schema.Entity('authorSchema');
const messageSchema = new normalizr.schema.Entity('messageSchema', {
    commenter: authorSchema
});

const chat = new normalizr.schema.Entity('chats', {
    comments: [messageSchema],
    author: authorSchema
});


try { 

    //? Leemos la cookie para la expiracion
    let cookieTime = document.cookie
        .split('; ')
        .find(row => row.startsWith('"timeToExp"='))
        ?.split('=')[1];
    cookieTime = JSON.parse(cookieTime);
    
    //? Leemos la cookie del usuario
    cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('session='))
        ?.split('=')[1];
    cookieValue = JSON.parse(cookieValue);

    //^ WEBSOCKET CONECTION
    //? Enviamos el usuario de la cookie al servidor
    socket.emit('session-statusSend', cookieValue.id)
    
    setTimeout(data => {
        socket.emit('session-statusSend', cookieValue.id)

        socket.on('session-statusRecieved', data => {
            console.log('data', data);
            sessionStatus = data;
            if(!data.session){
                logoutSession();
                let myCookie = `"timeToExp"=''; SameSite=Lax; Secure; max-age=0`;
    document.cookie = myCookie;
            }
        })
    }, 2000);

    renderSession(cookieValue, false);
    
} catch (error){ // Si ya no existe la cookie de persistencia

    console.log({error: `no se encontró sesión iniciada: ${error}`});

    if(document.cookie){
        // Leemos la cookie del usuario
        //? Leemos la cookie del usuario
        cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('session='))
            ?.split('=')[1];
        cookieValue = JSON.parse(cookieValue);

        // Enviar el email al backend para cerrar sesión en Atlas
        socket.emit('close-session', cookieValue.id);
        // Borrar la cookie de inicio de sesión
        let deleteCookie = `session=''; SameSite=Lax; Secure; max-age=0`;
        document.cookie = deleteCookie;
    }
}



//* ENVIAR AL SERVIDOR - PRODUCTO
function renderCompression(desnormalizerData, normalizerData) {
    // console.log('DES', desnormalizerData.length, 'NORMAL', normalizerData.result.length);

    let normalizedData = JSON.stringify(normalizerData).length;
    let desnormalizedData = JSON.stringify(desnormalizerData).length;
    // let compressionRate = desnormalizedData * 100 / normalizedData;
    let compressionRate = normalizedData * 100 / desnormalizedData;
    return (100 - compressionRate).toFixed(2);
}


//* ENVIAR AL SERVIDOR - PRODUCTO
function renderProducts(data) {
    // console.log("Holas Bv", data);
    const html = data.map((elem, index) => {
        return(`
            <tr>
                <td>${elem.title}</td>
                <td>${elem.price}$</td>
                <td><img src="${elem.thumbnail}"/></td>
            </tr>
            <tr>
                <td><hr /></td>
                <td><hr /></td>
                <td><hr /></td>
            </tr>
            
`)
    }).join(" ");

    document.getElementById('tablaProductos').innerHTML = html;
}


//* ENVIAR AL SERVIDOR - MENSAJE
function renderMessages(data) {
    let denormalizeMessage = normalizr.denormalize(data.result, [chat], data.entities);
    let compressionRate = renderCompression(denormalizeMessage, data);
    // console.log('NORMALIZE', data);
    // console.log('denormalizeMessage', denormalizeMessage);

    if(data != 'Chat vacio'){
        const html = denormalizeMessage.map((elem) => {
            // console.log('elem', elem);
            return(`
                <table style="width:100%" class="chatTable">
                    <tr>
                        <th rowspan="2"><img src="${elem.author.avatar}" class='avatarChar'/></th>
                        <td><span>${elem.timestamp} <strong>${elem.author.id}</strong></span></td>
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
function addProduct(e) {
    const producto = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value,
    };
    
    // console.log(producto);
    socket.emit('new-product', producto);

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
    // console.log('nuevoUsuario', nuevoUsuario);
    const normalizedMessage = normalizr.normalize(nuevoUsuario, messageSchema);
    alert(JSON.stringify(normalizedMessage));
    // console.log('AGREGANDO Bv', JSON.stringify(normalizedMessage));
    socket.emit('nuevo-usuario', normalizedMessage);

    return false;
}


//* FUNCION - REGISTRARSE POP UP
function initSession(e){
    let email = document.getElementById('emailLogin').value;
    socket.emit('init-session', email);
}


//* FUNCION - REGISTRARSE POP UP
function registrarsePopUp(e){
    document.querySelector('#registerForm').style.display = 'block';
    document.querySelector('#atenuarPantalla').style.display = 'block';
}

function cerrarPopUp(e){
    document.querySelector('#registerForm').style.display = 'none'
    document.querySelector('#atenuarPantalla').style.display = 'none'
    document.querySelector('#errorInitSession').style.display = 'none'
}


//* FUNCION - VERIFICAR USUARIO
function renderSession(data, flag = true){
    // console.log('DATA: ', data);
    if(data.error){
        document.querySelector('#errorInitSession').style.display = 'block';
        document.querySelector('#atenuarPantalla').style.display = 'block';
    } else {
        document.querySelector('#loginForm').style.display = 'none';
        document.querySelector('#btnLogOut input').style.display = 'block';
        
        //? Asignando cookies
        let myCookie = `session={"id": "${data.id}", "alias": "${data.alias}"}; SameSite=Lax`;
        document.cookie = myCookie;
        let expCookie = `"timeToExp"=true; SameSite=Lax; Secure; max-age=${TIME}`;
        document.cookie = expCookie;
        

        if(flag){
            document.querySelector('#successInitSession').style.display = 'block';
            document.querySelector('#loginForm').style.display = 'none';

            let message = `Bienvenido ${data.alias}`;
            document.querySelector('#successMessageLogin').textContent = message;
            
            setTimeout(function(){
                document.querySelector('#successInitSession').style.display = 'none';
                document.querySelector('#btnLogOut input').style.display = 'block';
            }, 5000);
        }
    }
}

//* FUNCION - CERRAR SESION
function logoutSession(e){
    //? Leyendo la cookie
    let cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('session='))
        ?.split('=')[1];
    cookieValue = JSON.parse(cookieValue);


    document.querySelector('#btnLogOut input').style.display = 'none';
    document.querySelector('#atenuarPantalla').style.display = 'block';
    document.querySelector('#logoutSession').style.display = 'block';
    document.querySelector('#logoutMessage').textContent = `Hasta luego ${cookieValue.alias}`;


    //? Enviando el email al servidor para cerrar la sesion en MongoAtlas
    socket.emit('close-session', cookieValue.id);


    //? Borrando la cookie
    let myCookie = `session=''; SameSite=Lax; Secure; max-age=0`;
    document.cookie = myCookie;

    setTimeout(function(){
        document.querySelector('#atenuarPantalla').style.display = 'none';
        document.querySelector('#logoutSession').style.display = 'none';
        document.querySelector('#loginForm').style.display = 'block';
        document.querySelector('#emailLogin').value = '';

        
    }, 5000);
}

//* FUNCION - EXPIRAR SESION
// function expireSession(timeToExpire){
//     let dateActual

//     let contToExpire = setInterval(() => {
//         dateActual = Date.now();
        
//         if(dateActual >= timeToExpire){
//             logoutSession();
//             clearInterval(contToExpire);
//         }
//     },1000)
// }


//* PRODUCTOS
socket.on('productos', data => {
    renderProducts(data);
})

//* MENSAJES
socket.on('chat', data => {
    renderMessages(data);
})

//* USUARIO SESION
socket.on('res-session', data => {
    renderSession(data);
})