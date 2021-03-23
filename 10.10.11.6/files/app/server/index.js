const express = require('express');
const bodyParser = require('body-parser');
const mqtt = require('async-mqtt');
const cors = require('cors');
const { exec: child_exec } = require("child_process");
require('dotenv').config();

const mqttClient = mqtt.connect(process.env.MQTT_ADDR)
const app = express()
const port = process.env.PORT

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));

function exec(cmd) {
  return new Promise((resolve, reject) => {
    child_exec(cmd, (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    })
  })
}

async function queryTemp() {
  console.log("getting temperature");
  const cmd = "./readTemp.sh"
  const res = await exec(cmd);
  await mqttClient.publish('tempReading', res.trim());
}

let interval = setInterval(queryTemp, 2 * 1000)

async function updateConfig() {
  console.log("updating interval config");
  const cmd = `sqlite3 data.sqlite 'SELECT interval FROM config'`;
  const res = parseInt(await exec(cmd));
  clearInterval(interval);
  interval = setInterval(queryTemp, res * 1000);
}

const updateInterval = setInterval(updateConfig, 10 * 1000);

app.get('/api/temp', express.json(), async(req, res) => {
    let response = '';
     console.log("getting temperature");
    let temp = await exec('./readTemp.sh');
    res.send(temp);
})

app.post('/api/config', async (req, res) => {
  let response = "";

    console.log(req.body);
    response += "Updating query interval...\n\n";
    const cmd = `sqlite3 -echo data.sqlite 'UPDATE config SET interval = ${req.body.interval}'`

  if (req.body.interval) {
      try {
	  console.log('cmd is '+cmd);
	  const stdout = await exec(cmd);
	  response += stdout;
	  res.redirect('/');
	  //res.send(response);
      }
      catch {
	  res.send('<script type="text/javascript">window.location="/";</script>'+cmd);
      }
  }
})

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

mqttClient.on('connect', async function () {
  console.log("loaded");
  await mqttClient.publish('presence', 'Hello mqtt');
  await mqttClient.subscribe("control")
})

mqttClient.on("error", (err) => {
  console.log("error", err);
})

mqttClient.on('message', function (topic, message) {
  console.log(topic, message.toString())
  if (topic === "control" && message.toString() === "stop") {
    mqttClient.end()
  }
})
