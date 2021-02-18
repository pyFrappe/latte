const fetch = require('node-fetch');

const axios = require('axios')


function encodePass(pass){
    var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
    var encodedString = Base64.encode(pass);
    return encodedString
}
async function LogIN(email,pass) {
    
    
    let response = await fetch('https://esewa.com.np/authenticate?redirectForm=',{
        method: 'POST',
        //body: JSON.stringify(todo),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'esewa_id': email,
            'password': encodePass(pass),
            'Content-Type': 'application/json;charset=utf-8'
        }
    });
    const data = await response.headers.get('set-cookie');
    const authesewa = data.split('authesewa=')[1].split('; Max-Age=86400;')[0]
    const xsrf = data.split('XSRF-TOKEN=')[1].split('; Path=/;')[0]
    const dict = {'authesewa':authesewa,'xsrf':xsrf}
    //await latestDonation(dict,data)
    const balance = await getInfo(dict);
    const fulldict = Object.assign({}, dict, balance);
    console.log(fulldict)
    return fulldict;
}

async function latestDonation(dict,cookies){
    const res = await axios.get('https://esewa.com.np/api/web/auth/transactions?channel=ALL&from_date=2020-09-09&page=0&product_id=1&prop_value=&size=15&status=COMPLETE&to_date=2021-02-06&type=CR',{
        headers :{
            'X-XSRF-TOKEN-ES':dict['xsrf'],
            Cookie :'authesewa='+dict['authesewa']
        }
    })
    let transCode = res.data[0]['transaction_code'];
    let transVer = res.data[0]['transaction_version'];
    let moduleID = res.data[0]['module_id'];
    let newURL = `https://esewa.com.np/api/web/auth/transactions/${transCode}?module_id=${moduleID}&transaction_version=${transVer}`;

    const trans = await axios.get(newURL,{
        headers :{
            'X-XSRF-TOKEN-ES':dict['xsrf'],
            Cookie :'authesewa='+dict['authesewa']
        }
    })
    return trans.data;
    
} 


async function getBalance(dict){
    const trans = await axios.get('https://esewa.com.np/api/web/auth/balance',{
        headers :{
            'X-XSRF-TOKEN-ES':dict['xsrf'],
            Cookie :'authesewa='+dict['authesewa']
        }
    })
    return trans.data
}
async function getInfo(dict){
    const info =await axios.get('https://esewa.com.np/api/web/auth/login_credentials',{
        headers :{
            'X-XSRF-TOKEN-ES':dict['xsrf'],
            Cookie :'authesewa='+dict['authesewa']
        }
    })
    return info.data
}

async function LocalLogin(email,pass){
    let data = email+'@!!'+encodePass(pass);
    let res = await axios.get('http://localhost:3000/getDetails',{headers:{'datas':data}
})
    console.log(res.data)
}

async function LogIN(email,pass) {
    
    
    let response = await fetch('https://esewa.com.np/authenticate?redirectForm=',{
        method: 'POST',
        //body: JSON.stringify(todo),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'esewa_id': email,
            'password': encodePass(pass),
            'Content-Type': 'application/json;charset=utf-8'
        }
    });
    const data = await response.headers.get('set-cookie');
    const authesewa = data.split('authesewa=')[1].split('; Max-Age=86400;')[0]
    const xsrf = data.split('XSRF-TOKEN=')[1].split('; Path=/;')[0]
    const dict = {'authesewa':authesewa,'xsrf':xsrf}
    const balance = await getInfo(dict);
    const fulldict = Object.assign({}, dict);
    console.log(fulldict)
    return fulldict;
}