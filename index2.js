
const request = require('request')
const express = require('express')
const fs = require('fs')
const rp = require('request-promise')
const markdown = require('markdown-it')()





const clientId = '548287020533.625058625702';
const clientSecret = '7f6727c0a96aa971058462b7207a0262';

const signingSecret = '6b257fb3bece21f7cd83d918867c6c86';

const verificationToken = 'vcdGbrlJQJ6EsWti9wYHPCYr';

const app = express();

const app2 = express();
const helpers = require('./helpers');


PORT=4390;
PORT2=4391;



app.listen(PORT, function () {
    console.log("Server listening on: http://localhost:%s", PORT);
});

app.get('/', function (req, res) {
    res.send('Ngrok is working2! - Path Hit: ' + request.url);
});

app.get('/oauth', function(req, res) {
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    } else {
        // If it's there...

        // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID,
        // client secret, and the code we just got as query parameters.
        request({
            url: 'https://slack.com/api/oauth.access', //URL to hit
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
            method: 'GET', //Specify the method
        }, function (error, responce, body) {
            if (error) {
                console.log(error);

            } else {
                res.json(body);
            }
        })
    }

});

app.get('/redirect', function(req, res) {
   request(
       {
           url: 'https://slack.com/api/oauth.access',
           qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret, redirect_uri: 'https://self-signed.looker.com:9999/login'},
           method: 'GET',
       }, function (error, responce, body) {
           var JSONresponse = JSON.parse(body)
           if (!JSONresponse.ok){
               console.log(JSONresponse)
               res.send("Error encountered: \n"+JSON.stringify(JSONresponse)).status(200).end()
           }else{
               console.log(JSONresponse)
               res.send("Success!")
           }
       }
   )
});

app.get('/addto', function (req, res){
   res.sendFile(__dirname + '/add_to_slack.html')
});



app.post('/command', function(req, res) {
    res.send( 'received command ' + req + 'Your ngrok tunnel is up and running!')
});





app2.listen(PORT2, function () {
    console.log("Server 2 listening on: http://localhost:%s", PORT2);
});

app.get('/signin', function (req, res){
    res.sendFile(__dirname + '/sign_in_with_slack.html')
});





