// Imports
const fs = require('fs')
const path = require('path')
const { remote } = require('electron');
const { readFileSync } = require('fs');
const { dialog, Menu } = remote;
const Chart = require('chart.js')
const chartDefs = require('./chartDefs')
const dataUtils = require('./dataUtils')


// Global state
let inbox = [];

const dataIndicator      = document.getElementById('dataIndicator')
const loadDataBtn        = document.getElementById('loadDataBtn');
loadDataBtn.onclick      = selectSocialData;

const messageCountCreate = document.getElementById('messageCountCreate')
const wordCountCreate    = document.getElementById('wordCountCreate')
const countBetweenCreate = document.getElementById('countBetween')

messageCountCreate.onclick = newChart(chartDefs.messageCount);
wordCountCreate.onclick    = newChart(chartDefs.wordCount);
countBetweenCreate.onclick = newChart(chartDefs.messageCountBetween)

function newChart(chartDef) {
    return () => {
        chartConfig = chartDef(inbox)
        createChart(chartConfig)
    }
}

async function createChart(chartConfig) {
    console.log(chartConfig)
    stage = document.getElementById('stage')

    // Chart
    chart = document.createElement('canvas')
    chartObj = new Chart(
        chart, chartConfig
    )
    
    // Wrapper
    chartContainer = document.createElement('div')
    chartContainer.classList.add('chart-container')
    chartContainer.classList.add('draggable')
    chartContainer.style.height = '240px'
    chartContainer.style.width = '480px'
    
    // Stitching
    stage.prepend(chartContainer)
    chartContainer.appendChild(chart)
}

async function selectSocialData() {
    const { filePaths } = await dialog.showOpenDialog({properties: [
        "openDirectory"
    ]});
    
    loadInbox(filePaths[0])

    inbox.sort(conversationSizeComparison)
    
    dataIndicator.innerText = `Data [${dataUtils.dataOwner(inbox)}]`
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
        title: ''
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
                conversation.participants = conversation.participants.concat(content.participants);
            }
            conversation.messages = conversation.messages.concat(content.messages);
            conversation.title = content.title
        }
    })
    return conversation
}