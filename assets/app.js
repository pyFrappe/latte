const fetch = require('node-fetch');
var player = require('play-sound')(opts = {})
const axios = require('axios');
const fs = require('fs');
const e = require('express');
const ConfigParser = require('configparser');
const { send } = require('process');


async function Login() {
    let button = document.getElementById('login');
    let sidebar = document.getElementsByClassName('sidebar')[0];
    button.disabled = true;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let alert = document.getElementById('alert')
    //let axixz = 

    try {

        let session = await LogIN(email, password);

        document.getElementsByClassName('main-panel')[0].classList.remove('blurredElement');
        document.getElementById('customDIV').classList.remove('blurredElement');

        //axixz.classList.remove('blurredElement');
        sidebar.classList.add('blurredElement');

        updateDatas(session);
        localStorage.setItem('email', email);
        localStorage.setItem('password', password)
        alert.style.display = 'none';
        updateLoginDetails(email, password)
        //document.getElementById('customDIV').classList.remove('blurredElement')
        //document.getElementById('customDIV').classList.remove('blurredElement')

    }
    catch (err) {
        console.log(err,'test');


        login.disabled = false;

        alert.innerText = 'Something Went Wrong!If your credentials were correct , send below error to developer \n' + err;
        alert.style.display = '';
        localStorage.clear();
        location.reload();
    }
}


function encodePass(pass) {
    var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }
    var encodedString = Base64.encode(pass);
    return encodedString
}
async function LogIN(email, pass) {

    let data = email + '@!!' + encodePass(pass);
    let response = await axios.get('http://localhost:3000/getDetails', {
        headers: {
            'datas': data,
            'email': email,
            'pass': encodePass(pass)
        }
    })
    //console.log(response.data)
    if (response.data == 'error') {
        localStorage.clear();
        throw 'Unable to Login'
    }
    return response.data;
}

async function latestDonation(dict, cookies) {
    const res = await axios.get('https://esewa.com.np/api/web/auth/transactions?channel=ALL&from_date=2020-09-09&page=0&product_id=1&prop_value=&size=15&status=COMPLETE&to_date=2021-02-06&type=CR', {
        headers: {
            'X-XSRF-TOKEN-ES': dict['xsrf'],
            Cookie: 'authesewa=' + dict['authesewa']
        }
    })
    let transCode = res.data[0]['transaction_code'];
    let transVer = res.data[0]['transaction_version'];
    let moduleID = res.data[0]['module_id'];
    let newURL = `https://esewa.com.np/api/web/auth/transactions/${transCode}?module_id=${moduleID}&transaction_version=${transVer}`;

    const trans = await axios.get(newURL, {
        headers: {
            'X-XSRF-TOKEN-ES': dict['xsrf'],
            Cookie: 'authesewa=' + dict['authesewa']
        }
    })
    return trans.data;

}

async function getBalance(dict) {
    const trans = await axios.get('https://esewa.com.np/api/web/auth/balance', {
        headers: {
            'X-XSRF-TOKEN-ES': dict['xsrf'],
            Cookie: 'authesewa=' + dict['authesewa']
        },
        withCredentials: true,
    })
    return trans.data
}

async function getInfo(dict) {
    const info = await axios.get('https://esewa.com.np/api/web/auth/login_credentials', {
        headers: {
            'X-XSRF-TOKEN-ES': dict['xsrf'],
            'Cookie': 'authesewa=' + dict['authesewa']
        },
        withCredentials: true,

    })
}


function updateDatas(dict) {
    //console.log(dict['balance'])
    document.getElementById('balance').innerText = 'Balance : ' + dict['balance'];
    document.getElementById('name').innerText = 'Name : ' + dict['0']['full_name'];
    document.getElementById('number').innerText = 'Number : ' + dict['0']['esewa_id'];
    let time = new Date(dict['last_transaction_date']);
    document.getElementById('lastTransaction').innerText = 'Last Transaction : ' + time;
}

async function autoLogin() {
    let button = document.getElementById('login');
    let sidebar = document.getElementsByClassName('sidebar')[0];
    button.disabled = true;
    let email = localStorage.getItem('email');
    let password = localStorage.getItem('password')
    let alert = document.getElementById('alert')
    try {

        let session = await LogIN(email, password);

        document.getElementsByClassName('main-panel')[0].classList.remove('blurredElement');
        sidebar.classList.add('blurredElement');
        updateDatas(session);
        localStorage.setItem('email', email);
        localStorage.setItem('password', password)
        alert.style.display = 'none';
        updateLoginDetails(email, password)
        $('#exampleModal').modal('hide');
        document.getElementById('customDIV').classList.remove('blurredElement');


    }
    catch (err) {
        console.log(err);


        login.disabled = false;

        alert.innerText = 'Something Went Wrong!If your credentials were correct , send below error to developer \n' + err;
        alert.style.display = '';
        $('#exampleModal').modal('hide');
    }


}

window.addEventListener('DOMContentLoaded', async () => {
    if (localStorage.getItem('email') != null) {
        $('#exampleModal').modal('show');
        await autoLogin();
    }
})


function updateLoginDetails(email, pass) {

    const config = new ConfigParser();

    // Adding sections and adding keys
    config.read('configs.ini');
    config.set('Account', 'Email', email);
    config.set('Account', 'Pass', encodePass(pass));
    config.write('configs.ini')
}

function placeDiv(x_pos, y_pos) {
    var d = document.getElementById('customDIV');
    d.style.position = "absolute";
    d.style.left = x_pos + 'px';
    d.style.top = y_pos + 'px';
}

function saveColor(value) {

    const config = new ConfigParser();
    // Adding sections and adding keys
    config.read('configs.ini');
    config.set('Settings', 'Color', value);
    config.write('configs.ini')

}
function saveDelay() {
    let value = document.getElementById('delay').value;
    const config = new ConfigParser();
    // Adding sections and adding keys
    config.read('configs.ini');
    config.set('Settings', 'Delay', value);
    config.write('configs.ini')
}
function updateSavedDetails() {
    const config = new ConfigParser();
    // Adding sections and adding keys
    config.read('configs.ini');
    let color = config.get('Settings', 'Color');
    let delay = config.get('Settings', 'Delay');
    let image = config.get('Settings', 'Image');
    let audio = config.get('Settings', 'Audio');
    let min = config.get('Settings', 'Minimum');
    document.getElementsByClassName('col col2')[0].style.color = color;
    document.getElementById('minnumber').value = min;
    document.getElementById('image')['src'] = image;
    document.getElementById('simple-color-picker').value = color;
    document.getElementById('audio')['src'] = 'file://' + audio;
    let options = ['8', '10', '15']
    let indexoption = options.indexOf(delay);
    console.log(delay,indexoption)
    document.getElementById('delay')[indexoption].selected = true;
}
function updateImagePath(path) {
    let filenamex = path.split('/')
    let filename = filenamex[filenamex.length - 1]
    fs.copyFile(path, __dirname + '/assets/images/' + filename, (err) => {
        if (err) throw err;
        console.log('was copied to destination');
    });

    document.getElementById('image').src = path;
    const config = new ConfigParser();
    // Adding sections and adding keys
    config.read('configs.ini');
    config.set('Settings', 'Image', path);
    config.set('Settings', 'Filename', filename)
    config.write('configs.ini')
    notif(
        'Image'
    )
    
}

function updateAudioPath(path) {
    let filenamex = path.split('/')
    let filename = filenamex[filenamex.length - 1].replace(/[/\\?%*:|"<>]/g, '-').replace('#','-');
    fs.copyFile(path, __dirname + '/assets/audio/' + filename, (err) => {
        if (err) throw err;
        console.log('was copied to destination');
    });

    document.getElementById('audio').src = path;
    const config = new ConfigParser();
    // Adding sections and adding keys
    config.read('configs.ini');
    config.set('Settings', 'Audio', path);
    config.set('Settings', 'AudioFilename', filename)
    config.write('configs.ini')
    notif('AUDIO')
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//placeDiv(15, 290)
placeDiv(275, 280)

updateSavedDetails();
async function testAlert() {
    let button = document.getElementById('testAlert');
    button.classList.add('unclickable');
    let alertBOX = document.getElementById('alertBOX');
    alertBOX.style.visibility = 'hidden';
    const config = new ConfigParser();
    config.read('configs.ini');
    let delay = config.get('Settings', 'delay');
    let audio = config.get('Settings', 'AudioFilename')
    const res = await axios.get('http://localhost:3000/recentTrans')
    let data = res.data;
    playAudio(audio);
    let amount = data['amount'];
    let sender = data['properties']['senderName']
    let remarks = data['properties']['remarks']
    document.getElementById('senderName').innerText = sender;
    document.getElementById('amount').innerText = amount;
    document.getElementById('remarks').innerText = remarks;
    alertBOX.style.visibility = '';

}

function playAudio(filename) {
    // let playes = 'file: //' + __dirname + '/assets/audio/'+filename;
    // let sound = new Audio (__dirname+'/assets/audio/'+filename);
    player.play(__dirname + '/assets/audio/' + filename, function (err) {
        if (err) console.log(err);
    button.classList.remove('unclickable');

    })
}

function updateMinimum() {
    let min = document.getElementById('minnumber').value;
    const config = new ConfigParser();
    // Adding sections and adding keys
    config.read('configs.ini');
    config.set('Settings', 'Minimum', min);
    config.write('configs.ini')

}

var watchercount =0;
var watcher = setInterval(function () {
    if($('#exampleModal').is(':visible')){
        //RELOAD THE DOM IF IT FAILS TO CLOSE MODAL EVEN AFTER n[i.e 10] seconds;
        watchercount++;
       if(watchercount >= 10){
           location.reload();
       }
    }
    let mainpanel = document.getElementsByClassName('main-panel')[0]
    if (mainpanel.classList.contains('blurredElement')) {
        //
    }
    else {
        
        
        let p = document.getElementsByClassName('text-center typewriter')[0];
        if (p.innerText = 'Loggiing You Automatically') {
            $('#exampleModal').modal('hide');
            clearInterval(watcher);
        }
    }
}, 1000);


function closeModal(){
    $('#exampleModal').modal('hide');
}


function clearStorage(){
    localStorage.clear();
    location.reload();
}