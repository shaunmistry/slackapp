
const request = require('request')
const express = require('express')
const fs = require('fs')
const rp = require('request-promise')
const markdown = require('markdown-it')()
const helpers = require('./helpers');




const clientId = '548287020533.625058625702';
const clientSecret = '7f6727c0a96aa971058462b7207a0262';

const signingSecret = '6b257fb3bece21f7cd83d918867c6c86';

const verificationToken = 'vcdGbrlJQJ6EsWti9wYHPCYr';

const app = express();

const app2 = express();



PORT_NO=4390;
PORT2=4391;

// Start the express application
const port = process.env.PORT || PORT_NO;
app.listen(port, () => {
    console.log(`server listening on port ${port}`)
});



/**
 STEP 1: Initialize the OAuth Flow

 Documentation: https://api.slack.com/docs/oauth
 **/
app.get('/install', (req, res) => {
    let scopes = ['commands']
    let params = {
        client_id: process.env.SLACK_CLIENT_ID || clientId,
        scope:scopes.join(' '),
        //redirect_uri: process.env.SLACK_REDIRECT_URL,
        redirect_uri: 'http://2745dedd.ngrok.io/redirect/command',
        state: `unique_string_passed_back_upon_completion`
    };
    // add parameters to the redirect url, e.g.
    // https://slack.com/oauth/authorize?client_id=<your-client-id>&scope=commands&redirect_uri=<your-redirect-url>&state=<unique-string>
    let url = helpers.getUrlWithParams('https://slack.com/oauth/authorize', params);
    return res.redirect(url)
});

/**
 STEP 1 (alternative): Initialize the OAuth Flow through the "Add to Slack" button
 Documentation: https://api.slack.com/docs/slack-button
 **/
app.get('/add-to-slack-button', (req, res) => {
    // TODO: add your required scopes
    let scopes = ['commands'];

    let params = {
        client_id: process.env.SLACK_CLIENT_ID || clientId,
        scope: scopes.join(' '),
        redirect_uri: 'http://2745dedd.ngrok.io/redirect/command',
        //redirect_uri: process.env.SLACK_REDIRECT_URL,
        state: 'unique-string-to-be-passed-back-upon-completion'
    };

    // add parameters to the redirect url, e.g.
    // https://slack.com/oauth/authorize?client_id=<your-client-id>&scope=bot commands&redirect_uri=<your-redirect-url>&state=<unique-string>
    let url = helpers.getUrlWithParams('https://slack.com/oauth/authorize', params);

    // render the Slack Button
    return res.send('<a href="'+url+'"><img alt=""Add to Slack"" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>')
});


app.get('/signin', function (req, res){
    res.sendFile(__dirname + '/sign_in_with_slack.html')
});


/**
 STEP 2: Retrieve API Access Token after Authorization Grant

 Documentation: https://api.slack.com/methods/oauth.access
 **/
app.get('/redirect', (req, res) => {
    // TODO: verify that `req.query.state` is the same as your App provided when the flow was initialized

    console.log('In /redirect');
    let params = {
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: 'http://2745dedd.ngrok.io/redirect/command',
        //redirect_uri: process.env.SLACK_REDIRECT_URL,
        code: req.query.code
    };

    return rp({
        url: helpers.getUrlWithParams('https://slack.com/api/oauth.access', params),
        method: 'GET'
    })
        .then(result => {
            let slackData = JSON.parse(result);

            if(!slackData) throw new Error('Invalid Slack API data received');
            if(!slackData.ok) throw new Error(slackData.error);

            // TODO: Store Access Tokens in your Database

            return res.send(slackData)
        })
        .catch(err => {
            console.log(err);
            return res.send({error: err.message})
        })
});


app.get('/redirect/command', (req, res) => {
    // TODO: verify that `req.query.state` is the same as your App provided when the flow was initialized

    console.log('In /redirect/command');
    let params = {
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: 'http://2745dedd.ngrok.io/redirect/command',
        //redirect_uri: process.env.SLACK_REDIRECT_URL,
        code: req.query.code
    };

    return rp({
        url: helpers.getUrlWithParams('https://slack.com/api/oauth.access', params),
        method: 'GET'
    })
        .then(result => {
            let slackData = JSON.parse(result);

            if(!slackData) throw new Error('Invalid Slack API data received');
            if(!slackData.ok) throw new Error(slackData.error);

            // TODO: Store Access Tokens in your Database

            return res.send(slackData)
        })
        .catch(err => {
            console.log(err);
            return res.send({error: err.message})
        })
});


/*app.get('/redirect/command', function(req, res) {
    console.log('received command ' + req.query.state + ' Your ngrok tunnel is up and running!');
    res.send( 'received command ' + req + ' Your ngrok tunnel is up and running!')
});*/


app.get('/redirect/command2', function(req, res) {
    console.log('received command 2 ' + req.query.state + ' Your  bot is up and running!');
    res.send( 'received command 2 ' + req + ' Your tunnel is up and running!')
});



app.get('/auth/redirect', function(req, res) {
   request(
       {
           url: 'https://slack.com/api/oauth.access',
           qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret},
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

app.post('/command', function(req, res) {
    console.log('received command ' + req + 'Your ngrok tunnel is up and running!')
    res.send( 'received command ' + req + 'Your ngrok tunnel is up and running!')
});






