"use strict";

const ffload = require('./ffload');
const tabs = require('sdk/tabs');
const self = require("sdk/self");

const loader = ffload.loader();

const sllib = loader.get(self.data.url('scenariolist'));
const tslib = loader.get(self.data.url('trollstore'));
const trollStore = tslib.trollStore;

const pageMod = require("sdk/page-mod");

const disqusDeps = [
  self.data.url("clientload.js"),
  self.data.url("define.js")
].concat(ffload.computeDeps(self.data.url("disqus.js")));

const scenarioDeps = [
  self.data.url("clientload.js"),
  self.data.url("define.js")
].concat(ffload.computeDeps(self.data.url("ffscenario.js")));

console.log("scenarioDeps is " + JSON.stringify(scenarioDeps));

function ignoreMessage() {}

function onTrollCheck(request, sender, sendResponse) {
  sendResponse({troll: request.troll,
                isTroll: trollStore.checkTroll(request.troll)});
  return true;
}

function onTrollDel(request, sender, sendResponse) {
  sendResponse({troll: request.troll,
                isTroll: trollStore.delTroll(request.troll)});
  return true;
}

function onTrollAdd(request, sender, sendResponse) {
  sendResponse({troll: request.troll,
                isTroll: trollStore.addTroll(request.troll)});
  return true;
}

var messageFuncs = {init: ignoreMessage,
                    loadLibrary: ignoreMessage,
                    showPageAction: ignoreMessage,
                    trollCheck: onTrollCheck,
                    trollDel: onTrollDel,
                    trollAdd: onTrollAdd}

function onMessage(worker, messagePayload) {
  var responseChannel = messagePayload._responseChannel;
  var sendResponse = worker.port.emit.bind(worker.port, responseChannel);
  var request = JSON.parse(JSON.stringify(messagePayload));
  delete(request['_responseChannel']);
  var sender = {tab: worker.tab};
  console.log("Got message: " + JSON.stringify(request));
  if (request.type && messageFuncs[request.type]) {
    return messageFuncs[request.type](request, sender, sendResponse);
  } else {
    console.log("Unintelligible message: " + JSON.stringify(request));
  }
}

function newWorker(worker) {
  worker.on("message", onMessage.bind(null, worker));
}

pageMod.PageMod({
  include: "*",
  contentStyleFile: [self.data.url("scenario.css")]
});

pageMod.PageMod({
  include: /https?:\/\/([^\/]+\.)?disqus.com\/embed.*/,
  attachTo: ["frame"],
  contentScriptFile: disqusDeps
}).on("attach", function(worker) {
  newWorker(worker);
});

tabs.on("ready", function tabsOnReady (tab) {
  var retval = sllib.findScenarios(tab.url);
  if (retval) {
    tab.attach({
      contentScriptFile: self.data.url("xpathcheck.js"),
      onMessage: function tabOnMessage(response) {
        try {
          var scenario = response.scenario;
          newWorker(tab.attach({
            contentScriptFile: scenarioDeps,
            contentScriptOptions: {scenario: scenario}
          }));
          console.log("scenario attached");
        } catch (e) {
          console.log(e);
        }
      }
    }).postMessage(retval);
  }
});
