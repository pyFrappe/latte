function showDiv(amount,remarks,name){
    document.getElementById('donator').innerText =name;
    document.getElementById('amount').innerText = amount;
    document.getElementById('remarks').innerText = remarks;
    document.getElementById('main-panel').style.visibility ='';

}

function hideDIV(){
    document.getElementById('main-panel').style.visibility ='hidden';
}
function playAudio(){
    document.getElementById('mySound').play()
}

function triggerClick(){
    //BYPASS Chrome USER BEhaviour
    playAudio();
}


function savedTrans(){
    try{
        return localStorage.getItem('recent');

    }
    catch{
        return 'No Saved Trans';
    }
}

var looker = setInterval(async ()=>{
    ///CHECK FOR TRANSACTION EVERY 30 SECONDS


    let result = await makeRequest("GET", '/recentTrans');
    let resp = JSON.parse(result);
    if(savedTrans()!=resp['transaction_code']){ //CHECK IF THIS TRANSACTION EXISTS IN LOCALSTORAGE
        let remarks = resp['properties']['remarks'];
        let amount= resp['amount'];
        let name = resp['properties']['senderName'];
        if(amount >= minimum){
            document.getElementById('buttonlol').click();
            showDiv(amount,remarks,name);
            await sleep(delay+'000');
            hideDIV();
        }
        localStorage.setItem('recent',resp['transaction_code']) //SAVE THIS TRANSACTION IN LOCALSTORAGE
    }
    else{
        console.log('No New Trans')
    }

},30000)

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}




//MAKE GET REQUEST
function makeRequest(method, url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}
