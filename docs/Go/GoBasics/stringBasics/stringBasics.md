---
title: 1.字符串相关基础知识
date: '2022-06-01'
sidebar: 'auto'
categories:
 - Go
tags:
 - Go
 - string
---

## 1.字符串相关常用函数

### 1.1按字节统计字符串的长度

~~~go
package main

import "fmt"

func main() {
	str := "beijing"
	fmt.Println("长度为", len(str))
}
~~~

### 1.2字符串便利+处理中文问题

~~~go
package main

import "fmt"

func main() {
	str := "beijing北京"
	r := []rune(str)
	for i := 0; i < len(r); i++ {
		fmt.Printf("字符为%c\n", r[i])
	}
}
~~~

### 1.3字符串转整数

~~~go
package main

import (
	"fmt"
	"strconv"
)

func main() {
	str := "688"
	num, _ := strconv.Atoi(str)
	fmt.Printf("转成数字：%d\n", num)
}
~~~

### 1.4整数转字符串

~~~go
package main

import (
	"fmt"
	"strconv"
)

func main() {
	num := 688
	str := strconv.Itoa(num)
	fmt.Printf("转成字符串：%v\n", str)
}
~~~

### 1.5字符串转[]byte

~~~go
package main

import (
	"fmt"
)

func main() {
	str := "feedsheep"
	var bytes = []byte(str)
	fmt.Printf("bytes：%v\n", bytes)
}
~~~

### 1.6[]byte转字符串

~~~go
package main

import (
	"fmt"
)

func main() {
	bytes := []byte{102, 101, 101, 100, 115, 104, 101, 101, 112}
	str := string(bytes)
	fmt.Printf("string：%v\n", str)
}
~~~

### 1.7 10进制转2，8，16进制

~~~go
package main

import (
	"fmt"
	"strconv"
)

func main() {
	str := strconv.FormatInt(123, 2)
	fmt.Printf("%v\n", str)
	str = strconv.FormatInt(123, 16)
	fmt.Printf("%v\n", str)
}
~~~

### 1.8查找子串是否在指定的字符串中

~~~go
package main

import (
	"fmt"
	"strings"
)

func main() {
	b := strings.Contains("feedsheep", "sheep")
	fmt.Printf("%v\n", b)
}
~~~

### 1.9统计一个字符串有几个指定的子串

~~~go
package main

import (
	"fmt"
	"strings"
)

func main() {
	num := strings.Count("feedsheep", "e")
	fmt.Printf("%v\n", num)
}
~~~

### 1.10不区分大小写的字符串比较

~~~go
package main

import (
	"fmt"
	"strings"
)

func main() {
	b := strings.EqualFold("feedsheep", "FEEdSheep")
	fmt.Printf("%v\n", b)
}
~~~

### 1.11返回子串在字符串第一次出现的index值，如果没有返回-1

~~~go
package main

import (
	"fmt"
	"strings"
)

func main() {
	index := strings.Index("feedsheep", "ee")
	fmt.Printf("%v\n", index)
}
~~~

### 1.12返回子串在字符串最后一次出现的index，如没有返回-1

~~~go
package main

import (
	"fmt"
	"strings"
)

func main() {
	index := strings.LastIndex("feedsheep", "ee")
	fmt.Printf("%v\n", index)
}
~~~

### 1.13将指定个数的子串替换成另外一个子串

~~~go
package main

import (
	"fmt"
	"strings"
)

func main() {
    //-1为全部替换
	str := strings.Replace("feedsheep", "ee", "EE", -1)
	fmt.Printf("%v\n", str)
}

~~~

### 1.14按照指定的某个字符，为分割标识，将一个字符串拆分成字符串数组

~~~go
package main

import (
	"fmt"
	"strings"
)

func main() {
	strArr := strings.Split("feedsheep,so,Cool", ",")
	for i := 0; i < len(strArr); i++ {
		fmt.Printf("%v\n", strArr[i])
	}
}
~~~

### 1.15将字符串的字母进行大小写的转换

~~~go
package main

import (
	"fmt"
	"strings"
)

func main() {
	str := "feedSheep"
	str = strings.ToLower(str)
	fmt.Printf("%v\n", str)
	str = strings.ToUpper(str)
	fmt.Printf("%v\n", str)
}
~~~

### 1.16将字符串左右两边的空格去掉

~~~go
package main

import (
	"fmt"
	"strings"
)

func main() {
	str := "  feedSheep  "
	str = strings.TrimSpace(str)
	fmt.Printf("%v\n", str)
}
~~~

### 1.17将字符串左右两边指定的字符去掉

~~~go
package main

import (
	"fmt"
	"strings"
)

func main() {
	str := "!!!feedSheep!!!"
	str = strings.Trim(str, "!")
	fmt.Printf("%v\n", str)
}
~~~

### 1.18将字符串左边指定的字符去掉

~~~go
package main

import (
	"fmt"
	"strings"
)

func main() {
	str := "!!!feedSheep!!!"
	str = strings.TrimLeft(str, "!")
	fmt.Printf("%v\n", str)
}
~~~

### 1.19将字符串右边指定的字符去掉

~~~go
package main

import (
	"fmt"
	"strings"
)

func main() {
	str := "!!!feedSheep!!!"
	str = strings.TrimRight(str, "!")
	fmt.Printf("%v\n", str)
}
~~~

### 1.20判断字符串是否以指定的字符串开头

~~~go
package main

import (
	"fmt"
	"strings"
)

func main() {
	str := "feedSheep"
	b := strings.HasPrefix(str, "fee")
	fmt.Printf("%v\n", b)
}
~~~

### 1.21判断字符串是否以指定的字符串结尾

~~~go
package main

import (
	"fmt"
	"strings"
)

func main() {
	str := "feedSheep"
	b := strings.HasSuffix(str, "eep")
	fmt.Printf("%v\n", b)
}
~~~

