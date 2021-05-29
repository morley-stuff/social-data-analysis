function removeGroupConversations(inbox) {
    inbox.filter(conversation => !isGroupConversation(conversation))
}

function onlyGroupConversations(inbox) {
    inbox.filter(conversation => isGroupConversation(conversation))
}

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

function messageCountBetween(conversation, startDate, endDate) {
    messages = conversation.messages;
    validMessages = messages.filter(betweenTimes(startDate, endDate))
    return validMessages.length
}

function betweenTimes(startDate, endDate) {
    startTime = startDate.getTime();
    endTime = endDate.getTime();
    return (message) => (startTime < message.timestamp_ms && message.timestamp_ms < endTime)
}

function sentBy(participant) {
    return (message) => message.sender_name.includes(participant)
}

function notSentBy(participant) {
    return (message) => !message.sender_name.includes(participant)
}

function isGroupConversation(conversation) {
    if (conversation.participants.length > 2) {
        return true;
    } else {
        return false;
    }
}

function dataOwner(inbox) {
    participantCounts = {}
    inbox.forEach(conversation => {
        conversation.participants.forEach(user => {
            if (participantCounts.hasOwnProperty(user.name)) {
                participantCounts[user.name] += 1
            } else {
                participantCounts[user.name] = 1
            }
        })

    })

    highestCount = 0
    currentOwner = null
    for (user in participantCounts) {
        if (participantCounts[user] > highestCount) {
            highestCount = participantCounts[user]
            currentOwner = user
        }
    }

    return currentOwner
}



module.exports = { totalMessages, sentMessages, receivedMessages, receivedWords, sentWords, dataOwner, messageCountBetween, removeGroupConversations, onlyGroupConversations }