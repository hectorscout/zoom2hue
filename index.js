const axios = require('axios');
const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;
const HUE_CLIENT_ID = process.env.HUE_CLIENT_ID;
const HUE_CLIENT_SECRET = process.env.HUE_CLIENT_SECRET;
const HUE_ACCESS_TOKEN = process.env.HUE_ACCESS_TOKEN;
const HUE_USERNAME = process.env.HUE_USERNAME;

const HUE_BASE_URL = 'https://api.meethue.com';

// const md5 = (string) => {
//     return crypto.createHash('md5').update(string).digest('hex');
// }

// const makeDigestResponse = (realm, nonce) => {
//     const hash1 = md5(`${HUE_CLIENT_ID}:${realm}:${HUE_CLIENT_SECRET}`);
//     const hash2 = md5('POST:/oauth2/token')
//     return md5(`${hash1}:${nonce}:${hash2}`)
// }

const basicAuth = () => {
    const buff = new Buffer(`${HUE_CLIENT_ID}:${HUE_CLIENT_SECRET}`)
    return `Basic ${buff.toString('base64')}`
}

const authHeaders = {
      Authorization: `Bearer ${HUE_ACCESS_TOKEN}`,
      "Content-Type": 'application/json'
  }

const app = express();

app.use(bodyParser.json());

app.get('/lights', (req, res) => {
    axios
      .get(`${HUE_BASE_URL}/bridge/${HUE_USERNAME}/lights`, {headers: authHeaders})
      .then(lightsRes => {
        res({lights: lightsRes.data})
      })
      .catch(error => console.log(error.response))
})

app.get('/whitelist', (req, res) => {
    axios
      .put(`${HUE_BASE_URL}/bridge/0/config`, {linkbutton: true}, {headers: authHeaders})
      .then((linkRes) => {
          console.log('linkRes', linkRes.data)
          axios.post(`${HUE_BASE_URL}/bridge`, {devicetype: 'herokuzoom2hue'}, {headers: authHeaders})
            .then((bridgeRes) => {
                console.log('bridgeRes', bridgeRes.data)
                res.send({
                    data: bridgeRes.data,
                    error: bridgeRes.data.error
                })
            })
            .catch(error => console.log(error))
        }
      )
      .catch(error => console.log(error))
})

app.get('/', (req,res) => {
    console.log({get: 'get', query: req.query})
    const headers = {Authorization: basicAuth()}
    axios
      .post(`${HUE_BASE_URL}/oauth2/token?code=${req.query.code}&grant_type=authorization_code`, {}, {headers})
      .then( res => {
        console.log('token response', res.data)
      })
      .catch(error => {
          console.log(error.response)
        //   const [realm, nonce] = error.response.headers["www-authenticate"].split(',').map((item) => item.split('=')[1].replace('"', ''))
        //   const digest = makeDigestResponse(realm, nonce)
        //   const authHeader = `Digest username="${HUE_CLIENT_ID}", realm="${realm}", nonce="${nonce}", uri="/oauth2/token", response="${digest}"`
        //   axios.post(`https://api.meethue.com/oauth2/token?code=${req.query.code}&grant_type=authorization_code`, {}, {headers: {Authorization: authHeader}})
        //     .then( res => {
        //       console.log('token response', res)
        //     })
        //     .catch(error => {
        //         console.log(error.response)
        //     })
        })
    res.send({ack: 'ack', message: 'it was a get'})
})

app.post('/', (req, res)  => {
    // const { event } = req.body;
    console.log({body: req});
    // console.log(req)

    res.send({ ack: 'ack' });
})


app.listen(port, () => {
  console.log('We are live on ' + port);
});

// https://api.meethue.com/oauth2/auth?clientid=JdJtWAXjXRrarPZ7CQFZE1Kv4eQiOA9T&appid=zoom2hue&deviceid=herokuzoom2hue&state=uniquetacos&response_type=code
// https://zoom2hue.herokuapp.com/?code=tXFKZCDA&state=uniquetacos

// data: {
//     2020-09-06T23:31:17.020251+00:00 app[web.1]:     access_token_expires_in: '604799',
//     2020-09-06T23:31:17.020251+00:00 app[web.1]:     refresh_token_expires_in: '9676799',
//     2020-09-06T23:31:17.020252+00:00 app[web.1]:     token_type: 'BearerToken'