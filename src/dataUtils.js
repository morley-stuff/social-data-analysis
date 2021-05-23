function totalMessages(conversation) {
    return conversation.messages.length
}

function sentMessages(conversation, sender) {
    return conversation.messages.filter(
        message => message.sender_name.includes(sender)
    ).length
}

function receivedMessages(conversation, receiver) {
    return conversation.messages.filter(
        message => !message.sender_name.includes(receiver)
    ).length
}

function sentWords(conversation, sender) {
    sentMessages = conversation.messages.filter(
        message => message.sender_name.includes(sender)
    )

    totalWords = 0;
    sentMessages.forEach(message => {
        if (message.hasOwnProperty('content')) {
            totalWords += message['content'].split(' ').length
        }
    })
    return totalWords
}

function receivedWords(conversation, sender) {
    receivedMessages = conversation.messages.filter(
        message => !message.sender_name.includes(sender)
    )
    totalWords = 0;
    receivedMessages.forEach(message => {
        if (message.hasOwnProperty('content')) {
            totalWords += message['content'].split(' ').length
        }
    })
    return totalWords
}

function dataOwner(inbox) {

}

module.exports = { totalMessages, sentMessages, receivedMessages, receivedWords, sentWords }