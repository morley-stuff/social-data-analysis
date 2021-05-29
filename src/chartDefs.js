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

    receivedWordsData = subset.map((conversation) => dataUtils.receivedWords(conversation, dataUtils.dataOwner(inbox)))
    sentWordsData = subset.map((conversation) => dataUtils.sentWords(conversation, dataUtils.dataOwner(inbox)))

    const data = {
        labels: subset.map((conversation) => conversation.title),
        datasets: [{
            label: "Received",
            data: receivedWordsData,
            backgroundColor: '#cc66ff',
        },
        {
            label: "Sent",
            data: sentWordsData,
            backgroundColor: '#6600ff'
        }]
    }

    return stackedBarConfig(data)
}

function messageCountBetween(inbox) {
    counts = {};
    inbox.forEach(conversation => {
        counts[conversation.title] = []
    })

    console.log(counts)

    for (i = 0; i < 12; i++) {
        inbox.forEach(conversation => {
            counts[conversation.title].push(
                dataUtils.messageCountBetween(conversation, new Date(2019,i,1,0,0,0,0), new Date(2019,i+1,1,0,0,0,0))
            )
        })
    }

    console.log(counts)

    maxCount = 0;
    maxTitle = ""
    for (key in counts) {
        if (counts[key][10] > maxCount) {
            maxCount = counts[key][10];
            maxTitle = key;
        }
    }


    const data = {
        labels: counts[maxTitle],
        datasets: [{
            label: maxTitle,
            data: counts[maxTitle],
            backgroundColor: '#cc66ff',
        }]
    }

    return lineConfig(data)
}

function lineConfig(data) {
    return {
        type: 'line',
        data: data,
        options: {
            maintainAspectRatio: false,
        }
    }
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

module.exports = {wordCount, messageCount, messageCountBetween}