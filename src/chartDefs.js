function messageCount(inbox) {
    subset = inbox.slice(0,10)
    
    const data = {
        labels: subset.map((conversation) => conversation.participants.map((participant) => participant.name).join('-').slice(0,20)),
        datasets: [{
            label: "Received",
            data: subset.map((conversation) => receivedMessages(conversation, "Josh")),
            backgroundColor: '#cc66ff',
        },
        {
            label: "Sent",
            data: subset.map((conversation) => sentMessages(conversation, "Josh")),
            backgroundColor: '#6600ff'
        }]
    }

    const config = {
        type: 'bar',
        data: data,
        options: {
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
    return config;
}

function wordCount(inbox) {
    subset = inbox.slice(0,10)

    const data = {
        labels: subset.map((conversation) => conversation.participants.map((participant) => participant.name).join('-').slice(0,20)),
        datasets: [{
            label: "Received",
            data: subset.map((conversation) => receivedWords(conversation, "Josh")),
            backgroundColor: '#cc66ff',
        },
        {
            label: "Sent",
            data: subset.map((conversation) => sentWords(conversation, "Josh")),
            backgroundColor: '#6600ff'
        }]
    }

    console.log(data)

    const config = {
        type: 'bar',
        data: data,
        options: {
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
    return config;
}

module.exports = {wordCount, messageCount}