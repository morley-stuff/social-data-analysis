const dataUtils = require('./dataUtils')

function messageCount(inbox) {
    subset = inbox.slice(0,10)
    
    const data = {
        labels: subset.map((conversation) => conversation.title),
        datasets: [{
            label: "Received",
            data: subset.map((conversation) => dataUtils.receivedMessages(conversation, dataUtils.dataOwner(inbox))),
            backgroundColor: '#cc66ff',
        },
        {
            label: "Sent",
            data: subset.map((conversation) => dataUtils.sentMessages(conversation, dataUtils.dataOwner(inbox))),
            backgroundColor: '#6600ff'
        }]
    }

    return stackedBarConfig(data)
}

function wordCount(inbox) {
    subset = inbox.slice(0,10)

    const data = {
        labels: subset.map((conversation) => conversation.title),
        datasets: [{
            label: "Received",
            data: subset.map((conversation) => dataUtils.receivedWords(conversation, dataUtils.dataOwner(inbox))),
            backgroundColor: '#cc66ff',
        },
        {
            label: "Sent",
            data: subset.map((conversation) => dataUtils.sentWords(conversation, dataUtils.dataOwner(inbox))),
            backgroundColor: '#6600ff'
        }]
    }

    return stackedBarConfig(data)
}

function stackedBarConfig(data) {
    return {
        type: 'bar',
        data: data,
        options: {
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90
                    }
                },
                y: {
                    stacked: true
                }
            }
        }
    }
}

module.exports = {wordCount, messageCount}