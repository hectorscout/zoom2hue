const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.json());

app.get('/', (req,res) => {
    console.log({get: 'get', body:req})
    axios
      .post(`https://api.meethue.com/oauth2/token?code=${req.query.code}&grant_type=authorization_code`)
      .then( res => {
        console.log('token response', res)
      })
      .catch(error => {console.log(error)})
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