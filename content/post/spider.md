---
title: "Spider"
date: 2021-03-02T18:50:50+08:00
lastmod: 2021-03-02T18:50:50+08:00
draft: false
keywords: ["爬虫","python",]
description: ""
tags: ["爬虫","python"]
categories: ["爬虫"]
author: ""

# You can also close(false) or open(true) something for this content.
# P.S. comment can only be closed
comment: false
toc: true
autoCollapseToc: false
postMetaInFooter: false
hiddenFromHomePage: false
# You can also define another contentCopyright. e.g. contentCopyright: "This is another copyright."
contentCopyright: false
reward: false
mathjax: false
mathjaxEnableSingleDollar: false
mathjaxEnableAutoNumber: false

# You unlisted posts you might want not want the header or footer to show
hideHeaderAndFooter: false

# You can enable or disable out-of-date content warning for individual post.
# Comment this out to use the global config.
#enableOutdatedInfoWarning: false

flowchartDiagrams:
  enable: false
  options: ""

sequenceDiagrams: 
  enable: false
  options: ""

---
以今日头条为例通过分析 Ajax 抓取网页数据，并把数据分文件夹保存到本地。
<!--more-->
### 首先踩点

#### - - -分析内容- - - 

搜索框输入‘街拍’，刷新后出现ajax请求，类型为XHR的即为ajax请求。点击preview分析内容，我们发现ajax请求的主要内容都在data标签里面，点开data，发现该标签里面分了很多小板块（0，1，2.等等），对比网页就可以得出这些小板块就是网页的一个模块，里面存放的东西就是我们要找的图片和标题。
![踩点2](https://cdn.jsdelivr.net/gh/wtnyzhsq/cdnstatic/img/%E8%B8%A9%E7%82%B92.png)

![踩点3](https://cdn.jsdelivr.net/gh/wtnyzhsq/cdnstatic/img/%E8%B8%A9%E7%82%B94.png)

![踩点4](https://cdn.jsdelivr.net/gh/wtnyzhsq/cdnstatic/img/%E8%B8%A9%E7%82%B95.png)

##### - - -分析请求头- - - 

在这个网页里面，每一次加载就是一个ajax请求。这时候分析两三个请求头就可以发现，每次发送ajax请求url变化的只是offset和timestamp，复制RequestURL打开发现timestamp不用输也能得出结果。所以变化的相当与只有offset，每次变化都是20，说明每次加载20个模块，也就是20组图片。所以在这里设置一个循环就可以采集到很多的目标数据。

![踩点5](https://cdn.jsdelivr.net/gh/wtnyzhsq/cdnstatic/img/%E8%B8%A9%E7%82%B95-1.png)

![踩点6](https://cdn.jsdelivr.net/gh/wtnyzhsq/cdnstatic/img/%E8%B8%A9%E7%82%B96.png)



#### 代码部分

##### - - -获取网页内容- - - 
``` bash
import urllib.error
import requests
from urllib.parse import urlencode

def get_page(Num_page):
    # 获取网页
    params = {
        'aid': '24',
        'app_name': 'web_search',
        'offset': Num_page,
        'format': 'json',
        'keyword': '街拍',
        'autoload': 'true',
        'count': '20',
        'en_qc': '1',
        'cur_tab': '1',
        'from': 'search_tab',
        'pd': 'synthesis',
    }
    url = ex_url + urlencode(params)
    # urlencode方法用法可百度就能看懂
    try:
        response = requests.get(url, headers=headers)
        return response.json()
    except urllib.error.HTTPError as e:
        print(e.reason)
    except urllib.error.URLError as e:
        print("Can't not connect url")
    # 异常处理
```
#### - - -解析保存数据- - - 
这里我用一个函数一起写了读取和保存操作,读取和保存独立分开比较好.
``` bash
from pyquery import PyQuery as pq
import os
import re

def get_img_url(json):
    items = json.get('data')
    # 调用get方法获取data标签内容
    for item in items:
        if item.get('emphasized') is not None:
            file_text = pq(item.get('emphasized').get('title')).text()
            # 获取标题信息
            file_list = re.findall(r"[\u4E00-\u9FFF]", file_text, re.S)
            # 正则匹配file_text中的汉字
            file_name = ''.join(file_list)
            print(file_name)
            os.mkdir(file_name)
            # 创建以file_name为名的文件夹
            lists = item.get('image_list')
            # 一组获取图片地址
            for lis in lists:
                try:
                    response = requests.get(lis['url'])
                    f_name = file_name + '/' + lis['url'].split('/')[-1] + '.jpg'
                    with open(f_name, 'wb') as f:
                        f.write(response.content)
                    # 请求一组图片里各个图片.并保存.
                except urllib.error.HTTPError as e:
                    print(e.reason)
                except urllib.error.URLError as e:
                    print("Can't not connect url")
                # 异常处理
```
#### - - -函数运行- - - 
```bash
if __name__ == '__main__':
    for page in range(0, 100, 20):
        json = get_page(page)
        get_img_url(json)
```

#### 以下为部分运行结果
![结果1](https://cdn.jsdelivr.net/gh/wtnyzhsq/cdnstatic/img/%E7%BB%93%E6%9E%9C2.png)

![结果2](https://cdn.jsdelivr.net/gh/wtnyzhsq/cdnstatic/img/%E7%BB%93%E6%9E%9C2.png) 