// Copyright 2013 Daniel Martin
// All Rights Reserved
// This file and others in the same directory may be
// distributed under the file LICENSE found in this
// directory.

function showComment(spot) {
  spot.classList.remove("dtm_killfile_commentholder_hidecomment");
  spot.classList.add("dtm_killfile_commentholder_showcomment");
}
function hideComment(spot) {
  spot.classList.remove("dtm_killfile_commentholder_showcomment");
  spot.classList.add("dtm_killfile_commentholder_hidecomment");
}

function escapeHTML(s) {
  var div = document.createElement('div');
  var text = document.createTextNode(s);
  div.appendChild(text);
  return div.innerHTML;
}

function reviewContent() {
  var snap = document.getElementsByClassName("dtm_killfile_commentholder");
  for (var i=0; i < snap.length; i++) {
    var spot = snap[i];
    var potentialTroll = spot.getAttribute("dtm_killfile_user");
    // Javascript scoping rules suck
    (function(spot2) {
      chrome.runtime.sendMessage(
	{type:'trollCheck', troll:potentialTroll},
	function (response) {
	  if (response.isTroll) {
	    hideComment(spot2);
	  } else {
	    showComment(spot2);
	  }
	});
    })(spot);
  }
}

function addTroll(troll) {
  chrome.runtime.sendMessage(
    {type:'trollAdd', troll:troll},
    reviewContent);
}

function delTroll(troll) {
  chrome.runtime.sendMessage(
    {type:'trollDel', troll:troll},
    reviewContent);
}

function handleClick(evt) {
  var holderdiv = this;
  var evtar = evt.target;
  var clazz = evtar.getAttribute('class');
  if (clazz) {
      if (clazz == "dtm_killfile_show") {
        evt.stopPropagation();
        evt.preventDefault();
        showComment(holderdiv);
      } else if (clazz == "dtm_killfile_hide") {
        evt.stopPropagation();
        evt.preventDefault();
        hideComment(holderdiv);
      } else if (clazz == "dtm_killfile_kill") {
        evt.stopPropagation();
        evt.preventDefault();
        addTroll(holderdiv.getAttribute('dtm_killfile_user'));
      } else if (clazz == "dtm_killfile_unkill") {
        evt.stopPropagation();
        evt.preventDefault();
        delTroll(holderdiv.getAttribute('dtm_killfile_user'));
      }
  }
}

var kf_debug = true;

function progresslog(logstr) {
  if (kf_debug) {console.log(logstr);}
}

var killfileScenario = {};

// the basic scenario is essentially wordpress-like, so the
// wordpress scenarios below are pretty short
killfileScenario['basicScenario'] = function() {
  return {
    commenttopxpath: "//ol[contains(concat(' ',@class,' '),' commentlist ')]/li",
    sigbit: ".//cite[1]",
    replaceXpath: "child::node()",
    mangleBefore: null,
    mangleAppend: null,
    tabXpath: null,
    precedingBit: '',
    followingBit: '',
    sigUserMatch: '$2',
    sigHrefMatch: '$1',
    aHrefAttribute: 'href', // sometimes title
    inHrefBit: '',
    get sigpat() {
      var s = ('^ *' + this.precedingBit + 
               ' *(?:<a [^>]*?(?:\\b(?:' + this.aHrefAttribute + 
               ') *="([^>"]*)")?[^>]*>)?' + this.inHrefBit +
	       '(\\S[^<]*[^ <]|[^ <]) *(?:</a>)? *' + 
               this.followingBit + '.*');
      return new RegExp(s,"");
    },
    foreachComment:
    function(loopBody) {
      if (!loopBody) {return null;}
      var snap = document.evaluate(this.commenttopxpath,
                                   document, null, 
                                   XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
      for (var i=0; i < snap.snapshotLength; i++) {
        loopBody(snap.snapshotItem(i));
      }
    },
    getUserspec:
    function(commentNode) {
      if (!commentNode) {return null;}
      var sigsnap = document.evaluate(this.sigbit, commentNode, null,
                                      XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      var nd = sigsnap.singleNodeValue;
      if (nd == null) {progresslog("xpath " + this.sigbit + " gave null: " + commentNode);return null;}
      var sigHTML = nd.innerHTML;
      if (!sigHTML) {sigHTML = nd.textContent;}
      else {sigHTML = sigHTML.replace(/\&nbsp;/g, ' ');}
      sigHTML = sigHTML.replace(/\s+/g, ' ');
      sigHTML = sigHTML.replace(/\s+$/, '');
      sigHTML = sigHTML.replace(/^\s+/, '');
      // in case people match on attribute tags
      var sigre = this.sigpat;
      if (! sigre.test(sigHTML)) {
        progresslog("Didn't match: html " + JSON.stringify(sigHTML) + " and regexp " + sigre);
        return null;
      }
      var user = sigHTML.replace(sigre,this.sigUserMatch);
      var href = sigHTML.replace(sigre,this.sigHrefMatch);
      progresslog("user: html {" + JSON.stringify(sigHTML) + "} and regexp {" + sigre + "} gave " + escape(user) + "!" + escape(href));
      return [user, escape(user) + "!" + escape(href)];
    },
    divHTML:
    '<div class="dtm_killfile_shown"></div>' +
      '<div class="dtm_killfile_hidden"><p>Comment by __SHORTUSER__ blocked.' +
      ' <span class="dtm_killfile_select">[<a href="tag:remove%20user%20from%20killfile" class="dtm_killfile_unkill">unkill</a>]' +
      '&#8203;[<a href="tag:show%20comment" class="dtm_killfile_show">show&nbsp;comment</a>]' +
      '</span></p></div>',
    divHTMLuser:
    function(user, userspec) {
      return this.divHTML.replace(/__SHORTUSER__/g,escapeHTML(user))
	.replace(/__USER__/g,escapeHTML(userspec));
    },
    getEmptyHolder:
    function(commentNode, user, userspec) {
      var ddiv = document.createElement('div');
      ddiv.innerHTML = this.divHTMLuser(user, userspec);
      if (this.tabXpath) {
        var tabNode = document.evaluate(this.tabXpath, commentNode, null,
                                        XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        tabNode = tabNode.singleNodeValue;
        if (tabNode) {
          var tabtarget = ddiv.childNodes[1].childNodes[0];
          tabtarget.insertBefore(tabNode.cloneNode(true),tabtarget.firstChild);
        }
      }
      ddiv.setAttribute("class", "dtm_killfile_commentholder dtm_killfile_commentholder_showcomment");
      ddiv.setAttribute("dtm_killfile_user", userspec);
      return ddiv;
    },
    spanHTML: ' [<a href="tag:killfile%20user" class="dtm_killfile_kill">kill</a>]' +
      '&#8203;[<a href="tag:hide%20comment" class="dtm_killfile_hide">hide&nbsp;comment</a>]',
    spanHTMLuser:
    function(user, userspec) {
      return this.spanHTML.replace(/__SHORTUSER__/g,escapeHTML(user))
	.replace(/__USER__/g,escapeHTML(userspec));
    },
    mangleCommentContent:
    function(contentNode, user, userspec) {
      if (!contentNode) {return null;}
      var snap3 = null;
      var useBefore = true;
      if (this.mangleBefore) {
        snap3 = document.evaluate(this.mangleBefore, contentNode, null,
                                  XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      } else if (this.mangleAppend) {
        snap3 = document.evaluate(this.mangleAppend, contentNode, null,
                                  XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        useBefore = false;
      }
      if (snap3 && snap3.singleNodeValue) {
        var target = snap3.singleNodeValue;
        var cspan = document.createElement('span');
        cspan.innerHTML = this.spanHTMLuser(user, userspec);
	cspan.className = "dtm_killfile_select";
        if (useBefore) {
          target.parentNode.insertBefore(cspan,target);
        } else {
          target.appendChild(cspan);
        }
        return contentNode;
      }
      progresslog("Can't find insertion point for kill button");
      progresslog(contentNode);
      progresslog(contentNode.childNodes[0]);
      return null;
    },
    insertCommentHolder:
    function(commentNode, holderDiv) {
      if (! (commentNode && holderDiv)) {return null;}
      var snap2 = document.evaluate(
	this.replaceXpath, commentNode, null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
      if (snap2.snapshotLength == 0) {return null;}
      var commentContents = [];
      var canUseExistingNodes = true;
      for (var j=0; j < snap2.snapshotLength; j++) {
        var node = snap2.snapshotItem(j);
        commentContents.push(node);
	if (canUseExistingNodes) {
	  if (node.nodeType == 3) {
	    if (/\S/.test(node.nodeValue)) {
	      canUseExistingNodes = false;
	    } else {
	      var rng = document.createRange();
	      rng.selectNodeContents(node);
	      var bnd = rng.getBoundingClientRect();
	      if (bnd.height || bnd.width) {
		canUseExistingNodes = false;
	      }
	    }
	  } else if (node.parentNode !== commentNode) {
	    canUseExistingNodes = false;
	  }
	}
      }
      
      var contentNode;
      if (canUseExistingNodes) {
	var hNode = holderDiv.firstElementChild.nextElementSibling;
	contentNode = commentNode;
	commentNode.classList.add("dtm_killfile_commentholder");
	commentNode.classList.add("dtm_killfile_commentholder_showcomment");
	commentNode.appendChild(hNode);
      } else {
	commentContents[0].parentNode.insertBefore(
	  holderDiv, commentContents[0]);
	contentNode = holderDiv.firstChild;
	holderDiv.addEventListener('click', handleClick, true);
	for (j=0; j < commentContents.length; j++) {
	  contentNode.appendChild(commentContents[j]);
	}
      }
      return contentNode;
    },
    handleComment:
    function(commentNode) {
      progresslog("Comment found " + location.href);
      var us = this.getUserspec(commentNode);
      if (! us) {progresslog("Can't find user");return null;}
      var commentTwo = this.mangleCommentContent(commentNode, us[0], us[1]);
      if (!commentTwo) {progresslog("No kill button"); return null;}
      var ddiv = this.getEmptyHolder(commentTwo, us[0], us[1]);
      if (! ddiv) {progresslog("Can't get empty holder");return null;}
      var contentdiv = this.insertCommentHolder(commentTwo, ddiv);
      if (! contentdiv) {progresslog("Can't insert comment holder");return null;}
    },
    manglePage:
    function () {
      var me = this;
      this.foreachComment(function (c) {me.handleComment(c)});
    }
  };
}


killfileScenario['wordpressScenario'] = function() {
  return {
    get mangleBefore() {return this.sigbit + '/following::*'},
    __proto__:killfileScenario.basicScenario()
  };
}

// Thanks to Christina Schelin, http://christina267.wordpress.com
killfileScenario['wordpressScenario2'] = function() {
  return {
    commenttopxpath: "//ol[@id='commentlist']/li",
    sigbit: "span[@class='commentauthor']",
    __proto__:killfileScenario.wordpressScenario()
  };
}

killfileScenario['riotactScenario'] = function() {
  return {
    get mangleAppend() {return this.sigbit + '/..'},
    precedingBit: 'Comment by ',
    followingBit: ' [-\u2014] ',
    commenttopxpath: "//ol[@id='commentlist']/li",
    __proto__:killfileScenario.basicScenario()
  };
}

killfileScenario['pandagonNewScenario'] = function() {
  return {
    commenttopxpath: "//div[@id='content']/div[starts-with(@class,'comment-body')]",
    sigbit: "div[@class='comment-posted']",
    precedingBit: 'Comment #\\d*: ',
    followingBit: ' on \\S+ at <a',
    mangleAppend: "div[@class='comment-posted']",
    __proto__:killfileScenario.basicScenario()
  };
}

killfileScenario['feministingNewScenario'] = function() {
  return {
    commenttopxpath: "//div[@id='comments']//" + 
      "div[contains(concat(' ', @class, ' '), ' comment ')]/" +
      "div[contains(concat(' ', @class, ' '), ' inner ')]",
    sigbit: ".//div[contains(concat(' ', @class, ' '), ' commentByline ')]/" +
      "span[contains(concat(' ', @class, ' '), ' author ')]",
    precedingBit: '',
    followingBit: '',
    get mangleAppend() {return this.sigbit + '/..'},
    __proto__:killfileScenario.basicScenario()
  };
}

killfileScenario['feministingNewFrontPageScenario'] = function() {
  return {
    commenttopxpath: "//div[@class='mainPadding']/div[@class='entryBody']",
    replaceXpath: ".|preceding-sibling::div[1][@class='entryTitle']",
    sigbit: "div[@class='posted']",
    precedingBit: 'Posted by ',
    followingBit: ' at <a[^<>]*>[^<>]*</a> \\| in.*',
    mangleAppend: "div[@class='posted']",
    __proto__:killfileScenario.basicScenario()
  };
}

killfileScenario['pandagonScenario'] = function() {
  return {
    sigbit: "span[@class='commentauthor']",
    __proto__:killfileScenario.wordpressScenario()
  };
}

killfileScenario['pandagon2Scenario'] = function() {
  return {
    commenttopxpath: "//ol[@id='commentlist']/li",
    sigbit: "child::*[@class='commentauthor']",
    __proto__:killfileScenario.wordpressScenario()
  };
}

// thanks to Christina Schelin, http://christina267.wordpress.com/
killfileScenario['voiceScenario'] = function() {
  return {
    commenttopxpath: "//div[@id='commentsList']/div",
    sigbit: "div[@class='comments_info']/b",
    __proto__:killfileScenario.wordpressScenario()
  };
}

killfileScenario['livejournalScenario'] = function() {
  return {
    inHrefBit: "(?:<b>)?",
    commenttopxpath: "//table[starts-with(@id,'ljcmt') and .//span[contains(concat(' ',@class,' '),' ljuser ')]]",
    sigbit: "descendant::span[contains(concat(' ',@class,' '),' ljuser ')][1]",
    replaceXpath: ".",
    get mangleBefore() {return this.sigbit + "/following::*[1]";},
    tabXpath: 'descendant::img[1]',
    precedingBit: '(?:.*?</a>)?',
    __proto__:killfileScenario.basicScenario()
  };
}

killfileScenario['livejournalScenario_1a'] = function() {
  return {
    commenttopxpath: "//span[starts-with(@id,'ljcmt') and ./table[position() = 1 and @class='talk-comment']]",
    __proto__:killfileScenario.livejournalScenario()
  };
}

killfileScenario['livejournalScenario2'] = function() {
  return {
    commenttopxpath: "//div[@class='comment_wrapper']",
    sigbit: ".//div[@class='comment_postedby']/*[1]",
    tabXpath: '',
    __proto__:killfileScenario.livejournalScenario()
  };
}

killfileScenario['livejournalScenario3'] = function() {
  return {
    commenttopxpath: "//div[starts-with(@id,'ljcmt') and child::div[@class='entry']]",
    replaceXpath: "./h3|./div[@class='entry']|./div[@class='talklinks']",
    tabXpath: '',
    __proto__:killfileScenario.livejournalScenario()
  };
}

killfileScenario['livejournalScenario4'] = function() {
  return {
    commenttopxpath: "//div[starts-with(@id,'ljcmt')]",
    replaceXpath: "child::node()",
    tabXpath: '',
    get mangleAppend() {return this.sigbit + "/parent::node()";},
    mangleBefore: null,
    __proto__:killfileScenario.livejournalScenario()
  };
}

killfileScenario['livejournalScenario5'] = function() {
  return {
    commenttopxpath: "//td[@id='content']//table[@class='heading_bar']/following-sibling::div",
    __proto__:killfileScenario.livejournalScenario4()
  };
}
killfileScenario['livejournalScenario6'] = function() {
  return {
    commenttopxpath: "//table[@class='entrybox'][2]/tbody/tr/td/table/tbody/tr/td/div",
    __proto__:killfileScenario.livejournalScenario5()
  };
}

killfileScenario['livejournalScenario7'] = function() {
  return {
    inHrefBit: "(?:<b>)?",
    commenttopxpath: "//div[@id='comments']//div[contains(concat(' ', @class, ' '), ' b-leaf ')]",
    sigbit: "descendant::*[contains(concat(' ',@class,' '),' b-leaf-username ')][1]",
    replaceXpath: "./div[1]",
    get mangleAppend() {return this.sigbit + "/parent::node()";},
    precedingBit: '<span class="b-leaf-username-name">(?:<span[^>]*lj:user[^>]*>.*?</a>)?',
    __proto__:killfileScenario.basicScenario()
  };
}

killfileScenario['livejournalScenario8'] = function() {
  return {
    inHrefBit: "(?:<b>)?",
    commenttopxpath: "//div[@id='comments']//div[contains(concat(' ', @class, ' '), ' comment ')]",
    sigbit: "descendant::*[contains(concat(' ',@class,' '),' comment-poster ')][1]",
    replaceXpath: "./div[1]",
    get mangleAppend() {return this.sigbit;},
    precedingBit: '(?:<span class="[^"]*text[^"]*">[^<>]*</span>)? *(?:<span[^>]*lj:user[^>]*>.*?</a>)?',
    __proto__:killfileScenario.basicScenario()
  };
}

killfileScenario['ljfriendsScenario'] = function() {
  // If you want this, see the comments in "scenariolist" below
  return {
    commenttopxpath: "//table[not(ancestor::table) and " + 
      "(preceding::a[starts-with(@href,'http://www.livejournal.com/userinfo.bml?')]) " +
      "and (descendant::a[substring-after(@href,'.livejournal.com/')=''])]",
    sigbit: "descendant::a[contains(@href,'livejournal.com/') and " +
      "substring-after(@href,'livejournal.com/')=''][1]/@href",
    replaceXpath: ".",
    sigpat: /(http:\/\/(\w+)\..*)/,
    sigUserMatch: '$2',
    sigHrefMatch: '$1',
    mangleAppend: "descendant::a[contains(@href,'livejournal.com/') and " +
      "substring-after(@href,'livejournal.com/')=''][1]/..",
    spanHTML: '<br>[<a href="tag:killfile%20user" class="dtm_killfile_kill">kill</a>]' +
      '&#8203;[<a href="tag:hide%20comment" class="dtm_killfile_hide">hide&nbsp;comment</a>]',
    __proto__:killfileScenario.basicScenario()
  };
}

killfileScenario['pandasThumbScenario'] = function() {
  return {
    commenttopxpath: "//div[@id='comment-panels']//div[contains(concat(' ', @class, ' '), ' comment ') and not(boolean(.//p[@id='comment-update-message']))]",
    sigbit: ".//div[contains(concat(' ', @class, ' '), ' comment-header ')]//span[contains(concat(' ', @class, ' '), ' author ')]",
    precedingBit: '',
    followingBit: '',
    aHrefAttribute: 'title',
    mangleBefore: ".//span[contains(concat(' ', @class, ' '), ' byline ')]",
    __proto__:killfileScenario.basicScenario()
  };
}

killfileScenario['blogspotDLScenario'] = function() {
  return {
    commenttopxpath: "//dl[@id='comments-block']/dt",
    sigbit: ".",
    precedingBit: '(?: *<div class="profile-image-container">.*?</div>)? *',
    followingBit: '\\b *said\\W+',
    mangleAppend: ".",
    replaceXpath: ".|following-sibling::dd[1]",
    __proto__:killfileScenario.basicScenario()
  };
}

killfileScenario['blogspotDivScenario'] = function() {
  return {
    commenttopxpath: "//div[@class='blogComments']/div[@class='blogComment']",
    sigbit: "div[@class='byline']",
    sigUserMatch: '$2$3',
    sigpat: /^ *<a[^>]*>#<\/a> posted by (?:<span[^>]*comment-icon[^>]*>.*?<\/span>)? *(?:(?:<a [^>]*?(?:\b(?:href) *="([^>"]*)")?[^>]*>)?(\S[^<]*[^ <]|[^ <]) *(?:<\/a>)?|<span class=['"]anon[^>]*>([^<]*)<\/span>) +: +[^a-zA-Z]+[AP]M[^a-zA-Z]*$/,
    mangleAppend: "div[@class='byline']",
    __proto__:killfileScenario.basicScenario()
  };
}

killfileScenario['blogspotTableScenario'] = function() {
  return {
    commenttopxpath: "//table[@class='MainTable']//td[@class='MessageCell']/P",
    sigbit: "*[@class='byline']",
    sigUserMatch: '$1',
    sigHrefMatch: '$2',
    sigpat: /^ *(\S[^|]*[^<>]*?\S|\S) *\| *(?:<a href="([^\"]*)"[^>]*>\S+<\/a> *\|)?[^|]*\|[^|]*$/,
    mangleAppend: "*[@class='byline'][last()]",
    __proto__:killfileScenario.basicScenario()
  };
}


killfileScenario['scienceblogsScenario'] = function() {
  return {
    commenttopxpath: "//div[@id='comments']//div[starts-with(@id,'comment-')]",
    sigbit: "div[@class='header']",
    sigUserMatch: '$1',
    sigHrefMatch: '$2',
    sigpat: /^.*?<\/span> *<span class="fn">(.*?)<\/span> *<img [^>]*src="([^"?]*)["?].*$/,
    mangleAppend: "div[@class='header']",
    __proto__:killfileScenario.basicScenario()
  };
}

killfileScenario['freethoughtblogsScenario'] = function() {
  return {
    commenttopxpath: "//ol[@id='comments_list']/li/div[contains(concat(' ',@class,' '),' comment-wrap ')]",
    sigbit: ".",
    sigUserMatch: '$2',
    sigHrefMatch: '$1',
    sigpat: /^.*<div class="comment-avatar-wrap"> *<img [^>]*src="([^"?]*)["?][^>]*>.*?class="comment-author"> *<cite> *<a [^>]*>([^<]*)<\/a>.*/,
    mangleAppend: ".//cite[1]",
    __proto__:killfileScenario.basicScenario()
  };
}


killfileScenario['mtScenario2'] = function() {
  return {
    commenttopxpath: "//div[@class='content']/div[@class='othercomment']",
    sigbit: "p[@class='posted']",
    followingBit: '(?:<a [^>]*><img [^>]*><\\/a>)? +at +[^\\]]*\\[link\\][^\\]]*$',
    mangleAppend: "p[@class='posted']",
    __proto__:killfileScenario.pharyngulaScenario()
  };
}

killfileScenario['typepadScenario'] = function() {
  return {
    commenttopxpath: "//div[@class='comments-content']/div[contains(concat(' ',@class,' '),' comment ')]",
    sigbit: "p[@class='comment-footer']",
    mangleAppend: "p[@class='comment-footer']",
    __proto__:killfileScenario.pharyngulaScenario()
  };
}

killfileScenario['haloscanScenario'] = function() {
  return {
    commenttopxpath: "//table[@class='MainTable']//td[@class='MessageCell']",
    sigbit: "descendant::span[@class='byline']",
    mangleAppend: "descendant::span[@class='byline']",
    mangleBefore: null,
    replaceXpath: "child::node()[position() > 2 and position() < last()]",
    sigUserMatch: '$1',
    sigHrefMatch: '$2',
    sigpat: /^ *(\S[^|]*.*?\S|\S) *\| *(?:<a href="([^\"]*)"[^>]*>Homepage<\/a> *\|)?[^|]*\|[^|]*$/,
    __proto__:killfileScenario.basicScenario()
  };
}

killfileScenario['giveemhellharryScenario1'] = function() {
  return {
    commenttopxpath: "//h3[@id='comment']/following-sibling::ol[1]/li",
    sigbit: "small[last()]",
    followingBit: ' \\w+ +\\d+,[^,]*<a',
    mangleAppend: "small[last()]",
    precedingBit: '[^<]*',
    __proto__:killfileScenario.basicScenario()
  }
}

killfileScenario['giveemhellharryScenario2'] = function() {
  return {
    commenttopxpath: "//div[@class='comments']//div[@class='comment']",
    sigbit: "div[@class='commentauthor']",
    replaceXpath: "div[@class='commenttitle' or @class='commenttext' or @class='commentauthor']",
    mangleAppend: "div[@class='commentauthor']",
    precedingBit: ' *[Bb][Yy] *',
    __proto__:killfileScenario.basicScenario()
  }
}

killfileScenario['soapbloxScenario1'] = function() {
  return {
    commenttopxpath: "//form[@name='rateForm']/a[@name != 'p0' and starts-with(@name,'p')]/following-sibling::div[1][starts-with(@class,'commentLevel')]",
    sigbit: "div[last()-1]",
    mangleAppend: "div[last()]",
    precedingBit: '<i>by: *',
    followingBit: ' @[^@]*',
    __proto__:killfileScenario.basicScenario()
  }
}

killfileScenario['truthoutScenario'] = function() {
  return {
    commenttopxpath: "//div[@class='commenthead']",
    replaceXpath: ".|following-sibling::div[1]",
    sigbit: "following-sibling::div[1]//a[starts-with(@href,'/blog/user/')][last()]",
    mangleBefore: ".//br[last()]",
    __proto__:killfileScenario.basicScenario()
  };
}

killfileScenario['athleticsNationScenario'] = function() {
  return {
    delayed: true,
    commenttopxpath: "//div[@class='cx' and .//p[@class='cl']]",
    sigbit: ".//p[@class='cb']/a[1]",
    replaceXpath: ".",
    mangleAppend: ".//p[@class='cl']",
    __proto__:killfileScenario.basicScenario()
  };
}
killfileScenario['athleticsNationScenario2'] = function() {
  return {
    commenttopxpath: "//div[starts-with(@id,'comment_item_')]/div[starts-with(@id,'comment_inner_')]",
    sigbit: "./p[@class='byline' or @class='by']/a[1]",
    mangleAppend: "./p[@class='byline' or @class='by']",
    __proto__:killfileScenario.athleticsNationScenario()
  };
}
killfileScenario['athleticsNationOldScenario'] = function() {
  return {
    commenttopxpath: "//a[@name='commenttop'][1]/following-sibling::form//table",
    sigbit: "./tbody/tr[last()]//a[1]",
    replaceXpath: ".",
    mangleBefore: "descendant::br[last()]",
    __proto__:killfileScenario.basicScenario()
  };
}

killfileScenario['tnrScenario'] = function() {
  return {
    commenttopxpath: "//div[@class='discuss-header']",
    replaceXpath: ".|following-sibling::div[1]",
    sigbit: "b[1]",
    mangleAppend: ".",
    __proto__:killfileScenario.basicScenario()
  };
}

// One of the many Moveable Type templates
killfileScenario['mtScenario1'] = function() {
  return {
    commenttopxpath: "//div[@class='comments-body']",
    sigbit: "span[@class='comments-post']",
    precedingBit: 'Posted by:',
    followingBit: 'at <a [^>]*>[^<>]*</a> *$',
    mangleAppend: "span[@class='comments-post']",
    __proto__:killfileScenario.basicScenario()
  };
}

killfileScenario['freeperScenario'] = function() {
  return {
    commenttopxpath: "//div[@class='b2'][1]/following-sibling::div[@class='n2']",
    sigbit: "preceding-sibling::*[@class='a2'][1]",
    replaceXpath: ".|preceding-sibling::node()[position() < 7][self::div or self::text()]",
    precedingBit: '<a .*</a> posted on <b>.*?</b> by',
    followingBit: '',
    mangleAppend: ".",
    __proto__:killfileScenario.basicScenario()
  };
}

killfileScenario['nytimesBlogsScenario'] = function() {
  return {
    commenttopxpath: "//ul[@class='commentlist']/li",
    sigbit: ".//p[last()]/cite",
    replaceXpath: ".",
    precedingBit: '\\W* Posted by ',
    followingBit: '',
    mangleAppend: ".//p[last()]",
    __proto__:killfileScenario.basicScenario()
  };
}

// fetlife.com
// Added thanks to xtina@twilite.org
killfileScenario['fetScenario'] = function() {
  return {
    commenttopxpath: "//div[contains(@class,'group_comment')]",
    sigbit: "./*[contains(@class,'span-14')]/div[@class='quiet']",
    precedingBit: '<a href="/users/[0-9]*">',
    followingBit: '</a> responded .*',
    __proto__:killfileScenario.wordpressScenario()
  };
}

// disqus....
killfileScenario['disqusScenario1'] = function() {
  return {
    manglePage: function () {
      var me = this;
      // ___ YOU WERE HERE ___
    },
    __proto__:killfileScenario.basicScenario()
  };
}

function initScenario(scenario) {
  killfileScenario[scenario]().manglePage();
  reviewContent();
}
