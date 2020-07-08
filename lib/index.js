const express = require('express');
const app = express()
app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))

// POST method route
app.post('/', function (req, res) {
    console.log(req);
    let action = req.body.queryResult.action; 
    console.log(action);
    let responseJson = {};
    responseJson.fulfillmentText = 'This is an endpoint published to RunKit'; // displayed response
    if(action === 'getScore'){
        let responseJson = {};
        let parameters = req.body.queryResult.parameters;
        let contexts = req.body.queryResult.outputContexts;
        
        console.log('Parameters:'+JSON.stringify(parameters));
        console.log('Input Contexts:'+JSON.stringify(contexts));
        
        var item = contexts.find(item => item.name.endsWith('session-vars'));
        if(item){
            console.log('SessionVars:'+JSON.stringify(item));
            console.log('SessionVars Params:'+JSON.stringify(item.parameters));
            let score1 = parseInt(item.parameters.score1);
            let score2 = parseInt(item.parameters.score2);
            let score3 = parseInt(item.parameters.score3);
            let prefixResponse = '';
            if (score3 === 0){
                prefixResponse = 'Correct!';
            }
            else{
                prefixResponse = 'Incorrect! The correct answer is Fallback Intent';
            }
            let fullScore = score1+score2+score3;
            //responseJson.fulfillmentText = 'Your final score is '+fullScore+' out of 3';
            responseJson.fulfillmentMessages = [];
            let simpleResponses = [];
            let simpleResponse = {};
            let textToSpeech = prefixResponse+'. Your final score is '+fullScore+' out of 3';
            simpleResponse.textToSpeech = textToSpeech;
            simpleResponses.push(simpleResponse);
            let fulfillmentMessage = {};
            fulfillmentMessage.platform = 'ACTIONS_ON_GOOGLE';
            fulfillmentMessage.simpleResponses = simpleResponses;
            responseJson.fulfillmentMessages.push(fulfillmentMessage);
            console.log('Response:'+JSON.stringify(responseJson));
            res.json(responseJson);
            /*
            "fulfillmentMessages": [
      {
        "platform": "ACTIONS_ON_GOOGLE",
        "simpleResponses": {
          "simpleResponses": [
            {
              "textToSpeech": "Correct! Which feature helps you tune the accuracy of your chatbot's intent mapping?"
            }
          ]
        }
      },
      {
        "platform": "ACTIONS_ON_GOOGLE",
        "suggestions": {
          "suggestions": [
            {
              "title": "Export Agent"
            },
            {
              "title": "Followup Intent"
            },
            {
              "title": "ML Threshold"
            }
          ]
        }
      }
    ]
            */
        }
        else{
            responseJson.fulfillmentText = 'There was an error';
            console.log('Response:'+JSON.stringify(responseJson));
            res.json(responseJson);
        }
    }
})
;
