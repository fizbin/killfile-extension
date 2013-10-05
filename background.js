// Copyright 2013 Daniel Martin
// All Rights Reserved
// This file and others in the same directory may be
// distributed under the file LICENSE found in this
// directory.

var scenariolist = [];

chrome.storage.local.get(
  {scenariolist: scenariolist},
  function(results) {
    scenariolist = results.scenariolist;
  });

function initConstants() {
  var scenariolist_local = {
    pamshouseblend:[{scenario:'soapbloxScenario1',hrefpat:"^[^/]*//[^/]*/showDiary.do"}],
    escapepod:[{scenario:'wordpressScenario',hrefpat:"^[^/]*//[^/]*/[0-9]"}],
    ravelry:[{scenario:'wordpressScenario',hrefpat:"^[^/]*//blog\.[^/]*/[0-9]"}],
    blogsome:[{scenario:'pandagon2Scenario',hrefpat:"^[^/]*//pandagon[.][^/]*/[0-9]"}],
    pandagon:[{scenario:'pandagonScenario',hrefpat:"^[^/]*//[^/]*/[0-9]"},
              {scenario:'pandagonNewScenario',hrefpat:"^[^/]*//[^/]*/.*\\bsite/comments/"}],
    fauxrealtho:[{scenario:'pandagon2Scenario',hrefpat:"^[^/]*//[^/]*/[0-9]"}],
    billcara:[{scenario:'mtScenario2',hrefpat:"^[^/]*//[^/]*/archives/"}],
    // also thanks to http://christina267.wordpress.com
    scalzi:[{scenario:'wordpressScenario',hrefpat:"^[^/]*//[^/]*/whatever"}],
    philliesnation:[{scenario:'wordpressScenario',hrefpat:"^[^/]*//[^/]*/archives/"}],
    feministe:[{scenario:'wordpressScenario',hrefpat:"^[^/]*//[^/]*/blog/archives/"}],
    powweb:[{scenario:'wordpressScenario',hrefpat:"^[^/]*//feministe[.][^/]*/blog/archives/"}],
    amptoons:[{scenario:'wordpressScenario',hrefpat:"^[^/]*//[^/]*/blog/archives/"}],
    'the-riotact':[{scenario:'riotactScenario', // wordpress 1.5 ?
                    xpath:"//ol[@id='commentlist']/li[1]//cite"}],
    wordpress:[
      {scenario:'wordpressScenario', // wordpress 1.5 ?
       xpath:"//ol[contains(concat(' ',@class,' '),' commentlist ')]/li[1]/descendant::*[self::cite or self::span][1][self::cite]"
      },
      {scenario:'pandagonScenario',  // wordpress 2 ?
       xpath:"//ol[contains(concat(' ',@class,' '),' commentlist ')]/li[1]/span[@class='commentauthor']"},
      {scenario:'wordpressScenario2',
       xpath:"//ol[@id='commentlist']/li[1]/span[@class='commentauthor']"},
    ],
    blogger:[
      {scenario:'blogspotDLScenario',
       hrefpat:"^[^/]*//[^/]*/comment[.]g[?]",
       xpath:"//dl[@id='comments-block']/dt"},
    ],
    blogspot:[
      {scenario:'blogspotDLScenario',
       xpath:"//dl[@id='comments-block']/dt"},
      {scenario:'blogspotDivScenario',
       xpath:"//div[@class='blogComments']/div[@class='blogComment']"},
      {scenario:'blogspotTableScenario',
       xpath:"//table[@class='MainTable']//td[@class='MessageCell']"}
    ],
    livejournal:[
      {scenario:'livejournalScenario2',
       hrefpat:"^[^/]*//((syndicated|community)\\.[^/]*/)?[^/]*/[0-9]",
       xpath:"//div[contains(concat(' ',@class,' '),' comment_wrapper ')]",
      },
      {scenario:'livejournalScenario3',
       xpath: "//div[@class='box' and starts-with(@id,'ljcmt')]",
       hrefpat:"^[^/]*//((syndicated|community)\\.[^/]*/)?[^/]*/[0-9]",
      },
      {scenario:'livejournalScenario4',
       xpath: "//div[starts-with(@id,'ljcmt') and descendant::span[contains(concat(' ',@class,' '),' ljuser ')]]",
       hrefpat:"^[^/]*//((syndicated|community)\\.[^/]*/)?[^/]*/[0-9]",
      },
      {scenario:'livejournalScenario5',
       xpath: "//td[@id='content']//table[@class='heading_bar']/following-sibling::div",
       hrefpat:"^[^/]*//((syndicated|community)\\.[^/]*/)?[^/]*/[0-9]",
      },
      {scenario:'livejournalScenario6',
       xpath: "//table[@class='entrybox'][2]/tbody/tr/td/table/tbody/tr/td/div",
       hrefpat:"^[^/]*//((syndicated|community)\\.[^/]*/)?[^/]*/[0-9]",
      },
      {scenario:'livejournalScenario7',
       xpath: "//div[@id='comments']//div[contains(concat(' ', @class, ' '), ' b-leaf ')]//p[contains(concat(' ', @class, ' '), ' b-leaf-username ')]",
       hrefpat:"^[^/]*//((syndicated|community)\\.[^/]*/)?[^/]*/[0-9]",
      },
      {scenario:'livejournalScenario8',
       xpath: "//div[@id='comments']//div[contains(concat(' ', @class, ' '), ' comment ')]//span[contains(concat(' ', @class, ' '), ' ljuser ')]",
       hrefpat:"^[^/]*//((syndicated|community)\\.[^/]*/)?[^/]*/[0-9]",
      },
      {scenario:'livejournalScenario_1a',
       xpath:"//span[starts-with(@id,'ljcmt')]/table[@class='talk-comment']",
       hrefpat:"^[^/]*//((syndicated|community)\\.[^/]*/)?[^/]*/[0-9]",
      },
      {scenario:'livejournalScenario',
       hrefpat:"^[^/]*//((syndicated|community)\\.[^/]*/)?[^/]*/[0-9]",
      },
      // Commented out because I think it's ugly.  Your taste may vary, so you can
      // uncomment this next line to kill/unkill people on your lj friends list.
      // Intended primarily for communities you like mostly, but one or two
      // posters get on your nerves.
      // {scenario:'ljfriendsScenario',hrefpat:"^[^/]*//[^/]*/friends"},
    ],
    scienceblogs:
    [
      {scenario:'scienceblogsScenario',hrefpat:"^[^/]*//[^/]*/\\w+/[0-9]"},
      // Do all blogs at scienceblogs.com fit this format?
    ],
// This is a disqus system. I'm still exploring what I can do with those
//    shakesville:
//    [
//      {scenario:'freethoughtblogsScenario',hrefpat:"^.*"},
//    ],
    freethoughtblogs:
    [
      {scenario:'freethoughtblogsScenario',hrefpat:"^[^/]*//[^/]*/\\w+/[0-9]"},
    ],
    feministing:
    [
      {scenario:'feministingNewScenario',
       xpath:"//div[@id='comments']//div[contains(concat(' ', @class, ' '), ' comment-author ')]"},
      {scenario:'typepadScenario',hrefpat:"^[^/]*//[^/]*/archives/[0-9]"},
      {scenario:'feministingNewFrontPageScenario',hrefpat:"^[^/]*//community\\.[^/]*/[^/]*$"},
    ],
    typepad:
    [
      {scenario:'typepadScenario',hrefpat:"^[^/]*//[^/]*/\\w+/[0-9]",
       xpath:"//div[@class='comments-content'][1]/div[contains(concat(' ',@class,' '),' comment ')][1]/p[@class='comment-footer']"},
      // There are some other typepad pages with a VERY BAD comment structure
      // (no surrounding element to grab ahold of, so that you have to
      // divide up the comment stream where-ever you see P's of a certain class)
      // Not that I won't get to them eventually, but it's going to take some
      // serious xpath voodoo
    ],
    pandasthumb:[
      {scenario:'pandasThumbScenario',hrefpat:"^[^/]*//[^/]*/archives/"}
    ],
    haloscan:[
      {scenario:'haloscanScenario',
       xpath:"//body/table[@class='MainTable']//td[@class='MessageCell']"}
    ],
    giveemhellharry:[
      {scenario:'giveemhellharryScenario1', hrefpat:"^[^/]*//[^/]*/blog/"},
      {scenario:'giveemhellharryScenario2', hrefpat:"^[^/]*//[^/]*/page/community/",
       xpath: "//div[@class='comments']"}
    ],
    truthout:[
      {scenario:'truthoutScenario',
       hrefpat:"^https?://forum.truthout.org/blog/story/",}
    ],
    athleticsnation:[
      {scenario:'athleticsNationScenario',
       xpath:"//div[@class='cx']//p[@class='cl']",
       hrefpat:"^[^?]*$"
      },
      {scenario:'athleticsNationScenario2',
       xpath:"//div[@id='comments_list']/div[starts-with(@id,'comment_item_')]/div[starts-with(@id,'comment_inner_')]",
       hrefpat:"^[^?]*$",
      },
      {scenario:'athleticsNationOldScenario',
       xpath:"//a[@name='commenttop']/following-sibling::form//table[1]",
      }  
    ],
    tnr:[{scenario:'tnrScenario',hrefpat:"^[^/]*//[^/]*/doc_posts",}],
    smalldeadanimals:[{scenario:'mtScenario1',hrefpat:"^[^/]*//[^/]*/\\w*/[0-9]",}],
    freerepublic:[{scenario:'freeperScenario', hrefpat:"^[^/]*//[^/]*/focus/f-(news|chat)/[0-9]*/(replies|posts)",}],
    nytimes:[{scenario:'nytimesBlogsScenario', hrefpat:"^[^/]*//[^/]*\\.blogs\\.[^/]*/([0-9]*/){3}[\\w-]+/",}],
    villagevoice:[{scenario:'voiceScenario',hrefpat:"^[^/]*//[^/]*/news/[0-9]",}],
    fetlife:[{scenario:'fetScenario',hrefpat:"[^/]*//[^/]*/groups/[0-9]*/group_posts/"}],
  };

  // sbNation.com is really a family of related blogs
  var sbNation =
    ("beyondtheboxscore buffalorumblings minorleagueball halosheaven lookoutlanding "+
     "lonestarball bluebirdbanter draysbay camdenchat overthemonster pinstripealley letsgotribe " +
     "royalsreview blessyouboys twinkietown southsidesox azsnakepit truebluela mccoveychronicles " +
     "gaslampball purplerow talkingchop fishstripes amazinavenue federalbaseball thegoodphight " +
     "crawfishboxes brewcrewball vivaelbirdos bleedcubbieblue bucsdugout redreporter blogabull " +
     "clipsnation sactownroyalty mavsmoneyball poundingtherock blazersedge goldenstateofmind badlefthook " +
     "sundaymorningqb cornnation burntorangenation crimsonandcreammachine dawgsports rollbamaroll " +
     "swampball andthevalleyshook rockytoptalk aseaofblue conquestchronicles bruinsnation udubdish " +
     "buildingthedam aroundtheoval blackshoediaries schembechlerhall blacksburgbeacon tomahawknation " +
     "carolinamarch ramblinracket provopride blocku rakesofmallow podiumcafe faketeams bloggingtheboys " +
     "bleedinggreennation hogshaven windycitygridiron prideofdetroit dailynorseman fieldgulls patspulpit " +
     "cincyjungle dawgsbynature behindthesteelcurtain stampedeblue bigcatcountry musiccitymiracles " +
     "arrowheadpride milehighreport globalfutbol").split(" ");
  for (c in sbNation) {
    scenariolist_local[sbNation[c]] = scenariolist_local['athleticsnation'];
  }
  scenariolist_local['deadjournal'] = scenariolist_local['livejournal'];
  scenariolist_local['journalfen'] = scenariolist_local['livejournal'];
  scenariolist_local['dreamwidth'] = scenariolist_local['livejournal'];
  chrome.storage.local.set({scenariolist: scenariolist_local});
  scenariolist = scenariolist_local;
}

var trollStore = new (function () {
  var trolls = {};
  var deletedTrolls = {};
  var addedTrolls = {};
  var lastSyncTime = 0;

  chrome.storage.local.get(
    {"trolls": trolls,
     "addedTrolls": addedTrolls,
     "deletedTrolls": deletedTrolls,
     "lastSyncTime" : lastSyncTime},
    function(localResults) {
      trolls = localResults.trolls;
      addedTrolls = localResults.addedTrolls;
      deletedTrolls = localResults.deletedTrolls;
      lastSyncTime = localResults.lastSyncTime;
    }
  );

  var trollStoreProto = this;

  this.syncMaybe = function() {
    chrome.storage.local.set(
      {"trolls": trolls,
       "addedTrolls": addedTrolls,
       "deletedTrolls": deletedTrolls,
       "lastSyncTime" : lastSyncTime});
    var nowsecs = Math.round((new Date()).getTime()/1000);
    if (nowsecs > 15 + lastSyncTime) {
      lastSyncTime = nowsecs - 10;
      chrome.storage.sync.get(
        {"trollKeys": []},
        function(results) {
          var trollKeys = results.trollKeys;
          var storedTrolls = {}
          var getKeys = {}
          for (var i = 0; i < trollKeys.length; i++) {
            getKeys[trollKeys[i]] = [];
          }
          chrome.storage.sync.get(
            getKeys,
            function(results) {
              var founddiff = false;
              for (var i = 0; i < trollKeys.length; i++) {
                var trollList = results[trollKeys[i]];
                for (var j = 0; j < trollList.length; j++) {
                  var troll = trollList[j];
                  if (troll in deletedTrolls) {
                    founddiff = true;
                  } else {
                    storedTrolls[troll] = 1;
                  }
                }
              }
              for (var troll in addedTrolls) {
                if (! (troll in storedTrolls)) {
                  founddiff = true;
                  storedTrolls[troll] = 1;
                }
              }
              if (!founddiff) {
                trolls = storedTrolls;
                deletedTrolls = {};
                addedTrolls = {};
                lastSyncTime = nowsecs;
                trollStoreProto.syncMaybe();
                return;
              }
              var allTrollsNow = Object.keys(storedTrolls);
              allTrollsNow.sort();
              trollKeyIndex = 0;
              trollKeyLength = 2;
              setKeys = {};
              setKeys['troll' + trollKeyIndex] = [];
              for (var i = 0; i < allTrollsNow.length; i++) {
                var troll = allTrollsNow[i];
                if (3 + troll.length + trollKeyLength > 4000) {
                  trollKeyIndex++;
                  trollKeyLength=0;
                  setKeys['troll' + trollKeyIndex] = [];
                }
                setKeys['troll' + trollKeyIndex].push(troll);
                trollKeyLength += 3 + troll.length;
              }
              trollKeys = Object.keys(setKeys);
              setKeys['trollKeys'] = trollKeys;
              // TODO: fix race condition that exists between
              // here and set callback
              chrome.storage.sync.set(
                setKeys,
                function () {
                  console.log('Saved!');
                  var lastError = chrome.runtime.lastError;
                  if (lastError) {
                    console.error("Err storing trolls: "
                                  + JSON.stringify(lastError));
                  } else {
                    trolls = storedTrolls;
                    deletedTrolls = {};
                    addedTrolls = {};
                    lastSyncTime = nowsecs;
                    trollStoreProto.syncMaybe();
                  }
                });
            });
        });
    }
  };
  this.addTroll = function(troll) {
    trolls[troll] = 1;
    addedTrolls[troll] = 1;
    delete deletedTrolls[troll];
    this.syncMaybe();
    chrome.alarms.create('troll-resave', {delayInMinutes: 1.0});
    return true;
  };
  this.delTroll = function(troll) {
    delete trolls[troll];
    delete addedTrolls[troll];
    deletedTrolls[troll] = 1;
    this.syncMaybe();
    chrome.alarms.create('troll-resave', {delayInMinutes: 1.0});
    return false;
  };
  this.checkTroll = function(troll) {
    this.syncMaybe();
    return troll in trolls;
  };
})();

function onInitMessage(request, sender, sendResponse) {
  if (! scenariolist) {
    initConstants();
  }
  var url = sender.tab.url.replace(/#.*/, '');
  var hostre = /^([a-z0-9]+):\/\/([^\/]*)(\/.*|$)/;
  var hostrematch = hostre.exec(url);
  if (hostrematch) {
    var host = hostrematch[2];
    var domain = host.replace(/^(?:.*[.])?((?!www\.)[a-zA-Z0-9-]+)(?:\.\w{3}|(?:\.\w{2})+)$/,'$1');
    var matchl = scenariolist[domain];
    var re;
    if (matchl) {
      var matchind;
      retval = [];
      for (matchind in matchl) {
        var match = matchl[matchind];
        if (match.hrefpat) {
          re = new RegExp(match.hrefpat);
          if (!re.test(url)) {
            continue;
          }
        }
        retval.push(match);
      }
      if (retval) {
        console.log("Gonna send " + JSON.stringify(retval) + " back to tab at " + url);
        sendResponse(retval);
        return true;
      }
    }
  }
  return false;
}

function onLoadScenarios(request, sender, sendResponse) {
  var allFrames = request.allFrames || false;
  chrome.tabs.insertCSS(sender.tab.id,
                        {file: 'scenario.css', allFrames: true});
  chrome.tabs.executeScript(
    sender.tab.id, {file: 'scenarios.js', allFrames: allFrames},
    function () {
      sendResponse({});
    });
  return true;
}

function onShowPageAction(request, sender, sendResponse) {
  chrome.pageAction.show(sender.tab.id);
  return false;
}

function onApplyScenario(request, sender, sendResponse) {
  onLoadScenarios(
    {}, sender,
    function() {
      chrome.tabs.executeScript(
        sender.tab.id, {code: 'dtm_killfile_initScenario("' + request.scenario + '")'},
        function () {chrome.pageAction.show(sender.tab.id);
                     sendResponse({});}
      );
    }
  );
  return true;
}

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

var messageFuncs = {init: onInitMessage,
                    applyScenario: onApplyScenario,
                    loadScenarios: onLoadScenarios,
                    showPageAction: onShowPageAction,
                    trollCheck: onTrollCheck,
                    trollDel: onTrollDel,
                    trollAdd: onTrollAdd}

function onMessage(request, sender, sendResponse) {
  if (request.type && messageFuncs[request.type]) {
    return messageFuncs[request.type](request, sender, sendResponse);
  } else {
    console.log("Unintelligible message: " + JSON.stringify(request));
  }
}

function onAlarm(alarm) {
  if (alarm.name == "troll-resave") {
    trollStore.syncMaybe();
  } else {
    console.warn("Unknown alarm name " + alarm.name);
  }
}

chrome.runtime.onMessage.addListener(onMessage);
chrome.runtime.onInstalled.addListener(initConstants);
chrome.alarms.onAlarm.addListener(onAlarm);

/// Local Variables: ///
/// mode: Javascript ///
/// tab-width: 4 ///
/// indent-tabs-mode: nil ///
/// js-indent-level: 2 ///
/// End: ///
