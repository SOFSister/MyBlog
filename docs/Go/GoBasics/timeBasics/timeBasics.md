---
title: 2.时间和日期基础知识
date: '2022-06-01'
sidebar: 'auto'
categories:
 - Go
tags:
 - Go
---

## 2.时间和日期相关函数

### 2.1获取当前时间

~~~go
package main

import (
	"fmt"
	"time"
)

func main() {
	now := time.Now()
	fmt.Printf("now=%v\n", now)
}
~~~

### 2.2获取到其它的日期信息

~~~go
package main

import (
	"fmt"
	"time"
)

func main() {
	now := time.Now()
	fmt.Printf("年=%v\n", now.Year())//2022
	fmt.Printf("月=%v\n", now.Month())//May
	fmt.Printf("月=%v\n", int(now.Month()))//5
	fmt.Printf("日=%v\n", now.Day())//31
	fmt.Printf("时=%v\n", now.Hour())//15
	fmt.Printf("分=%v\n", now.Minute())//18
	fmt.Printf("秒=%v\n", now.Second())//7
}
~~~

### 2.3格式化日期时间

~~~go
package main

import (
	"fmt"
	"time"
)

func main() {
	now := time.Now()
	//Printf格式化日期时间
	fmt.Printf("%d-%d-%d %d:%d:%d\n", now.Year(), now.Month(), now.Day(), now.Hour(), now.Minute(), now.Second())

	//Sprintf格式化日期时间
	dateStr := fmt.Sprintf("%d-%d-%d %d:%d:%d\n", now.Year(), now.Month(), now.Day(), now.Hour(), now.Minute(), now.Second())
	fmt.Printf("%v\n", dateStr)

	//Format格式化时间日期
	fmt.Printf(now.Format("2006-01-02 15:04:05"))
	fmt.Println()
	fmt.Printf(now.Format("2006-01-02"))
	fmt.Println()
	fmt.Printf(now.Format("15:04:05"))
	fmt.Println()
}
~~~

### 2.4计算程序运行的时间

~~~go
package main

import (
	"fmt"
	"strconv"
	"time"
)

func cal() string {
	var s string
	for i := 0; i < 100000; i++ {
		s += "hello" + strconv.Itoa(i)
	}
	return s
}
func main() {
	start := time.Now().UnixMilli()
	cal()
	end := time.Now().UnixMilli()
	fmt.Printf("%v\n", end-start)
}
~~~

