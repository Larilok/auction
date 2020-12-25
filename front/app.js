const socket = io('ws://localhost:8080')

const el = str => document.getElementById(str)

socket.on('message', text => {
   const betValue = el('betValue')
   betValue.innerHTML = text
})

document.querySelector('button').onclick = () => {

    const text = document.querySelector('input').value
    socket.emit('message', text)
}