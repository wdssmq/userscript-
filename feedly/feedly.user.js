// ==UserScript==
// @name         Feedly - 中键标记已读 + 收藏导出为*.url
// @description  新标签页打开条目时自动标记为已读
// @version      0.3.2
// @author       沉冰浮水
// @namespace    https://www.wdssmq.com/
// @raw          https://github.com/wdssmq/userscript/raw/master/feedly/feedly.user.js
// @raw          https://greasyfork.org/zh-CN/scripts/381793
// @match        https://feedly.com/*
// @grant        GM_openInTab
// @grant        GM_setClipboard
// ==/UserScript==
/*jshint esversion: 6 */
(function () {
  "use strict";
  function $n(e) {
    return document.querySelector(e);
  }
  function $na(e) {
    return document.querySelectorAll(e);
  }
  function fnMKShell($list) {
    const today = new Date(); //获得当前日期
    const year = today.getFullYear(); //获得年份
    const month = today.getMonth() + 1; //此方法获得的月份是从0---11，所以要加1才是当前月份
    const day = today.getDate(); //获得当前日期
    const arrDate = [year, month, day];
    let strRlt =
      'if [ ! -d "foldername" ]; then\n' +
      "mkdir foldername\n" +
      "fi\n" +
      "cd foldername\n";
    strRlt = strRlt.replace(/foldername/g, "later-" + arrDate.join("-"));
    $list.forEach(function (e, i) {
      // console.log(e);
      let strTitle = `${i}丨`;
      strTitle += e.textContent.replace(/\\|\/|:|\*|!|\?]|<|>/g, "");
      const lenTitle = strTitle.length;
      if (lenTitle >= 155) {
        strTitle = `${i}丨标题过长丨${lenTitle}`;
      }
      let strUrl = e.href;
      strRlt += `\n#${lenTitle}\n`;
      strRlt += 'echo [InternetShortcut] > "' + strTitle + '.url"\n';
      strRlt += 'echo "URL=' + strUrl + '" >> "' + strTitle + '.url"\n';
    });
    strRlt += "exit\n\n";
    strRlt = strRlt.replace(/\/\/\//g, "//www.bilibili.com/");
    //console.log(strRlt);
    return strRlt;
    //$n("body").innerHTML = strRlt.replace(/\n/g, "<br/>");
  }
  function addEvent(element, evnt, funct) {
    if (element.attachEvent) {
      // IE < 9
      return element.attachEvent("on" + evnt, funct);
    } else {
      return element.addEventListener(evnt, funct, false);
    }
  }
  var opt1 = 0;
  addEvent($n("#box"), "mouseup", function (event) {
    if (event.target.className === "title" && event.target.nodeName === "A") {
      var btn = event.target.parentNode.querySelector(".mark-as-read");
      console.log(btn.title === "Mark as read");
      console.log(event.target);
      if (btn.title === "Mark as read") {
        btn.click();
      }
      if (event.button !== 1 && opt1) {
        GM_openInTab(event.target.href, true);
      }
    }
  });
  addEvent($n("#box"), "mouseup", function (event) {
    console.log(event.target);
    if (
      event.target.id === "header-title" &&
      event.target.nodeName === "SPAN"
    ) {
      let intCount = $na("div.content a").length;
      $n("h1 #header-title").innerHTML = `Read later（${intCount}）`;
      GM_setClipboard(fnMKShell($na("div.content a")));
    }
  });
  return;
})();