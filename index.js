const express = require('express');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', (req, res)  => {
    console.log({req, res});
    res.send({ ack: 'ack' })
})

app.listen(port, () => {
  console.log('We are live on ' + port);
});
