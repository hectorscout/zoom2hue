const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");

const port = process.env.PORT || 8080;
const HUE_CLIENT_ID = process.env.HUE_CLIENT_ID;
const HUE_CLIENT_SECRET = process.env.HUE_CLIENT_SECRET;
const HUE_ACCESS_TOKEN = process.env.HUE_ACCESS_TOKEN;
const HUE_USERNAME = process.env.HUE_USERNAME;

const HUE_BASE_URL = "https://api.meethue.com";

const basicAuth = () => {
  const buff = new Buffer(`${HUE_CLIENT_ID}:${HUE_CLIENT_SECRET}`);
  return `Basic ${buff.toString("base64")}`;
};

const authHeaders = {
  Authorization: `Bearer ${HUE_ACCESS_TOKEN}`,
  "Content-Type": "application/json",
};

const setLightOnOff = (state, lightId = 10) => {
  axios
    .put(
      `${HUE_BASE_URL}/bridge/${HUE_USERNAME}/lights/${lightId}/state`,
      { on: state === "on", bri: 254, hue: 0, sat: 254 },
      { headers: authHeaders }
    )
    .catch((error) => console.log(error));
};

const app = express();

app.use(bodyParser.json());

app.get("/lights", (req, res) => {
  axios
    .get(`${HUE_BASE_URL}/bridge/${HUE_USERNAME}/lights`, {
      headers: authHeaders,
    })
    .then((lightsRes) => {
      res.send({ lights: lightsRes.data });
    })
    .catch((error) => console.log(error));
});

app.get("/light/:lightid", (req, res) => {
  axios
    .get(
      `${HUE_BASE_URL}/bridge/${HUE_USERNAME}/lights/${req.params.lightid}`,
      { headers: authHeaders }
    )
    .then((lightRes) => {
      res.send({ light: lightRes.data });
    })
    .catch((error) => console.log(error));
});

app.get("/light/:lightid/:state", (req, res) => {
  axios
    .put(
      `${HUE_BASE_URL}/bridge/${HUE_USERNAME}/lights/${req.params.lightid}/state`,
      { on: req.params.state === "on" },
      { headers: authHeaders }
    )
    .then((lightRes) => {
      res.send({ lightRes: lightRes.data });
    })
    .catch((error) => console.log(error));
});

app.get("/whitelist", (req, res) => {
  axios
    .put(
      `${HUE_BASE_URL}/bridge/0/config`,
      { linkbutton: true },
      { headers: authHeaders }
    )
    .then((linkRes) => {
      console.log("linkRes", linkRes.data);
      axios
        .post(
          `${HUE_BASE_URL}/bridge`,
          { devicetype: "herokuzoom2hue" },
          { headers: authHeaders }
        )
        .then((bridgeRes) => {
          console.log("bridgeRes", bridgeRes.data);
          res.send({
            data: bridgeRes.data,
            error: bridgeRes.data.error,
          });
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
});

app.get("/", (req, res) => {
  console.log({ get: "get", query: req.query });
  const headers = { Authorization: basicAuth() };
  axios
    .post(
      `${HUE_BASE_URL}/oauth2/token?code=${req.query.code}&grant_type=authorization_code`,
      {},
      { headers }
    )
    .then((res) => {
      console.log("token response", res.data);
    })
    .catch((error) => {
      console.log(error.response);
    });
  res.send({ ack: "ack", message: "it was a get" });
});

app.post("/", (req, res) => {
  const { event } = req.body;
  console.log({ body: req.body });
  console.log(("payload", req.body.payload));
  //   if (event === "meeting.participant_left") {
  //     setLightOnOff("off", 5);
  //   } else if (event === "meeting.participant_joined") {
  //     setLightOnOff("on", 5);
  //   }
  if (event === "user.presence_status_updated") {
    if (req.body.payload.object.presence_status === "Do_Not_Disturb") {
      setLightOnOff("on", 10);
    } else {
      setLightOnOff("off", 10);
    }
  }

  res.send({ ack: "ack" });
});

app.listen(port, () => {
  console.log("We are live on " + port);
});

// https://api.meethue.com/oauth2/auth?clientid=JdJtWAXjXRrarPZ7CQFZE1Kv4eQiOA9T&appid=zoom2hue&deviceid=herokuzoom2hue&state=uniquetacos&response_type=code
// https://zoom2hue.herokuapp.com/?code=tXFKZCDA&state=uniquetacos

// data: {
//     2020-09-06T23:31:17.020251+00:00 app[web.1]:     access_token_expires_in: '604799',
//     2020-09-06T23:31:17.020251+00:00 app[web.1]:     refresh_token_expires_in: '9676799',
//     2020-09-06T23:31:17.020252+00:00 app[web.1]:     token_type: 'BearerToken'
