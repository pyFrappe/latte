
const electron = require('electron');
const path = require('path');

// Importing dialog module using remote 
const dialog = electron.remote.dialog;

var uploadFile = document.getElementById('changeImage');
var audiofile = document.getElementById('changeAudio');
// Defining a Global file path Variable to store  
// user-selected file 

function ImagePath() {
    global.filepath = undefined;

    // If the platform is 'win32' or 'Linux' 
    if (process.platform !== 'darwin') {
        // Resolves to a Promise<Object> 
        dialog.showOpenDialog({
            title: 'Select the File to be uploaded',
            defaultPath: path.join(__dirname, '../assets/'),
            buttonLabel: 'Upload',
            // Restricting the user to only Text Files. 
            filters: [
                {
                    name: 'Images or GIFs',
                    extensions: ['png', 'gif']
                },],
            // Specifying the File Selector Property 
            properties: ['openFile']
        }).then(file => {
            // Stating whether dialog operation was 
            // cancelled or not. 
            console.log(file.canceled);
            if (!file.canceled) {
                // Updating the GLOBAL filepath variable  
                // to user-selected file. 
                global.filepath = file.filePaths[0].toString();

                updateImagePath(global.filepath)

            }
        }).catch(err => {
            console.log(err)
        });
    }
    else {
        // If the platform is 'darwin' (macOS) 
        dialog.showOpenDialog({
            title: 'Select the File to be uploaded',
            defaultPath: path.join(__dirname, '../assets/'),
            buttonLabel: 'Upload',
            filters: [
                {
                    name: 'Text Files',
                    extensions: ['txt', 'docx']
                },],
            // Specifying the File Selector and Directory  
            // Selector Property In macOS 
            properties: ['openFile', 'openDirectory']
        }).then(file => {
            console.log(file.canceled);
            if (!file.canceled) {
                global.filepath = file.filePaths[0].toString();
                updateImagePath(global.filepath)

                console.log(global.filepath);
            }
        }).catch(err => {
            console.log(err)
        });
    }

}


function audioDialogue() {
    global.filepath = undefined;

    if (process.platform !== 'darwin') {
        // Resolves to a Promise<Object> 
        dialog.showOpenDialog({
            title: 'Select the File to be uploaded',
            defaultPath: path.join(__dirname, '../assets/'),
            buttonLabel: 'Upload',
            // Restricting the user to only Text Files. 
            filters: [
                {
                    name: 'Audio File',
                    extensions: ['mp3', 'wav']
                },],
            // Specifying the File Selector Property 
            properties: ['openFile']
        }).then(file => {
            // Stating whether dialog operation was 
            // cancelled or not. 
            console.log(file.canceled);
            if (!file.canceled) {
                // Updating the GLOBAL filepath variable  
                // to user-selected file. 
                global.filepath = file.filePaths[0].toString();

                updateAudioPath(global.filepath)

            }
        }).catch(err => {
            console.log(err)
        });
    }
    else {
        // If the platform is 'darwin' (macOS) 
        dialog.showOpenDialog({
            title: 'Select the File to be uploaded',
            defaultPath: path.join(__dirname, '../assets/'),
            buttonLabel: 'Upload',
            filters: [
                {
                    name: 'Audio Files',
                    extensions: ['mp3', 'wav']
                },],
            // Specifying the File Selector and Directory  
            // Selector Property In macOS 
            properties: ['openFile', 'openDirectory']
        }).then(file => {
            console.log(file.canceled);
            if (!file.canceled) {
                global.filepath = file.filePaths[0].toString();
                updateAudioPath(global.filepath)

                console.log(global.filepath);
            }
        }).catch(err => {
            console.log(err)
        });
    }
}



function notif(cmd){
    let title = cmd+' Saved!'
    let desc = cmd+' COPIED AND SAVED SUCCESSFULLY'
    const myNotification = new Notification(title, {
        body: desc
      })
      
}