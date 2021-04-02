---
title: "GitNotes"
date: 2021-04-02T10:21:37+08:00
lastmod: 2021-04-02T10:21:37+08:00
draft: false
keywords: ["git",]
description: "git基础命令"
tags: ["git",]
categories: [""]
author: "wtnyzhsq"
comment: false
toc: true
autoCollapseToc: false
postMetaInFooter: false
hiddenFromHomePage: false
contentCopyright: false
reward: false
mathjax: false
mathjaxEnableSingleDollar: false
mathjaxEnableAutoNumber: false
hideHeaderAndFooter: false
flowchartDiagrams:
  enable: false
  options: ""
sequenceDiagrams: 
  enable: false
  options: ""

---

  git的一些主要基础实用命令

<!--more-->

[ 推荐一个学习git的网站](https://learngitbranching.js.org/)

------

#### 基础篇

##### Basic Level 1 branch

* git branch name  新建name分支

##### Basic Level 2 checkout

* git checkout  name 切换到 name分支 
* git checkout -b name  新建并切换到name分支

> 创建分支相当于建立另一个索引，指向当前节点，不会增加存储空间开销

##### Basic Level 3 merge

* 两个分支，把bugFix合并到main。*以下图片星号均表示当前分支*

<img src="https://cdn.jsdelivr.net/gh/wtnyzhsq/cdnstatic/img/20210402105918.png" alt="image-20210402105910249" style="zoom: 67%;" />

* git merge bugFix 之后

<img src="https://cdn.jsdelivr.net/gh/wtnyzhsq/cdnstatic/img/20210402110019.png" alt="image-20210402110019131" style="zoom:67%;" />

> （分支切换到bugFix后合并main，bugFix即可指向c4）

##### Basic Level 4

* git rebase name 

> 这个有点难解释。！看图  （具体作用，因没有实操环境暂未清楚）

git rebase 之前

<img src="https://cdn.jsdelivr.net/gh/wtnyzhsq/cdnstatic/img/20210402113307.png" alt="image-20210402113304926" style="zoom:67%;" />

git rebase main 之后

<img src="https://cdn.jsdelivr.net/gh/wtnyzhsq/cdnstatic/img/20210402113610.png" alt="image-20210402113605144" style="zoom:67%;" />

#### 高级篇

#### Basic Level 1

