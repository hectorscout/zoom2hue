const express = require('express');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', (req, res)  => {
    const event = { event } = req.body;
    console.log({event});
    res.send({ ack: 'ack' });
})

app.listen(port, () => {
  console.log('We are live on ' + port);
});