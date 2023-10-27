// ==UserScript==
// @name         「水水」自用贴吧辅助
// @namespace    https://www.wdssmq.com/
// @version      1.0.2
// @author       沉冰浮水
// @description  置百丈玄冰而崩裂，掷须臾池水而漂摇。
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
// @run-at       document-start
// @match        https://tieba.baidu.com
// @match        https://tieba.baidu.com/index.html
// @match        https://tieba.baidu.com/i/i/forum*
// @grant        GM_addStyle
// ==/UserScript==

/* eslint-disable */
/* jshint esversion: 6 */

if (unsafeWindow.console) {
  unsafeWindow.console.firebug = true;
} else {
  console.firebug = true;
}

(function () {
  'use strict';

  const gm_name = "tieba";

  // -------------------------------------

  const _log = (...args) => console.log(`[${gm_name}] |`, ...args);
  const _warn = (...args) => console.warn(`[${gm_name}] |`, ...args);

  // -------------------------------------

  // const $ = window.$ || unsafeWindow.$;
  function $n(e) {
    return document.querySelector(e);
  }

  // -------------------------------------

  // 添加内容到指定元素后面
  function fnAfter(newEl, el) {
    el = typeof el === "string" ? $n(el) : el;
    el.parentNode.insertBefore(newEl, el.nextSibling);
  }

  // 指定元素内查找子元素
  function fnFindDom(el, selector) {
    el = typeof el === "string" ? $n(el) : el;
    const queryList = el.querySelectorAll(selector);
    if (queryList.length === 1) {
      return queryList[0];
    }
    return queryList.length > 1 ? queryList : null;
  }

  // -------------------------------------

  // 元素变化监听
  const fnElChange = (el, fn = () => { }) => {
    const observer = new MutationObserver((mutationRecord, mutationObserver) => {
      // _log('mutationRecord = ', mutationRecord);
      // _log('mutationObserver === observer', mutationObserver === observer);
      fn(mutationRecord, mutationObserver);
      // mutationObserver.disconnect();
    });
    observer.observe(el, {
      // attributes: false,
      // attributeFilter: ["class"],
      childList: true,
      // characterData: false,
      subtree: true,
    });
  };

  const fnFixReply = () => {
    const $body = $n("body");
    // 判断封装
    const loadCheck = {
      t: null,
      check(text) {
        return text.indexOf("查看回复") > -1;
      },
      delay() {
        loadCheck.clearDelay();
        loadCheck.t = setTimeout(() => {
          location.reload();
        }, 1000);
      },
      clearDelay() {
        clearTimeout(loadCheck.t);
      },
      addLink() {
        // 创建一个新的导航链接
        const $u_notify_replay = document.createElement("li");
        $u_notify_replay.className = "category_item category_item_empty";
        $u_notify_replay.innerHTML = `<a class="j_cleardata" href="/i/sys/jump?type=replyme" target="_blank" data-type="reply">
          查看回复
      </a>
    `;
        // 添加链接到页面
        fnAfter($u_notify_replay, $n(".sys_notify .category_item"));
      },
    };

    // 监听页面改动
    fnElChange($body, () => {
      const $sys_notify = $n("div.u_notity_bd");
      if (!$sys_notify || $sys_notify.textContent.indexOf("查看私信") === -1) {
        return;
      }
      if (!loadCheck.check($sys_notify.textContent)) {
        // _warn($sys_notify.textContent.replace(/\s+/g, " "));
        loadCheck.addLink($sys_notify);
        // loadCheck.clearDelay()
        return;
      }
    });
  };

  try {
    fnFixReply();
  } catch (error) {
    _warn(error);
  }

  const fnMain$1 = () => {
    // 导航设置
    const $sub_nav_list = $n(".sub_nav_list");
    if (!$sub_nav_list) {
      return;
    }
    // 宽度 100%
    $sub_nav_list.style.width = "100%";
    // 匹配「个性动态」元素
    const $nav_personal = $n("#nav-personal-wraper");
    _warn($nav_personal);
    // 创建一个新的导航链接
    const $nav_i = document.createElement("li");
    $nav_i.className = "nav-i-forum";
    $nav_i.innerHTML = `
    <a href="https://tieba.baidu.com/i/i/forum?&pn=2" class="nav-item-link" target="_blank">
      我关注的贴吧
    </a>
  `;
    $nav_i.style.float = "right";
    // 插入到导航栏
    fnAfter($nav_i, $nav_personal);

  };

  try {
    fnMain$1();
  } catch (error) {
    _warn(error);
  }

  // 【小书签】一键骨架屏（Skeleton Screen） - 大家的板块 / 稻米鼠的频道🐹 - 小众软件官方论坛
  // https://meta.appinn.net/t/topic/21419

  const skeletonLoader = {
    selectList: [],
    textNodes: [],
    midColor(rgb) {
      return rgb.replace(/\d+/g, num => (num = +num) >= 128 ? 128 + (num - 128) / 2 : 128 - (128 - num) / 2);
    },
    getPic(width, height, text) {
      const canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d");
      canvas.width = width, canvas.height = height, ctx.fillStyle = "#F3F3F3", ctx.fillRect(0, 0, width, height);
      const strArr = text.split(/\n/g),
        maxLength = Math.max.apply(null, strArr.map(s => s.length));
      if (maxLength) {
        const fontSize = Math.min(width / maxLength, height / strArr.length);
        ctx.font = "Bold " + fontSize + "px Consolas", ctx.textAlign = "center", ctx.fillStyle = "#999";
        const x = width / 2,
          y = (height - fontSize * strArr.length) / 2 + fontSize;
        strArr.forEach((str, i) => {
          ctx.fillText(str, x, y + i * fontSize);
        });
      }
      return canvas.toDataURL("image/png");
    },

    copyAtts(newEl, el) {
      const atts = ["id", "class", "style"];
      for (const att of atts) el.getAttribute(att) && newEl.setAttribute(att, el.getAttribute(att));
    },

    addSelector(selector) {
      this.selectList.push(selector);
    },

    applySkeleton() {
      this.selectList.forEach((selector) => {
        // 获取 selector 元素
        const el = $n(selector);
        // 获取 selector 元素下的所有子孙元素
        const elList = fnFindDom(el, "*");
        // 遍历所有子孙元素
        elList.forEach((el) => {
          for (let e of el.childNodes) e.nodeType == Node.TEXT_NODE && this.textNodes.push(e);
          const elStyle = window.getComputedStyle(el);
          if ("none" !== elStyle.backgroundImage && /^url\(.*\)$/.test(elStyle.backgroundImage)) {
            const img = document.createElement("img");
            img.src = elStyle.backgroundImage.replace(/^url\("(.*)"\)$/, "$1"), img.onload = () => {
              el.style.backgroundImage = "url(\"" + this.getPic(img.width, img.height, img.width > 30 && img.height > 30 ? "background\n" + img.width + "x" + img.height : "") + "\")";
            };
          }
          if (-1 !== ["IMG", "SVG", "CANVAS", "VIDEO"].indexOf(el.tagName)) {
            const width = (+elStyle.width.replace(/px$/, ""))
              .toFixed(),
              height = (+elStyle.height.replace(/px$/, ""))
                .toFixed();
            if ("IMG" === el.tagName) return el.src = this.getPic(el.naturalWidth, el.naturalHeight, width + "x" + height), void (el.srcset.length && (el.srcset = el.src));
            const newEl = document.createElement("img");
            return newEl.src = this.getPic(width, height, el.tagName + "\n" + width + "x" + height), this.copyAtts(newEl, el), void el.parentNode.replaceChild(newEl, el);
          }
          if ("INPUT" === el.tagName || "TEXTAREA" === el.tagName) return el.value = el.value.replace(/./g, "▮"), void (el.placeholder = el.placeholder.replace(/./g, "▮"));
        });
      });
      this.textNodesUnder();
    },

    // 遍历所有文本节点函数
    textNodesUnder(el) {
      this.textNodes.forEach((textEl) => {
        if (/^[\s\n]*$/g.test(textEl.textContent)) return;
        const elStyle = window.getComputedStyle(textEl.parentNode);
        if (!elStyle.lineHeight || !elStyle.fontSize) return;
        const newTextNode = document.createElement("span"),
          color = "rgba(0,0,0,0) !important",
          bgColor = elStyle.color,
          lineHeight = +elStyle.lineHeight.replace(/px$/, ""),
          fontSize = +elStyle.fontSize.replace(/px$/, "");
          (100 * (lineHeight - .8 * fontSize) / 2 / lineHeight)
            .toFixed();
          const bgGradient = "linear-gradient(to bottom, transparent 20%, " + this.midColor(bgColor) + " 20% 80%, transparent 80%) !important";
        newTextNode.style = "color: " + color + "; background: " + bgGradient + ";", newTextNode.innerHTML = textEl.textContent, textEl.parentNode.replaceChild(newTextNode, textEl);
      });
    },

  };

  // 封装一个函数，用于创建元素
  const fnCreateDom = (tagName, innerHTML, attr = {}) => {
    const $dom = document.createElement(tagName);
    for (const key in attr) {
      $dom.setAttribute(key, attr[key]);
    }
    $dom.innerHTML = innerHTML;
    return $dom;
  };


  const fnMain = () => {
    const $my = $n("#my_tieba_mod");
    if ($my) {
      const $h4 = fnFindDom($my, "h4");
      // 创建一个按钮
      const $btn = fnCreateDom("a", "一键骨架屏", {
        href: "javascript:;",
        class: "skeleton_btn pull_right",
      });
      // 将按钮插入到 h4 标签后面
      $h4.append($btn);
      // 给按钮绑定点击事件
      $n(".skeleton_btn").addEventListener("click", () => {
        skeletonLoader.selectList = [
          "#new_list",
        ];
        skeletonLoader.applySkeleton();
      });
    }
  };

  try {
    fnMain();
  } catch (error) {
    _warn("一键骨架屏", error);
  }

  // localStorage 封装
  const lsObj = {
    setItem: function (key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: function (key, def = "") {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return def;
    },
  };

  // 数据读写封装
  const gobInfo = {
    // key: [默认值, 是否记录至 ls]
    linkLog: [[], false],
  };
  const gob = {
    _lsKey: `${gm_name}_data`,
    _bolLoaded: false,
    data: {},
    // 初始
    init() {
      // 根据 gobInfo 设置 gob 属性
      for (const key in gobInfo) {
        if (Object.hasOwnProperty.call(gobInfo, key)) {
          const item = gobInfo[key];
          this.data[key] = item[0];
          Object.defineProperty(this, key, {
            // value: item[0],
            // writable: true,
            get() { return this.data[key] },
            set(value) { this.data[key] = value; },
          });
        }
      }
      return this;
    },
    // 读取
    load() {
      if (this._bolLoaded) {
        return;
      }
      const lsData = lsObj.getItem(this._lsKey, this.data);
      _log("[log]gob.load()", lsData);
      for (const key in lsData) {
        if (Object.hasOwnProperty.call(lsData, key)) {
          const item = lsData[key];
          this.data[key] = item;
        }
      }
      this._bolLoaded = true;
    },
    // 保存
    save() {
      const lsData = {};
      for (const key in gobInfo) {
        if (Object.hasOwnProperty.call(gobInfo, key)) {
          const item = gobInfo[key];
          if (item[1]) {
            lsData[key] = this.data[key];
          }
        }
      }
      _log("[log]gob.save()", lsData);
      lsObj.setItem(this._lsKey, lsData);
    },
  };

  // 初始化
  gob.init().load();

  gob.addLink = (link) => {
    const { linkLog } = gob;
    if (linkLog.indexOf(link) === -1) {
      linkLog.push(link);
    }
    _warn("addLink()\n", linkLog);
  };

  gob.checkLink = () => {
    const { linkLog } = gob;
    // 大于等于 4 时，刷新页面
    if (linkLog.length >= 4) {
      window.location.reload();
    }
  };

  gob.bindLinkEvent = () => {
    const $table = $n(".forum_table");
    if (!$table) {
      return;
    }
    const $itemLink = fnFindDom($table, "a");
    [].forEach.call($itemLink, ($link) => {
      const text = $link.innerText;
      const title = $link.title;
      if (text === title) {
        $link.classList.add("name");
        // 点击事件，包括中键点击
        $link.addEventListener("mousedown", (e) => {
          gob.addLink(title);
        });
      }
    });
  };

  gob.bindLinkEvent();

  // 绑定页面焦点事件
  window.addEventListener("focus", () => {
    gob.checkLink();
  });

})();
