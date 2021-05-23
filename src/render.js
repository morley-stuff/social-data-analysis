// Imports
const fs = require('fs')
const path = require('path')
const { remote } = require('electron');
const { readFileSync } = require('fs');
const { dialog, Menu } = remote;
const Chart = require('chart.js')

// Global state
let inbox = [];

const dataIndicator      = document.getElementById('dataIndicator')
const loadDataBtn        = document.getElementById('loadDataBtn');
loadDataBtn.onclick      = selectSocialData;

const totalMessagesBtn   = document.getElementById('totalMessagesBtn')
totalMessagesBtn.onclick = newTotalMessages;
const sentMessagesBtn   = document.getElementById('sentMessagesBtn')
sentMessagesBtn.onclick   = newSentMessages;
const receivedMessagesBtn   = document.getElementById('receivedMessagesBtn')
receivedMessagesBtn.onclick = receivedMessagesChart;

async function receivedMessagesChart() {
    console.log("Not implemented")
}

async function createChart(chartConfig) {
    console.log(chartConfig)
    stage = document.getElementById('stage')

    // Chart
    newChart = document.createElement('canvas')
    chartObj = new Chart(
        newChart, chartConfig
    )
    
    // Wrapper
    chartCard = document.createElement('div')
    chartCard.classList.add('card')
    chartCardContent = document.createElement('div')
    chartCardContent.classList.add('card-content')
    chartCardFooter = document.createElement('div')
    chartCardFooter.classList.add('card-footer')
    chartCardDelete = document.createElement('a')
    chartCardDelete.classList.add('card-footer-item')
    chartCardDelete.innerText = "Delete"
    chartCardDelete.onclick = function() {
        chartCard.parentNode.removeChild(chartCard)
    }
    
    // Stitching
    stage.appendChild(chartCard)
    chartCard.appendChild(chartCardContent)
    chartCard.appendChild(chartCardFooter)
    chartCardFooter.appendChild(chartCardDelete)
    chartCardContent.appendChild(newChart)
}

async function newSentMessages() {
    chartConfig = await sentMessagesConfig(inbox)
    createChart(chartConfig)
}

async function sentMessagesConfig(inbox) {
    subset = inbox.slice(0,10)

    const data = {
        labels: subset.map((conversation) => conversation.participants.map((participant) => participant.name).join('-').slice(0,20)),
        datasets: [{
            label: "test",
            data: subset.map((conversation) => conversation.messages.filter(message => message.sender_name.includes("Josh")).length),
        }]
    }

    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                x: {
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90
                    }
                }
            }
        }
    }

    return config;

}

async function newTotalMessages() {
    chartConfig = await totalMessagesConfig(inbox);
    createChart(chartConfig)
}

async function totalMessagesConfig() {
    
    subset = inbox.slice(0,10)
    
    const data = {
        labels: subset.map((conversation) => conversation.participants.map((participant) => participant.name).join('-').slice(0,20)),
        datasets: [{
            label: "Received",
            data: subset.map((conversation) => conversation.messages.filter(message => !message.sender_name.includes("Josh")).length),
            backgroundColor: '#ff6384',
        },
        {
            label: "Sent",
            data: subset.map((conversation) => conversation.messages.filter(message => message.sender_name.includes("Josh")).length),
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

async function selectSocialData() {
    const { filePaths } = await dialog.showOpenDialog({properties: [
        "openDirectory"
    ]});
    
    loadInbox(filePaths[0])

    inbox.sort(conversationSizeComparison)
    
    dataIndicator.innerText = "Data selected for 'Josh Morley'"
    totalMessagesBtn.disabled = false;
    sentMessagesBtn.disabled = false;
}

function conversationSizeComparison(conv1, conv2) {
    return conv2.messages.length - conv1.messages.length;
}

function loadInbox(dataDirectory) {
    convDirs = fs.readdirSync(dataDirectory);
    convDirs.forEach(function (convDir) {
        conversation = loadConversation(path.join(dataDirectory, convDir))
        inbox.push(conversation)
    })
    
}

function loadConversation(conversationDirectory) {
    conversation = {
        participants: [],
        messages: [],
    }
    messageFiles = fs.readdirSync(conversationDirectory)
    messageFiles.forEach(function (messageFile) {
        // Read in file
        filePath = path.join(conversationDirectory, messageFile);
        stats = fs.statSync(filePath);
        if (stats.isFile()){
            file = readFileSync(filePath, 'utf8');
            content = JSON.parse(file);

            // Add data to conversation object
            if (conversation.participants.length == 0) {
                conversation.participants = conversation.participants.concat(content.participants).filter(part => !part.name.includes("Josh"));
            }
            conversation.messages = conversation.messages.concat(content.messages);
        }
    })
    return conversation
}