const fs = require('fs')
const path = require('path')
const { remote } = require('electron');
const { readFileSync } = require('fs');
const { dialog } = remote;

// Global state
let inbox = [];

const loadDataBtn  = document.getElementById('loadDataBtn');
loadDataBtn.onclick = selectSocialData;

async function selectSocialData() {
    const { filePaths } = await dialog.showOpenDialog({properties: [
        "openDirectory"
    ]});
    
    loadInbox(filePaths[0])
    console.log(inbox.length)
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
            conversation.participants.concat(content.participants);
            conversation.messages.concat(content.messages);
        }
    })
    return conversation
}