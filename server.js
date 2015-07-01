#!/bin/env node
//  OpenShift sample Node application
var irc = require('irc');
var request = require('request')
var bot = new irc.Client('irc.lab.bos.redhat.com', process.env.OPENSHIFT_APP_NAME || 'ircbot', {
    channels: ['#smellysneakers'],
    port: 6667,
    debug: true,
    autoRejoin: true
});


bot.addListener('error', function(message) {
    console.log('error: ', message);
});

bot.addListener('join', function(channels, message){
  bot.say(channels, 'kbenson++');
  console.log("Successfully added karma");
});

bot.addListener('message', function(from, to, message) {
    if(  message.indexOf('kbenson--') > -1) {
        bot.say(to, 'That\'s not very nice! kbenson++');
    }

    if ( message.indexOf('ircbot','weather') > - 1){
      request({ url: 'http://api.openweathermap.org/data/2.5/weather?zip='+27601+',us&units=imperial', json: true}, function (error, response, body){
        if(error){
          return bot.say('Error, couldn\'t read the weather today: ', error);
        }
        else if(!error && response.statusCode == 200){
          bot.say(to, "The current temperature in " + body.name + " is " + body.main.temp + " degrees Farenheit. It is mostly " + body.weather[0].description + "." );
          console.log(body);
        }
      });
    }
});
