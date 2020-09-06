const axios = require('axios');
const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;
const HUE_CLIENT_ID = process.env.HUE_CLIENT_ID;
const HUE_CLIENT_SECRET = process.env.HUE_CLIENT_SECRET;

const md5 = (string) => {
    return crypto.createHash('md5').update(string).digest('hex');
}

const makeDigestResponse = (realm, nonce) => {
    const hash1 = md5(`${HUE_CLIENT_ID}:${realm}:${HUE_CLIENT_SECRET}`);
    const hash2 = md5('POST:/oauth2/token')
    return md5(`${hash1}:${nonce}:${hash2}`)
}

const app = express();

app.use(bodyParser.json());

app.get('/', (req,res) => {
    console.log({get: 'get', query: req.query})
    axios
      .post(`https://api.meethue.com/oauth2/token?code=${req.query.code}&grant_type=authorization_code`)
      .then( res => {
        console.log('token response', res)
      })
      .catch(error => {
          console.log(error.response)
          const {realm, nonce} = error.response
          const digest = makeDigestResponse(realm, nonce)
          const authHeader = `Digest username="${HUE_CLIENT_ID}", realm="${realm}", nonce="${nonce}", uri="/oauth2/token", response="${digest}"`
          axios.post(`https://api.meethue.com/oauth2/token?code=${req.query.code}&grant_type=authorization_code`, {headers: {Authorization: authHeader}})
            .then( res => {
              console.log('token response', res)
            })
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