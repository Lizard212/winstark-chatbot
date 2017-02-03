var logger = require('morgan');
var http = require('http');
var request = require('request');
var bodyParser = require('body-parser');
var express = require('express');
var router = express();


var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

var server = http.createServer(app);

app.get('/', (req, res)=> {
  res.send("Hello. This is index page !You're welcome here !")
});

app.get('/webhook', function(req, res) {
  if(req.query['hub.mode'] === 'subcribe' &&
   req.query['hub.verify_token'] === 'EAACZC2FeNGQYBANtZBMcxySuJTLJdHMMGQ67v2131Qu8QoicJRdZBhe0It2rp8920LhCarmk1fS1VgFxZCUFYWazOfA6AqUlxDpuwSv5DmO6SMQFA6LIPbBIfphAgSyCLvvUCTKcqEDTlAm7ia6A0Y9dK49dazMIpaG6KnsSfAZDZD'){
    res.status(200).send(req.query['hub.chanllenge']);
  }else{
    console.error("Failed validation. Make sure the validation tokens match.");
   res.sendStatus(403);
  }
  
});

app.post('/webhook', function(req, res){
  var data = req.body;
  // Make sure this is a page subcription
  if(data.object === 'page'){
    // 
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event){
        if(event.message){
          receivedMessage(event);
        } else { 
          console.log("webhook received unknown event: ", event);
        }
      });
    });
      res.sendStatus(200);
  }

});

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientId = event.recipient.id;
  var timeOfMessage = event.timestamp;

  console.log("Received message for user %d and page at %d with message:", 
    senderID, recipientID, timeOfMessage);
  console.log(JSON.strinify(message));

  var messageId = message.mid;
  var messageText = message.text;
  var messageAttachments = messsage.attachments;

  if(messageText) { 
    switch (messageText) {
      case 'hello':
        sendHelloMessage(senderID);
        break;
      default:
        sendTextMessage(senderID, messageText);
    }

  } else if(messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };
  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData
  }, function (error, response, body) {
    if( !error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;
      
      console.log("Successfully sent hello message with id %s to recipient %s",
      messageId, recipientId);
    } else {
      console.error("Unable to send messge.");
      console.error(response);
      consolel.error(error);
    }
  });
}

app.set('port', (process.env.PORT || 5000));

server.listen(app.get('port'), function() {
  console.log('Chat bot server listening at ', app.get('port'));
});



