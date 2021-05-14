const fs = require('fs')
const path = require('path')
const { remote } = require('electron');
const { readFileSync } = require('fs');
const { dialog, Menu } = remote;
const Chart = require('chart.js')
// Global state
let inbox = [];

const loadDataBtn  = document.getElementById('loadDataBtn');
loadDataBtn.onclick = selectSocialData;
const populateChartBtn = document.getElementById('populateChartBtn')
populateChartBtn.onclick = populateChart;
const selectFriendBtn = document.getElementById('friendSelectBtn');
selectFriendBtn.onclick = getFriends;

const dataChartCanvas = document.getElementById('dataChart');

async function getFriends() {
    const friendsMenu = Menu.buildFromTemplate(
        inbox.map(conversation => {
            return {
                label: conversation.participants.map((participant) => participant.name).join('-'),
                click: () => selectFriend(conversation)
            }
        })
    )

    friendsMenu.popup();
}

function selectFriend(conversation) {
    console.log(conversation)
}

async function populateChart() {
    subset = inbox.slice(0,10)
    console.log(subset)

    const data = {
        labels: subset.map((conversation) => conversation.participants.map((participant) => participant.name).join('-')),
        datasets: [{
            label: "test",
            data: subset.map((conversation) => conversation.messages.length),
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
                        minRotation: 85,
                        maxRotation: 90
                    }
                }
            }
        }
    }
    var dataChart = new Chart(
        dataChartCanvas, config
    )
}

async function selectSocialData() {
    const { filePaths } = await dialog.showOpenDialog({properties: [
        "openDirectory"
    ]});
    
    loadInbox(filePaths[0])

    inbox.sort(conversationSizeComparison)
    
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