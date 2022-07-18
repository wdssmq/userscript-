import { _log, _getDateStr, fnCopy } from "./_base";

_log("_later2url.js", "开始");

const bolDebug = false;

// 构造 Bash Shell 脚本
function fnMKShell(arrList) {
  const curDateStr = _getDateStr();
  let strRlt =
    'if [ ! -d "bilibili-foldername" ]; then\n' +
    "mkdir bilibili-foldername\n" +
    "fi\n" +
    "cd bilibili-foldername\n\n";
  strRlt = strRlt.replace(/foldername/g, curDateStr);
  /**
   * e {title:"",href:""}
   */
  arrList.forEach(function (e, i) {
    const serial = i + 1;
    // _log(e);
    // 移除不能用于文件名的字符
    let title = e.title.replace(/\\|\/|:|\*|!|\?]|<|>/g, "");
    title = title.replace(/["'\s]/g, "");
    const href = e.href || e.url;
    // echo [InternetShortcut] > "*.url"
    // echo "URL=*" >> "*.url"
    strRlt += `echo [InternetShortcut] > "${serial}-${title}.url"\n`;
    strRlt += `echo "URL=${href}" >> "${serial}-${title}.url"\n`;
    strRlt += "\n";
  });
  if (!bolDebug) {
    strRlt += "exit\n\n";
  }
  // strRlt = strRlt.replace(/\/\/\//g, "//www.bilibili.com/");
  //_log(strRlt);
  return strRlt;
  //$("body").innerHTML = strRlt.replace(/\n/g, "<br/>");
}

// Ajax 封装
function fnGetAjax(callback = function () { }) {
  $.ajax({
    url: "https://api.bilibili.com/x/v2/history/toview/web",
    type: "GET",
    xhrFields: {
      withCredentials: true, // 这里设置了withCredentials
    },
    success: function (data) {
      // _log();
      callback(data.data.list);
    },
    error: function (err) {
      console.error(err);
    },
  });
}

// 导出稍后再看为 .lnk 文件
(function () {
  if (/#\/list|#\/video/g.test(location.href)) {
    let tmpHTML = $("span.t").html();
    fnGetAjax(function (list) {
      const arrRlt = [];
      list.forEach((item, index) => {
        arrRlt.push({
          title: item.title,
          href: `https://www.bilibili.com/video/${item.bvid}`,
          bvid: item.bvid,
        });
        // _log(item, index);
      });
      // _log("稍后再看", arrRlt.length);
      tmpHTML = tmpHTML.replace(/0\//g, arrRlt.length + "/");
      $("span.t").html(tmpHTML + "「点击这里复制 bash shell 命令」");
      let appCon = "「已复制」";
      if (arrRlt.length > 37) {
        appCon = "「已复制，数量过多建议保存为 .sh 文件执行」";
      }
      // 注册点击复制
      fnCopy("span.t", fnMKShell(arrRlt), () => {
        $("span.t").html(tmpHTML + appCon);
      });
    });
    return false;
  }
})();

_log("_later2url.js", "结束");
