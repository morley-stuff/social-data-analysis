// Conversation level filters
function filterConversations(inbox, booleanFunction) {
    return filterConversation(inbox, booleanFunction, true) 
}

function filterConversations(inbox, booleanFunction, inverter) {
    if(inverter == true) {
        filterFunction = (conversation => booleanFunction(conversation))
    } else {
        filterFunction = (conversation => !booleanFunction(conversation))
    }
    inbox = inbox.filter(filterFunction);
    return inbox;
}

function removeUserConversations(inbox, user) {
    inbox = inbox.filter(conversation => !conversation.participants.map(x => x.name).includes(user));
    return inbox;
}

function onlyUserConversations(inbox, user) {
    inbox = inbox.filter(conversation => conversation.participants.map(x => x.name).includes(user));
    return inbox;
}

// Conversation sorters
function sortConversations(inbox, valueFunction) {
    inbox = inbox.sort((conv1, conv2) => valueFunction(conv2) - valueFunction(conv1))
    return inbox
}

// Conversation boolean functions
function isGroupConversation(conversation) {
    return conversation.participants.length > 2
}

function hasParticipant(participant) {
    return conversation => conversation.participants.map(x => x.name).includes(participant)
}

function isEmpty(conversation) {
    return conversation.participants.length == 0 || conversation.messages.length == 0
}

// Conversation value functions
function totalMessages(conversation) {
    return conversation.messages.length
}

// Alternate grouping
function groupByYear(inbox, startYear, endYear) {
    years = []
    for (i = startYear; i <= endYear; i++) {
        startDate = new Date(i,0,0,0,0,0,0).getTime()
        endDate = new Date(i+1,0,0,0,0,0,0).getTime()
        validMessages = []
        inbox.forEach( conv => {
            conv.messages.forEach(msg => {
                if (startDate < msg.timestamp_ms && msg.timestamp_ms < endDate) {
                    validMessages.push(msg)
                }
            })
        })
        years.push({
            year: i,
            messages: validMessages
        })
    }

    return years
    
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
    return totalWordsfilterMethod
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



module.exports = { 
    totalMessages,
    sentMessages,
    receivedMessages, 
    receivedWords, 
    sentWords, 
    dataOwner,
    messageCountBetween, 
    removeUserConversations,
    onlyUserConversations, 
    sortConversations,
    filterConversations,
    isGroupConversation,
    isEmpty,
    hasParticipant,
    groupByYear,
}