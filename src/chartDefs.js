const dataUtils = require('./dataUtils')

function testChart(inbox) {
    inbox = dataUtils.filterConversations(inbox, dataUtils.isEmpty, false)
    inbox = dataUtils.filterConversations(inbox, dataUtils.isGroupConversation, false)

    inbox = dataUtils.sortConversations(inbox, dataUtils.totalMessages)
    
    inbox = inbox.slice(0,30)

    datasets = inbox.map(conversation => {
        yearData = dataUtils.groupByYear([conversation], 2010, 2020)
        return {
            label: conversation.title,
            data: yearData.map(yearGroup => yearGroup.messages.length),
            borderColor: '#' + Math.floor(Math.random()*16777215).toString(16)
        }
    })

    yearData = dataUtils.groupByYear(inbox, 2010, 2020)

    data = {
        labels: yearData.map(yearGroup => yearGroup.year),
        datasets: datasets
    }

    return lineConfig(data)
}

function testChart2(inbox) {
    inbox = dataUtils.filterConversations(inbox, dataUtils.isEmpty, false)
    inbox = dataUtils.filterConversations(inbox, dataUtils.isGroupConversation, false)
    inbox = dataUtils.sortConversations(inbox, dataUtils.totalMessages)

    inbox = inbox.slice(0,10)
    
    console.log(dataUtils.groupByYear(inbox, 2010, 2020))

    data = {
        labels: inbox.map(conv => conv.title),
        datasets: [{
            label: "Total messages",
            data: inbox.map(conv => dataUtils.totalMessages(conv))
        }]
    }

    console.log(inbox)
    return stackedBarConfig(data)
}

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

module.exports = {wordCount, messageCount, messageCountBetween, testChart}