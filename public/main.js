// Get sokcet
const socket = io()

// Get all required element
const total = document.getElementById('client-total')
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

// Message tone
const messageTone = new Audio('/message-tone.mp3')

// Messageform event when submit
messageForm.addEventListener('submit', (e)=>{
    if(messageInput.value === '') return
    e.preventDefault()
    sendMessage()
})

// Handle the emitted clients-total from BE
socket.on('clients-total', (data)=>{
    total.innerText = data
})

// Handle the send message to BE
const sendMessage = ()=>{
    console.log(messageInput.value)
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTIme: new Date()
    }

    // Emitting message to BE
    socket.emit('message', data)
    addMessage(true, data)

    messageInput.value = ''
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Handle broadcasted chat
socket.on('chat-message', (data)=>{
    messageTone.play()
    console.log(data)
    addMessage(false, data)
    messageContainer.scrollTop = messageContainer.scrollHeight;
})

const addMessage = (isOwnMessage, data)=>{
    clearFeedback()
    const element = `
        <div class="mb-2 ${isOwnMessage? 'text-right':'text-left'}">
            <p class="${isOwnMessage? 'bg-blue-500 text-white': 'bg-gray-200 text-gray-700'} rounded-lg py-2 px-4 inline-block">${data.message}</p>
            <p class="text-xs text-gray-700">${data.name} ${formatTimeDifference(data.dateTIme)}</p>
        </div>
    `
    messageContainer.innerHTML += element
}

messageInput.addEventListener('focus', (e)=>{
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a message`
    })
})

messageInput.addEventListener('keypress', (e)=>{
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a message`
    })
})

messageInput.addEventListener('blur', () => {
    socket.emit('feedback', {
        feedback: ``
    })
});

socket.on('feedback', (data)=>{
    clearFeedback()
    const element = `
    <div class="mt-4 mb-2 text-center" id="feedback">
        <p>${data.feedback}</p>
    </div>`

    messageContainer.innerHTML += element
})

const clearFeedback = ()=>{
    document.querySelectorAll('#feedback').forEach(element=>{
        element.parentNode.removeChild(element)
    })
}

// Function to format the time difference
const formatTimeDifference = (timestamp) => {
    const now = new Date();
    const secondsAgo = Math.floor((now - timestamp) / 1000);

    if (secondsAgo < 60) {
        return `${secondsAgo} second${secondsAgo !== 1 ? 's' : ''} ago`;
    } else if (secondsAgo < 3600) {
        const minutesAgo = Math.floor(secondsAgo / 60);
        return `${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago`;
    } else if (secondsAgo < 86400) {
        const hoursAgo = Math.floor(secondsAgo / 3600);
        return `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`;
    } else {
        const daysAgo = Math.floor(secondsAgo / 86400);
        return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
    }
};