---
title: 5. map基础知识
date: '2022-06-22'
sidebar: 'auto'
categories:
 - Go
tags:
 - Go
 - map
---
## 5. map

### 5.1 map基本语法

**var map 变量名[keytype]valuetype**

- keytype可以是什么类型

  golang中的map,的key可以是很多种类型，比如bool,数字，string,指针，channel,还可以是只
  包含前面几个类型的接口，结构体，数组
  通常key为int、string
  注意：slice,map还有function不可以，因为这几个没法用一来判断

- valuetype可以是什么类型

  valuetype的类型和key基本一样
  通常为：数字(整数，浮点数),string,map,struct

### 5.2 map声明

注意：声明是不会分配内存的，初始化需要mke,分配内存后才能赋值和使用。

~~~go
package main

import "fmt"

func main() {
	//map声明
	var mp map[string]string
	//在使用map前，需要先make给map分配数据空间
	mp = make(map[string]string, 10)
	mp["feedSheep1"] = "wyy1"
	mp["feedSheep2"] = "wyy2"
	mp["feedSheep3"] = "wyy3"
	mp["feedSheep4"] = "wyy4"
	fmt.Println(mp)
}
~~~

> 1. map在使用前一定要make
> 2. map的key是不能重复的，如果重复了，则以最后这个key-value为准
> 3. map的value是可以相同的
> 4. map的key-value是无序的

### 5.3 map的使用

1. 方式1

   ~~~go
   package main
   
   import "fmt"
   
   func main() {
   	//map声明
   	var mp map[string]string
   	//在使用map前，需要先make给map分配数据空间
   	mp = make(map[string]string, 10)
   	mp["no1"] = "宋江"
   	mp["no2"] = "吴用"
   	mp["no3"] = "武松"
   	fmt.Println(mp)
   }
   ~~~

2. 方式2

   ~~~go
   package main
   
   import "fmt"
   
   func main() {
   	cities := make(map[string]string)
   	cities["no1"] = "北京"
   	cities["no2"] = "天津"
   	cities["no3"] = "上海"
   	fmt.Println(cities)
   }
   ~~~

3. 方式3

   ~~~go
   package main
   
   import "fmt"
   
   func main() {
   	heros := map[string]string{
   		"hero1": "宋江",
   		"hero2": "卢俊义",
   		"hero3": "吴用",
   	}
   	heros["hero4"] = "林冲"
   	fmt.Println(heros)
   }
   ~~~

> **其他**
>
> 二维map：例如map[string]map[string]string

### 5.4 map的增删改查

1. map增加和更新

   如果key还没有，就是增加，如果key存在就是修改。

   ~~~go
   package main
   
   import "fmt"
   
   func main() {
   	cities := make(map[string]string)
       //增
   	cities["no1"] = "北京"
   	cities["no2"] = "天津"
       //改
   	cities["no1"] = "上海"
   	fmt.Println(cities)
   }
   ~~~

2. map删除

   delete(map,"key"),delete是一个内置函数，如果key存在，就删除该key-value,.如果key不存在，
   不操作，但是也不会报错

   ~~~go
   package main
   
   import "fmt"
   
   func main() {
   	cities := make(map[string]string)
   	cities["no1"] = "北京"
   	cities["no2"] = "天津"
   	//删
   	delete(cities, "no1")
   	fmt.Println(cities) //map[no2:天津]
   }
   ~~~

   > 如果我们要删除map的所有key,没有一个专门的方法一次删除，可以遍历一下key,逐个删除
   > 或者map=make(...),make一个新的，让原来的成为垃圾，被gc回收

3. map查找

   ~~~go
   package main
   
   import "fmt"
   
   func main() {
   	cities := make(map[string]string)
   	cities["no2"] = "天津"
   
   	val, ok := cities["no2"]
   	if ok {
   		fmt.Printf("有no2 key 值为%v", val)
   	} else {
   		fmt.Println("没有no2 key")
   	}
   }
   ~~~

   如果map中存在key，那么findRes就会返回true，否则返回false

### 5.5 map的遍历

map的遍历使用for-range的结构遍历

~~~go
package main

import "fmt"

func main() {
	students := make(map[string]map[string]string)

	students["stu01"] = make(map[string]string)
	students["stu01"]["name"] = "tom"
	students["stu01"]["sex"] = "男"
	students["stu01"]["address"] = "北京长安街"

	students["stu02"] = make(map[string]string)
	students["stu02"]["name"] = "mary"
	students["stu02"]["sex"] = "女"
	students["stu02"]["address"] = "上海黄浦江"

    //遍历
	for k1, v1 := range students {
		fmt.Println("k1=", k1)
		for k2, v2 := range v1 {
			fmt.Printf("\t k2=%v v2=%v\n", k2, v2)
		}
		fmt.Println()
	}
}
~~~

### 5.6 map切片

切片的数据类型如果是map,则我们称为slice of map,map切片，这样使用则map个数就可以动
态变化了。

~~~go
package main

import "fmt"

func main() {
	/*
		使用一个map来记录monster的信息 name 和 age
		也就是说一个monster对应一个map，并且妖怪的个数可以动态的增加
	*/
	//1.声明一个map切片
	monsters := make([]map[string]string, 2) //准备放入两个妖怪
	//2.增加妖怪信息
	if monsters[0] == nil {
		monsters[0] = make(map[string]string)
		monsters[0]["name"] = "牛魔王"
		monsters[0]["age"] = "500"
	}

	if monsters[1] == nil {
		monsters[1] = make(map[string]string)
		monsters[1]["name"] = "玉兔精"
		monsters[1]["age"] = "400"
	}

	newMonster := map[string]string{
		"name": "火云邪神",
		"age":  "200",
	}
	monsters = append(monsters, newMonster)

	fmt.Println(monsters)
}
~~~

### 5.7 map排序

1. golang中没有一个专门的方法针对map的key进行排序
2. golang中的map默认是无序的，也不是按照添加的顺序存放的，每次遍历，得到的输出可能不一样
3. golang中map的排序，是先将key进行排序，然后根据key值遍历输出

~~~go
package main

import (
	"fmt"
	"sort"
)

func main() {
	mp := make(map[int]int)
	mp[10] = 10
	mp[2] = 1
	mp[4] = 2
	mp[8] = 3
	mp[16] = 4

	var keys []int
	for k, _ := range mp {
		keys = append(keys, k)
	}

	sort.Ints(keys)
	for _, v := range keys {
		fmt.Printf("key=%v value=%v\n", v, mp[v])
	}

}
~~~

### 5.8 map使用细节

1. map是引用类型，遵守引用类型传递的机制，在一个函数接收map,修改后，会直接修改原来的map
2. map的容量达到后，再想map增加元素，会自动扩容，并不会发生panic,也就是说map能动
   态的增长键值对(key-value)
