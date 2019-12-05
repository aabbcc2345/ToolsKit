const express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var CryptoJS = require('crypto-js');

const apn = require('apn');

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// apns init,
// !!  btw the info as follow should be write in a config file or environment variable!!! 
var options = {
	token: {
    	key: "./key/.p8",
    	keyId: "",
    	teamId: ""
  	},
  	production: false
};
const bundle_id = "";



var apnProvider = new apn.Provider(options);
let deviceToken = ''

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/postDeviceToken', function (req, res) {
	console.log(req.body.deviceToken)
	deviceToken = req.body.deviceToken
	res.send('200 OK')
})

app.get('/notificationTriger', function(req, res) {
	console.log("trigger active")
	sendNotification(deviceToken)
	res.send('200 OK')
}) 

function sendNotification(deviceToken) {
	var note = new apn.Notification();
	note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
	note.badge = 3;
	note.sound = "ping.aiff";
	note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
	note.payload = {'messageFrom': 'John Appleseed'};
	note.topic = bundle_id;

	apnProvider.send(note, deviceToken).then( (result) => {
  		// see documentation for an explanation of result
  		console.log(result);
	});
}

// sendNotification("886d3eb5e81e21bb622c4d85ff10bd80f0e563c45a3b211a473a1f444332508b")

app.listen(3000, () => console.log('Backend app listening on port 3000!'))