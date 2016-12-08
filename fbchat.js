#!/usr/bin/env node
/*
 * Copyright 2016 Henry Elliott
 * MIT License
 *
 * Developed with node version 6.9.1
 */
'use strict';

var login = require('facebook-chat-api');
const readline = require('readline');
var fs = require('fs');

var config = fs.readFileSync('config.json', 'utf8');

login(JSON.parse(config), (err, api) => {
  if (err) {
    return console.error(err);
  }

  api.setOptions({logLevel: "silent"});

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'fbchat$ '
  });

  rl.prompt();

  let currentID = null;

  rl.on('line', (line) => {
    //api.sendMessage({body: line}, currid);
    if (line.length !== 0) {
      if (line[0] === '/') {
        const cmdArr = line.substr(1).trim().split(/\s+/);
        switch (cmdArr[0]) {
        case "join":
          //console.log("Joining: cmdArr.length === " + cmdArr.length);
          let name = "";
          for (let i = 1; i < cmdArr.length; i++) {
            name += (i !== cmdArr.length - 1) ? (cmdArr[i] + " ") : (cmdArr[i]);
          }
          api.getUserID(name, (err, data) => {
            // Handle error.
            currentID = data[0].userID;
            rl.setPrompt('fbchat:' + name + '$ ');
            rl.prompt();
          });
          //console.log(name);
          break;
        case "quit":
        case "exit":
          process.exit();
        }
        //console.log("cmdArr[0] === " + cmdArr[0]);
        rl.prompt();
      } else {
        api.sendMessage(line, currentID);
        rl.prompt();
      }
    } else {
      rl.prompt();
    }
  });

  api.listen((error, message) => {
    api.getUserInfo(message.senderID, (err, obj) => {
      console.log(obj[message.senderID].name + ": " + message.body);
      rl.prompt();
    });
  });
});
