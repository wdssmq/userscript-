const banner = `
// ==UserScript==
// @name         「xiuno」管理工具（QQ 群：189574683）
// @namespace    沉冰浮水
// @version      1.0
// @description  对不合规的内容加密处理
// @author       沉冰浮水
// @link         https://greasyfork.org/zh-CN/scripts/419517
// @link     ----------------------------
// @link     https://github.com/wdssmq/userscript
// @link     https://afdian.net/@wdssmq
// @link     https://greasyfork.org/zh-CN/users/6865-wdssmq
// @link     ----------------------------
// @match        https://bbs.zblogcn.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/lz-string/1.4.4/lz-string.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/js-yaml/4.1.0/js-yaml.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==
/* jshint esversion:6 */
`.trim();

const name = "xiuno";

export { banner, name };