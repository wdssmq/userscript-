import { curDate, _curUrl, _sleep, _log, $n, $na, fnAfter, fnFindDom } from "./_base";

const gob = {
  intAutoScroll: 0,
  maxAutoSCroll: 2,
  curTimeMS: curDate.getTime(),
  intBlocks: 0,
};

function fnGetItems($baseEL = "body") {
  let $items = $na(".list-entries article");
  if ($baseEL !== "body") {
    $items = $baseEL.querySelectorAll("article");
  }
  return $items;
}

async function fnAutoScroll($items, $blocks) {
  const $h2End = $n(".list-entries > h2");
  const $endItem = $items[$items.length - 1];
  // // 阻止向下滚动
  // if (gob.intAutoScroll > 4 && !$h2End) {
  //   $blocks[$blocks.length - 1].scrollIntoView();
  // }
  if ($blocks.length > gob.maxAutoSCroll + 2 || $h2End || !$endItem) {
    // _log("fnAutoScroll", "自动滚动停止");
    // _log("fnAutoScroll", gob.intAutoScroll);
    return;
  }
  // dateset 不存在时，执行
  if ($endItem.dataset.scrollIntoView !== "done") {
    $endItem.scrollIntoView();
    gob.intAutoScroll += 1;
    $endItem.dataset.scrollIntoView = "done";
  }
  await _sleep(1000);
  if (gob.intAutoScroll <= gob.maxAutoSCroll && !$h2End) {
    // 隐藏最新的四个区块
    [].forEach.call($blocks, ($e, i) => {
      // 隐藏
      // $e.remove();
      $e.style.display = "none";
      $e.classList.add("hidden");
    });
  }
  fnLessItem();
}

// 构建侧边栏
function fnBuildSideBar($block) {
  const $el = $n(".list.list-feed");
  // 设置 fixed 定位
  $el.parentNode.style.position = "fixed";
  // 获取 $block 类名
  const strClassBlock = $block.className.replace("EntryList__chunk", "").trim();
  const strClassBtn = "btn-" + strClassBlock;
  // _log(strClassBlock, `.${strClassBtn}`);
  // _log("fnBuildSideBar", $n(`.${strClassBtn}`));
  // 判断是否隐藏
  const isHidden = $block.classList.contains("hidden");
  if (!isHidden && !$n(`.${strClassBtn}`) && $na(".btn-LessItem").length < 4) {
    // 追加元素 a
    const $a = document.createElement("a");
    $a.href = "javascript:void(0);";
    $a.className = strClassBtn;
    $a.classList.add("btn-LessItem");
    $a.innerHTML = strClassBlock;
    $a.style.display = "block";
    // 边框和内边距
    $a.style.border = "1px solid rgba(0,0,0,0.15)";
    $a.style.padding = "3px 10px";
    // 圆角和外边距
    $a.style.borderRadius = "3px";
    $a.style.margin = "3px 0";
    // 点击事件
    $a.addEventListener("click", function () {
      const $items = fnGetItems($block);
      const intPer = Math.floor($items.length / 4);
      const intClick = parseInt($block.dataset.click) || 0;
      const curOffset = intClick * intPer;
      // _log({
      //   intPer,
      //   intClick,
      //   curOffset,
      // });
      $items[curOffset].scrollIntoView();
      const $btnList = [];
      let strAlert = "";
      for (let i = 0; i < intPer; i++) {
        const element = $items[i + curOffset];
        if (!element) {
          continue;
        }
        element.style.marginBottom = "11px";
        element.style.padding = "5px";
        const $btn = element.querySelector(
          ".EntryMarkAsReadButton",
        );
        $btnList.push($btn);
        const $a = element.querySelector(".content > a");
        strAlert += $a.textContent + "\n\n";
      }
      $block.dataset.click = intClick + 1;
      setTimeout(() => {
        // 确认对话框
        // if (confirm(strAlert)) {
        $btnList.forEach(($btn) => {
          $btn.click();
        });
        if (curOffset + intPer >= $items.length) {
          $a.style.display = "none";
          return;
        }
        // }
      }, 1000);
      // alert(strAlert);
      // _log("fnBuildSideBar", $items);
      // _log("fnBuildSideBar", $btnList);
    });
    // 添加到 $el 后边
    fnAfter($a, $el);
  }
}

function fnLessItem() {
  // 判断页面地址
  if (_curUrl().indexOf("subscription/") === -1) {
    return;
  }
  const $items = fnGetItems();
  const $blocks = $na(".list-entries .EntryList__chunk");
  fnAutoScroll($items, $blocks);
  [].forEach.call($blocks, function ($e, i) {
    // 设置下边框
    $e.style.borderBottom = "13px solid #444";
    // 设置下边距
    $e.style.marginBottom = "13px";
    // 分配一个不重复的 class
    $e.classList.add("LessItem" + i);
    // $e.classList.add("LessItem");
    if (gob.intAutoScroll > gob.maxAutoSCroll) {
      fnBuildSideBar($e);
    }
  });
}

// 加载完成后执行
window.onload = function () {
  fnOnLoad();
};

async function fnOnLoad() {
  await _sleep(1000);

  // 判断加载完成
  if (!$n("#feedlyFrame")) {
    fnOnLoad();
    _log("fnOnLoad", "页面加载中");
    return;
  }

  // 滚动条滚动时触发
  if ($n("#feedlyFrame") && $n("#feedlyFrame").dataset.LessItem !== "done") {
    $n("#feedlyFrame").dataset.LessItem = "done";
    // $n("#feedlyFrame").addEventListener("mouseover", fnLessItem);
    $n("#feedlyFrame").addEventListener("scroll", fnLessItem);
    _log("fnOnLoad", "列表滚动监听");
  }
}