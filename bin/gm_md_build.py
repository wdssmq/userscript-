""" 读取和处理脚本文件 """
import os
import re
import datetime

from bin.base import fnGetFilesInDir2, fnLog

md_head_tpl = """---
title: {title}
description: {description}
pubDate: {pubDate}
updateDate: {updateDate}
# heroImage: {heroImage}
gitUrl: {gitUrl}
gitUrlRaw: {gitUrlRaw}
cdnUrl: {cdnUrl}
docUrl: {docUrl}
tags: []
---\n"""


def gm_read_js(file_js, file_name):
    """读取脚本文件"""
    with open(file_js, "r", encoding="UTF-8") as f:
        con_js = f.read()
    name = re.findall(r"@name\s+([^\n]+)", con_js)
    desc = re.findall(r"@description\s+([^\n]+)", con_js)
    # name[0] = re.sub(r"(\[|\])", r"\\\1", name[0])
    gm_info = {
        "name": name[0],
        "desc": desc[0],
        "file_gm": file_name.replace(".user.js", ""),
        "file_full": file_name,
        "body": "",
    }
    return gm_info

def gm_read_doc(file_doc):
    """读取脚本介绍文件"""
    with open(file_doc, "r", encoding="UTF-8") as f:
        con_md = f.read()
    return con_md

def gm_build_link(branch, gm_info):
    """拼接脚本链接"""
    file_full = gm_info["file_full"]
    git_url = f"https://github.com/wdssmq/userscript/blob/{branch}/dist/{file_full}"
    git_url_raw = f"{git_url}?raw=true"
    cnd_url = f"https://cdn.jsdelivr.net/gh/wdssmq/userscript@{branch}/dist/{file_full}"
    doc_url = f"https://github.com/wdssmq/userscript/tree/main/packages/{gm_info['file_gm']}#readme"
    return {
        "gitUrl": git_url,
        "gitUrlRaw": git_url_raw,
        "cdnUrl": cnd_url,
        "docUrl": doc_url,
    }

# 获取当前时间
now_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
def gm_md_time(gm_md_file):
    """设置发布/更新时间"""
    pub_time = now_time
    up_time = now_time
    if os.path.exists(gm_md_file):
        with open(gm_md_file, "r", encoding="UTF-8") as f:
            con_md = f.read()
        pub_time = re.findall(r"pubDate: ([^\n]+)", con_md)[0]
    return (pub_time, up_time)

def gm_read_dist(path):
    """读取脚本文件夹"""
    gm_info_list = []
    for file_name in fnGetFilesInDir2(path, ".js"):
        file_path = os.path.join(path, file_name)
        gm_info_list.append(gm_read_js(file_path, file_name))
    fnLog(gm_info_list)
    return gm_info_list


def gm_md_build(gob_config):
    """生成脚本介绍文件"""
    gm_info_list = gm_read_dist(gob_config["gm_dist_path"])
    for gm_info in gm_info_list:
        # gm_doc_path = os.path.join(gob_config["gm_src_path"], gm_info["file"], "README.md")
        # if os.path.exists(gm_doc_path):
        #     gm_doc_con = gm_read_doc(gm_doc_path)
        #     gm_info["body"] = gm_doc_con
        # gm_doc = gm_read_doc(os.path.join(gob_config["gm_src_path"], gm_info["file"] + ".md"))
        #
        # 拼接 md 文件路径
        gm_md_file = os.path.join(gob_config["gm_md_path"], gm_info["file_gm"] + ".md")
        # 获取发布/更新时间
        (pub_time, up_time) = gm_md_time(gm_md_file)
        # fnLog(pub_time)
        # fnLog(up_time)
        # GM_脚本 链接拼接
        gm_link_info = gm_build_link("main", gm_info)
        # 拼接 md 文件内容
        gm_md = md_head_tpl.format(
            title=gm_info["name"],
            description=gm_info["desc"],
            pubDate=pub_time,
            updateDate=up_time,
            heroImage="\"\"",
            **gm_link_info
        )
        gm_md +="\n"
        gm_md += gm_info["body"]
        with open(gm_md_file, "w", encoding="UTF-8") as f:
            f.write(gm_md)