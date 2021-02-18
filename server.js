const express = require('express')
const fetch = require('node-fetch');
const fs = require('fs');

const axios = require('axios');
const { config } = require('process');
const ConfigParser = require('configparser');
const app = express()
const port = 3000

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/assets/'));
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
  res.render('about.html');
})

app.get('/interval', (req, res) => {
  const config = new ConfigParser();
    // Adding sections and adding keys
  config.read('configs.ini');
  let image = config.get('Settings','Filename');
  let audio = config.get('Settings','AudioFilename');
  let delay = config.get('Settings','Delay');
  let Minimum = config.get('Settings','Minimum');
  let color = config.get('Settings','Color');
  res.render('socket.html',{image:image,audio:audio,delay:delay,color:color,minimum:Minimum});
})

app.get('/customCSS', (req, res) => {
  const config = new ConfigParser();
    // Adding sections and adding keys
  config.read('configs.ini');
  let image = config.get('Settings','Filename');
  let audio = config.get('Settings','AudioFilename');
  let delay = config.get('Settings','Delay');
  let Minimum = config.get('Settings','Minimum');
  let color = config.get('Settings','Color');
  res.render('visiblesocket.html',{image:image,audio:audio,delay:delay,color:color,minimum:Minimum});
})

app.get('/getDetails', async (req, res) => {
  
  //console.log((JSON.parse(JSON.stringify(req.headers))['datas']));
  // console.log(req.dict)
  // var credentialsx = await JSON.parse(JSON.stringify(req.headers))['datas'].toString();

  // let credentials = req.header('datas').toString().split('@!!')[0];
  try {
    let email = req.header('email');
    let password = req.header('pass');
    let resp = await LogIN(email, password);
    res.json(resp);
  }
  catch (err) {
    res.send(err);
  }

})

app.get('/recentTrans',async (req,res)=>{
  const config = new ConfigParser();
  config.read('configs.ini');
  let email = config.get('Account', 'Email');
  let password = config.get('Account','Pass')
  let response= await getRecent(email,password);
  res.send(response)
})

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
  return info.data
}
async function LogIN(email, pass) {
  try {

    let response = await fetch('https://esewa.com.np/authenticate?redirectForm=', {
      method: 'POST',
      //body: JSON.stringify(todo),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'esewa_id': email,
        'password': pass,
        'Content-Type': 'application/json;charset=utf-8'
      }
    });
    //console.log(response)
    const data = await response.headers.get('set-cookie');
    const authesewa = data.split('authesewa=')[1].split('; Max-Age=86400;')[0]
    const xsrf = data.split('XSRF-TOKEN=')[1].split('; Path=/;')[0]
    const dict = { 'authesewa': authesewa, 'xsrf': xsrf }
    const balance = await getBalance(dict);
    const infox = await getInfo(dict);
    const fulldict = Object.assign({}, dict, balance, infox);
    console.log(fulldict)
    return fulldict;
  }
  catch {
    return 'error'
  }
}

async function getRecent(email,pass){
  let dict = await LogIN(email,pass);

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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})