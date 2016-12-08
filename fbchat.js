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

  api.setOptions({selfListen: true});

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'fbchat> '
  });

  rl.prompt();

  rl.on('line', (line) => {
    //api.sendMessage({body: line}, currid);
    if (line.length !== 0) {
      if (line[0] === '/') {
        const cmdArr = line.substr(1).split(/\s+/);
      } else {
      }
    }
    rl.prompt();
  });

  api.listen((error, message) => {
    api.getUserInfo(message.senderID, (err, obj) => {
      console.log(obj[message.senderID].name + ": " + message.body);
      rl.prompt();
    });
  });
});
