// ==UserScript==
// @name         「水水」链接跳转
// @namespace    https://www.wdssmq.com/
// @version      1.0.0
// @author       沉冰浮水
// @description  跳转到正确的链接
// @license      MIT
// @null         ----------------------------
// @contributionURL    https://github.com/wdssmq#%E4%BA%8C%E7%BB%B4%E7%A0%81
// @contributionAmount 5.93
// @null         ----------------------------
// @link         https://github.com/wdssmq/userscript
// @link         https://afdian.net/@wdssmq
// @link         https://greasyfork.org/zh-CN/users/6865-wdssmq
// @null         ----------------------------
// @noframes
// @run-at       document-end
// @match        https://jump.bdimg.com/f*
// @match        https://jump2.bdimg.com/f*
// @match        http://jump.bdimg.com/safecheck/index?url=*
// @match        http://jump2.bdimg.com/safecheck/index?url=*
// @match        https://tieba.baidu.com/safecheck/index?url=*
// @match        https://c.pc.qq.com/middlem.html?pfurl=*
// @match        https://mail.qq.com/cgi-bin/readtemplate?t=*
// @match        https://www.jianshu.com/go-wild*
// @match        https://www.v2ex.com/t/*
// @match        https://link.zhihu.com/*
// @grant        none
// ==/UserScript==

/* eslint-disable */
/* jshint esversion: 6 */

(function () {
  'use strict';

  // 初始常量或函数
  const curUrl = window.location.href;
  const curHost = window.location.host;

  // -------------------------------------

  // const $ = window.$ || unsafeWindow.$;
  function $n(e) {
    return document.querySelector(e);
  }
  function $na(e) {
    return document.querySelectorAll(e);
  }

  // 指定元素内查找子元素
  function fnFindDom(el, selector) {
    return el.querySelectorAll(selector);
  }

  // 从页面中获取链接
  function fnGetUrlInDOM(selector, attrName) {
    const $dom = $n(selector);
    if ($dom) {
      return $dom[attrName];
    }
    return null;
  }

  // 获取链接中的参数
  function fnGetParamInUrl(name, url) {
    const match = RegExp("[?&]" + name + "=(?<value>[^&]*)").exec(url);
    return match && decodeURIComponent(match.groups.value);
  }

  // 监测网址是否带有协议
  function fnCheckUrl(url) {
    if (url.indexOf("http") === 0) {
      return url;
    }
    return "http://" + url;
  }

  const siteList = [
    {
      name: "百度贴吧",
      hostList: ["jump2.bdimg.com", "tieba.baidu.com"],
      url: fnGetUrlInDOM("p.link", "textContent"),
    },
    {
      name: "QQ 客户端",
      hostList: ["c.pc.qq.com"],
      url: fnGetUrlInDOM("#url", "textContent"),
      tipNode: [$n("p.ui-title"), "after"]
    },
    {
      name: "QQ 邮箱",
      hostList: ["mail.qq.com"],
      url: fnGetUrlInDOM(".safety-url", "textContent"),
      tipNode: [$n(".safety-url"), "after"]
    },
    {
      name: "简书",
      hostList: ["www.jianshu.com"],
      url: fnGetParamInUrl("url", curUrl),
    }, {
      name: "知乎",
      hostList: ["link.zhihu.com"],
      url: fnGetUrlInDOM("p.link", "textContent"),
    },
  ];

  // 显示提示
  function fnShowTip(tipNode, text, url) {
    console.log(text);
    const $node = tipNode[0];
    const $insertTips = `<p class="go-tips" style="color: red;">
  <span>${text}</span>
  <a href="${url}" title="点击跳转">点击跳转</a>
  </p>`;
    const $tips = $n(".go-tips");
    // 判断是否已经有提示
    if ($tips) {
      $tips.querySelector("span").textContent = text;
      return;
    }
    switch (tipNode[1]) {
      default:
      case "after":
        $node.insertAdjacentHTML("afterend", $insertTips);
        break;
    }
  }

  // 各种中转页跳过
  siteList.forEach((site) => {
    const { name, hostList, url } = site;
    if (hostList.includes(curHost)) {
      if (!url) {
        return;
      }
      const newUrl = fnCheckUrl(url);
      if (site.tipNode) {
        let cntDown = 5;
        setInterval(() => {
          if (cntDown <= 0) {
            window.location.href = newUrl;
            return;
          }
          fnShowTip(site.tipNode, `即将跳转到，剩余 ${cntDown} 秒`, newUrl);
          cntDown--;
        }, 1000);
      } else {
        window.location.href = newUrl;
      }
    }
  });

  // 百度贴吧的各种链接统一
  const arrHostList = [
    "jump.bdimg.com",
    "jump2.bdimg.com",
  ];

  if (arrHostList.includes(curHost)) {
    const newUrl = window.location.href.replace(curHost, "tieba.baidu.com");
    window.location.href = newUrl;
  }

  // 指定元素中的链接增加 target="_blank"
  const config = [
      [".markdown_body", ".reply_content"],
  ];

  const fnSetBlank = ($a) => {
      $a.setAttribute("target", "_blank");
  };

  config.forEach((e) => {
      const selector = e.join(",");
      const $$container = $na(selector);
      // // print $$container
      // _log($$container);
      // 遍历 $$container
      [].forEach.call($$container, ($el) => {
          const $$a = fnFindDom($el, "a");
          // _log($$a);
          if ($$a.length > 0) {
              [].map.call($$a, fnSetBlank);
          }
      });
  });

})();
