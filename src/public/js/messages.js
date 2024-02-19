const socket = io();
let user;
const catBox = document.getElementById('chatBox')


/*=============================================
=              Aplicando SweetAlert           =
=============================================*/
Swal.fire({
    icon: "info",
    title: 'Identicate, por favor',
    input: 'text',
    text: 'Ingrese el username para identificarse en el chat.',
    color: "#716add",
    inputValidator: (value) => {
        if (!value) {
            return "Necesitas escribir tu nombre de usuario para continuar!"
        } else {
            // 2da - parte
            // aqui usamos socket
            socket.emit("userConnected", { user: value })
        }
    },
    allowOutsideClick: false // esto es para no dejar pasar al usuario si no completa el input, dando cli-ck afuera.
}).then(result => {
    user = result.value

    // Cargar Nombre en el navegador
    const myName = document.getElementById('myName')
    myName.innerHTML = user
}
)




//Guardar mensajes por usuario y mostrarlo en nuesto log de mensajes.
//  ale : "Hola como estas?"
catBox.addEventListener('keyup', evt => {
    if (evt.key === 'Enter') {
        if (catBox.value.trim().length > 0) {
            socket.emit('message', { user: user, message: catBox.value })
            // Limpiamos el input
            catBox.value = "";
        }
        else {
            Swal.fire({
                icon: "warning",
                title: "Alerta",
                text: "Por favor ingresar un mensaje!!"
            })
        }
    }
})


// Escuchamos a todos los usuarios que estan conectados
// recivimos un array de objetos ---> [{ user: "Juan", message: "Hola" }, { user: "Elias", message: "Como estas?" }]
socket.on('messageLogs', data => {
    const messageLogs = document.getElementById('messageLogs');
    let logs = '';
    data.forEach(log => {
        logs += `${log.user} dice: ${log.message}<br/>`
    })
    messageLogs.innerHTML = logs;
})


// 2da - parte
// Aqui escuchamos los nuevos usuarios que se conectan al chat
socket.on('userConnected', data => {
    let message = `Nuevo usuario conectado: ${data}`
    Swal.fire({
        icon: 'info',
        title: 'Nuevo usuario entra al chat!!',
        text: message,
        toast: true,
        color: '#716add'
    })
})



/*=============================================
=                   Extras                   =
=============================================*/





// close chatBox
const closeChatBox = document.getElementById('closeChatBox')
closeChatBox.addEventListener('click', evt => {
    alert("Hola")
    socket.emit('closeChat', { close: "close" })
    messageLogs.innerHTML = '';

})

