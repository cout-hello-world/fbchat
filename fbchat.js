#!/usr/bin/env node
/*
 * MIT License
 *
 * Copyright (c) 2016 Henry Elliott
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
/*
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
    if (line.length !== 0) {
      if (line[0] === '/') {
        const cmdArr = line.substr(1).trim().split(/\s+/);
        switch (cmdArr[0]) {
        case "join":
          let name = "";
          for (let i = 1; i < cmdArr.length; i++) {
            name += (i !== cmdArr.length - 1) ? (cmdArr[i] + " ") : (cmdArr[i]);
          }
          api.getUserID(name, (err, data) => {
            if (err) {
              console.log("Facebook could not find user: " + name);
            } else {
              currentID = data[0].userID;
              rl.setPrompt('fbchat:' + name + '$ ');
            }
            rl.prompt();
          });
          //console.log(name);
          break;
        case "quit":
        case "exit":
          process.exit();
        }
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
      console.log('\n' + obj[message.senderID].name + ': ' + message.body);
      rl.prompt();
    });
  });
});
