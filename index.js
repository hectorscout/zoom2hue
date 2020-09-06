const express = require('express');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.json());

app.get('/', (req,res) => {
    console.log({get: 'get', body:req.body})
    res.send({ack: 'ack', message: 'it was a get'})
})

app.post('/', (req, res)  => {
    // const { event } = req.body;
    console.log({body: req.body});
    // console.log(req)
    res.send({ ack: 'ack' });
})

app.listen(port, () => {
  console.log('We are live on ' + port);
});
