---
title: "hexo自动上传脚本"
date: 2021-03-02T20:37:08+08:00
lastmod: 2021-03-02T20:37:08+08:00
draft: false
keywords: ["脚本",]
description: ""
tags: ["脚本",]
categories: ["脚本"]
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

搭建完博客后发现进行文章编写需要执行繁琐的hexo clean hexo g hexo d等命令，且我的博客还安装了Service Worker 服务，每一次静态页面的修改都需要对相应缓存版本号进行修改。所以利用golang语言编写了相应的小脚本。
<!--more-->

* [x] 文件读取（插入内容）
* [x] 利用os/exec包对cmd的使用
* [x] 字符分割等

###### 代码部分：

```go
//EditJs对sw.js文件内缓存版本号进行修改
func EditJs() {
    file, err := os.Open("D:\\BLOG\\blog\\source\\sw.js")
    CheackErr(err)
    defer file.Close()

    content, err1 := ioutil.ReadAll(file) //ioutil.ReadAll读取文件
    CheackErr(err1)
    strcontent := string(content)
    list := strings.SplitN(strcontent,"'",3) 
/*
字符串分割目的是把'-999991'分割出来根据符号`将整个文件分割为字符串切片。
          sw.js文件部分代码。
const cacheSuffixVersion = '-999991',
    maxEntries = 100;
    
importScripts('https://cdn.... 
*/
    
//字符串转换为数字，-999991，每次执行加一，即更改缓存版本号。
    num, _ := strconv.Atoi(list[1])
    if num < 100 {
        num = num + 1
        fmt.Println(num)
        //以下代码为字符串拼接形成新字符串覆盖原sw.js文件达到数据插入功能
        tempFile, err := os.OpenFile("D:\\BLOG\\blog\\source\\sw.tmp", os.O_CREATE|os.O_TRUNC|os.O_WRONLY, 0644)
        if err != nil {
            fmt.Printf("Temp create failed! err: %v\n", err)
            return
        }
        writer := bufio.NewWriter(tempFile)
        _ = writer.Flush()
        _, _ = writer.WriteString(list[0])
        _ = writer.Flush()
        _, _ = writer.WriteString("'"+strconv.Itoa(num)+"'")
        _ = writer.Flush()
        _, _ = writer.WriteString(list[2])
        _ = writer.Flush()
        file.Close()
        tempFile.Close()
        err = os.Rename("D:\\BLOG\\blog\\source\\sw.tmp", "D:\\BLOG\\blog\\source\\sw.js")
    }else {
        panic("缓存版本号超出最大值")
    }
    fmt.Println("sw.js缓存版本号修改完成。")
}
```



```go
func deliverPublic() {
    var err error
    var out []byte
    err = os.Chdir("d:/BLOG/blog") //切换工作目录
    CheackErr(err)

    out, err = exec.Command("npm","run", "sendout").Output()
    CheackErr(err)
    fmt.Printf(string(out))
}

func deliverSource() {
    var err error
    var out []byte
    err = os.Chdir("d:/BLOG/blog")
    CheackErr(err)

    out, err = exec.Command("git","add", ".").Output()
    CheackErr(err)
    fmt.Printf(string(out))
	
    timeStr:=time.Now().Format("2006-01-02 15:04:05")
    out, err = exec.Command("git","commit", "-m", timeStr).Output()
    CheackErr(err)
    fmt.Printf(string(out))

    out, err = exec.Command("git","push").Output()
    CheackErr(err)
    fmt.Printf(string(out))
}
```