// Copyright 2013 Daniel Martin
// All Rights Reserved
// This file and others in the same directory may be
// distributed under the file LICENSE found in this
// directory.

define && define("scenariolist", [], function () {
  var scenariolist = {needsInit:1};

  function initConstants() {
    var scenariolist_local = {
      pamshouseblend:[{scenario:'soapbloxScenario1',
                       hrefpat:"^[^/]*//[^/]*/showDiary.do"}],
      escapepod:[{scenario:'wordpressScenario3',
                  hrefpat:"^[^/]*//[^/]*/[0-9].*",
                  xpath:"//ol[contains(concat(' ', @class, ' '),"
                  + " ' commentlist ')]/li[count(div)=1]/div/div"
                  + "/cite[@class='fn']"}],
      ravelry:[{scenario:'wordpressScenario',
                hrefpat:"^[^/]*//blog\.[^/]*/[0-9]"}],
      billcara:[{scenario:'mtScenario2',hrefpat:"^[^/]*//[^/]*/archives/"}],
      // also thanks to http://christina267.wordpress.com
      scalzi:[{scenario:'wordpressScenario',hrefpat:"^[^/]*//[^/]*/whatever"}],
      philliesnation:[{scenario:'wordpressScenario',
                       hrefpat:"^[^/]*//[^/]*/archives/"}],
      feministe:[{scenario:'wordpressScenario',
                  hrefpat:"^[^/]*//[^/]*/blog/archives/"}],
      powweb:[{scenario:'wordpressScenario',
               hrefpat:"^[^/]*//feministe[.][^/]*/blog/archives/"}],
      amptoons:[{scenario:'wordpressScenario',
                 hrefpat:"^[^/]*//[^/]*/blog/archives/"}],
      'the-riotact':[{scenario:'riotactScenario', // wordpress 1.5 ?
                      xpath:"//ol[@id='commentlist']/li[1]//cite"}],
      wordpress:[
        {scenario:'wordpressScenario', // wordpress 1.5 ?
         xpath:"//ol[contains(concat(' ',@class,' '),' commentlist ')]"
         + "/li[1]/descendant::*[self::cite or self::span][1][self::cite]"
        },
        {scenario:'wordpressScenario2',
         xpath:"//ol[@id='commentlist']/li[1]/span[@class='commentauthor']"},
        {scenario:'wordpressScenario3',
         xpath:"//ol[contains(concat(' ', @class, ' '), ' commentlist ')]/"
         + "li[count(div)=1]/div/div/cite[@class='fn']"},
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
         xpath: "//div[starts-with(@id,'ljcmt') and "
         + "descendant::span[contains(concat(' ',@class,' '),' ljuser ')]]",
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
        {scenario:'giveemhellharryScenario2',
         hrefpat:"^[^/]*//[^/]*/page/community/",
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
      smalldeadanimals:[{scenario:'mtScenario1',
                         hrefpat:"^[^/]*//[^/]*/\\w*/[0-9]",}],
      freerepublic:[{scenario:'freeperScenario',
                     hrefpat:"^[^/]*//[^/]*/focus/f-(news|chat)/[0-9]*/(replies|posts)",}],
      nytimes:[{scenario:'nytimesBlogsScenario',
                hrefpat:"^[^/]*//[^/]*\\.blogs\\.[^/]*/([0-9]*/){3}[\\w-]+/",}],
      villagevoice:[{scenario:'voiceScenario',
                     hrefpat:"^[^/]*//[^/]*/news/[0-9]",}],
      fetlife:[{scenario:'fetScenario',
                hrefpat:"[^/]*//[^/]*/groups/[0-9]*/group_posts/"}],
      escapeartists:[{scenario:'smForum1',
                      hrefpat:"[^/]*//forum\\..*",
                      xpath:'//a[@name="lastPost"]'}],
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

    for (key in scenariolist_local) {
      if (scenariolist_local.hasOwnProperty(key)) {
        scenariolist[key] = scenariolist_local[key];
      }
    }
  }

  function findScenarios(origurl) {
    if (scenariolist.needsInit) {
      initConstants();
      scenariolist.needsInit = 0;
    }
    var url = origurl.replace(/#.*/, '');
    var hostre = /^([a-z0-9]+):\/\/([^\/]*)(\/.*|$)/;
    var hostrematch = hostre.exec(url);
    if (hostrematch) {
      var host = hostrematch[2];
      var domain = host.replace(
          /^(?:.*[.])?((?!www\.)[a-zA-Z0-9-]+)(?:\.\w{3}|(?:\.\w{2})+)$/, '$1');
      var matchl = scenariolist[domain];
      var re;
      if (matchl) {
        var matchind;
        retval = [];
        for (matchind=0; matchind < matchl.length; matchind++) {
          var match = matchl[matchind];
          if (match.hrefpat) {
            re = new RegExp(match.hrefpat);
            if (!re.test(url)) {
              continue;
            }
          }
          retval.push(match);
        }
        return retval;
      } else {
        console.log("Nothing for domain " + domain + " from url " + url);
      }
    }
    return [];
  }

  return {scenariolist: scenariolist, findScenarios: findScenarios};
});

/// Local Variables: ///
/// mode: Javascript ///
/// tab-width: 4 ///
/// indent-tabs-mode: nil ///
/// js-indent-level: 2 ///
/// End: ///
