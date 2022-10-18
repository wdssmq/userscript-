import { $n, _warn, _curUrl } from "./_base.js";
// 时间轴书签

const gob = {
  lstTime: 0,
  curTime: 0,
  title: "",
};

const fnUpTitle = (time) => {
  if (gob.title === "") {
    gob.title = $n("h1.video-title").innerHTML;
  }
  $n("title").innerHTML = `${gob.title}_${time}_bilibili`;
  // debug
  _warn(`title: ${gob.title}_${time}_bilibili`);
};

const fnUpUrl = (time) => {
  let url = _curUrl();
  let urlNew = url;
  // 清理参数
  url = url.split("?")[0];
  // 拼接参数
  urlNew = `${url}?t=${time}`;
  window.history.pushState(null, null, urlNew);
  // debug
  _warn(`url: ${urlNew}`);
};

const fnGetTime = () => {
  const $timLabel = $n(".bpx-player-ctrl-time-label");
  const $curTime = $n(".bpx-player-ctrl-time-current");
  if ($timLabel && $curTime) {
    const str = $curTime.innerHTML;
    const arr = str.split(":");
    if (arr.length === 3) {
      return parseInt(arr[0]) * 3600 + parseInt(arr[1]) * 60 + parseInt(arr[2]);
    } else {
      return parseInt(arr[0]) * 60 + parseInt(arr[1]);
    }
  }
};

document.addEventListener(
  "mouseover",
  function (e) {
    const $target = e.target;
    // bpx-player-container bpx-state-no-cursor

    // const $container = $n(".bpx-player-container");
    // if ($container && !$container.classList.contains("bpx-state-no-cursor")) {
    //   _warn("进度条", e.target);
    //   return;
    // }

    if ($target.classList.contains("bpx-player-control-wrap")) {
      gob.curTime = fnGetTime();
      if (gob.curTime > 0 && gob.curTime - gob.lstTime > 137) {
        fnUpTitle(gob.curTime);
        fnUpUrl(gob.curTime);
        gob.lstTime = gob.curTime;
      }
    }
  },
  false,
);