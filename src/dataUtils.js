// Returns the total message count for a converation
function totalMessages(conversation) {
    return conversation.messages.length
}

// Returns the total messages sent by a participant for a single conversation
function sentMessages(conversation, participant) {
    messages = conversation.messages
    sentMessages = messages.filter(sentBy(participant))
    return sentMessages.length
}

// Returns the total messages not sent be a participant for a conversation
function receivedMessages(conversation, participant) {
    messages = conversation.messages;
    receivedMessages = messages.filter(notSentBy(participant))
    return receivedMessages.length
}

// Returns the total number of words sent by a participant
function sentWords(conversation, participant) {
    // Extract data
    messages = conversation.messages

    // Filter data
    sentMessages = messages.filter(sentBy(participant))

    // Analyze data
    totalWords = 0;
    sentMessages.forEach(message => totalWords += wordsInMessage(message))

    // Return value
    return totalWords
}

// Returns the total number of words not sent by a participant
function receivedWords(conversation, participant) {
    // Extract data
    messages = conversation.messages;

    // Filter data
    receivedMessages = messages.filter(notSentBy(participant))

    // Analyze data
    totalWords = 0;
    receivedMessages.forEach(message => totalWords += wordsInMessage(message))

    // Return value
    return totalWords
}

function wordsInMessage(message) {
    if (message.hasOwnProperty('content')) {
        return message['content'].split(' ').length
    } else {
        return 0;
    }
}

function sentBy(participant) {
    return (message) => message.sender_name.includes(participant)
}

function notSentBy(participant) {
    return (message) => !message.sender_name.includes(participant)
}

function dataOwner(inbox) {
    return 'Josh'
}

module.exports = { totalMessages, sentMessages, receivedMessages, receivedWords, sentWords }