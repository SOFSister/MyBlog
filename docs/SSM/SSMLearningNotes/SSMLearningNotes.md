---
title: SSM学习笔记
date: '2022-05-06 18:07:00'
sidebar: 'auto'
categories:
 - SSM
tags:
 - Spring
 - SpringBoot
 - Mybatis
---
## 创建文件

https://start.spring.io/

下载包并导入idea

## 使用SpringBoot2.X开发JSON接口

~~~java
package com.example.demoproject.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * 视频控制器
 */

@RestController
@RequestMapping("/api/v1/video")
public class VideoController {


    @RequestMapping("list")
    public Object list(){
        Map<String,String> map = new HashMap<>();
        map.put("1","面试专题课程");
        map.put("2","SpringCloud微服务课程");

        return map;
    }


}
~~~

**结果**

![image-20220216011101184](/SSMLearningNotes.assets/image-20220216011101184.png)

## **SpringBoot2.X常用的注解**

- @Controller 作用：用于标记这个类是一个控制器，返回页面的时候使用；如果要返回JSON,则需要在接口上使用@ResponseBody才可以

- @RestController 作用：用于标记这个类是一个控制器，返回JSON数据的时候使用，如果使用这个注解，则接口返回数据会被序列化为JSON

- 所以：@RestController = @Controller+@ResponseBody

- @RequestMapping 作用：路由映射，用于类上做1级路径；用于某个方法上做子路径

- @SpringBootApplication 作用: 用于标记是SringBoot应用，里面包含多个子注解,即

  ![image-20220216013752823](/SSMLearningNotes.assets/image-20220216013752823.png)
  

## 一般项目架构搭建

![image-20220216211605705](/SSMLearningNotes.assets/image-20220216211605705.png)

![image-20220216211640049](/SSMLearningNotes.assets/image-20220216211640049.png)

## SpringBoot2.X统一接口返回协议-掌握开发规范

JSONData工具类开发

~~~java
package com.example.demoproject.utils;
public class JsonData {

    private int code;

    private Object data;

    private String msg;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public JsonData(){}

    public JsonData(int code,Object data){
        this.code = code;
        this.data = data;
    }

    public JsonData(int code,Object data,String msg){
        this.code = code;
        this.data = data;
        this.msg = msg;
    }

    public static JsonData buildSuccess(Object data){
        return new JsonData(0,data);
    }

    public static JsonData buildError(String msg){
        return new JsonData(-1,"",msg);
    }

    public static JsonData buildError(String msg,int code){
        return new JsonData(code,"",msg);
    }
}

~~~

## **SpringBoot配置Jackson处理字段**

![image-20220217013723089](/SSMLearningNotes.assets/image-20220217013723089.png)

## **使用@value注解配置文件自动映射到属性和实体类**

配置文件

~~~properties

#微信支付的appid
wxpay.appid=w4566515

#支付密钥
wxpay.secret=w4566515sada

#微信支付商户号
wxpay.mechid=153531
~~~



配置类

~~~java
@Configuration
@PropertySource("classpath:pay.properties")
public class WXConfig implements Serializable {

    @Value("${wxpay.appid}")
    private String payAppid;

    @Value("${wxpay.secret}")
    private String paySecret;

    @Value("${wxpay.mechid}")
    private String payMechid;

    public String getPayAppid() {
        return payAppid;
    }

    public void setPayAppid(String payAppid) {
        this.payAppid = payAppid;
    }

    public String getPaySecret() {
        return paySecret;
    }

    public void setPaySecret(String paySecret) {
        this.paySecret = paySecret;
    }

    public String getPayMechid() {
        return payMechid;
    }

    public void setPayMechid(String payMechid) {
        this.payMechid = payMechid;
    }
}

~~~

controller

~~~java
@RestController
@RequestMapping("api/v1/test")
@PropertySource("classpath:pay.properties")
public class TestController {

    @Autowired
    private WXConfig wxConfig;

    @GetMapping("get_config")
    public JsonData testConfig(){

        Map<String,String> map=new HashMap<>();
        map.put("appid",wxConfig.getPayAppid());
        map.put("secret",wxConfig.getPaySecret());
        map.put("mechid",wxConfig.getPayMechid());

        return JsonData.buildSuccess(map);
    }

}
~~~

## **项目里使用SpringBoot2.x的单元测试**

![image-20220217172139920](/SSMLearningNotes.assets/image-20220217172139920-16450897005471.png)

## **SpringBoot2.X全局异常处理**

~~~java
package com.example.demoproject.handler;

import com.example.demoproject.utils.JsonData;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * @Description :标记这是一个异常处理类
 */
@RestControllerAdvice
public class CustomExtHandler {

    @ExceptionHandler(value = Exception.class)
    JsonData handleException(Exception e, HttpServletRequest request){

        return JsonData.buildError("服务端出问题了",-2);

    }
}

~~~

## **使用Servlet3.0注解开发自定义的过滤器**

使用Servlet3.0的注解进行配置步骤

- 启动类里面增加 @ServletComponentScan，进行扫描

- 新建一个Filter类，implements Filter，并实现对应的接口

- @WebFilter 标记一个类为filter，被spring进行扫描

- urlPatterns：拦截规则，支持正则

- 控制chain.doFilter的方法的调用，来实现是否通过放行

- 不放行，web应用resp.sendRedirect("/index.html") 或者 返回json字符串


~~~java
  package com.example.demoproject.filter;

import com.example.demoproject.domain.User;
import com.example.demoproject.service.impl.UserServiceImpl;
import com.example.demoproject.utils.JsonData;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.thymeleaf.util.StringUtils;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;
@WebFilter(urlPatterns = "/api/v1/pri/*",filterName = "loginFilter")
public class LoginFilter implements Filter {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 容器加载时
     * @param filterConfig
     * @throws ServletException
     */
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        Filter.super.init(filterConfig);
        System.out.println("init");
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {


        System.out.println("doFilter");

        HttpServletRequest req = (HttpServletRequest) servletRequest;

        HttpServletResponse resp = (HttpServletResponse) servletResponse;

        String token = req.getHeader("token");
        if(StringUtils.isEmpty(token)){
            token = req.getParameter("token");
        }

        if(!StringUtils.isEmpty(token)){
            //判断token是否合法
            User user = UserServiceImpl.sessionMap.get(token);
            if(user != null){
                filterChain.doFilter(servletRequest,servletResponse);
            }else{
                JsonData jsonData = JsonData.buildError("登录失败，token无效",-2);
                String jsonStr = objectMapper.writeValueAsString(jsonData);
                renderJson(resp,jsonStr);
            }
        }else{
            JsonData jsonData = JsonData.buildError("未登录",-3);
            String jsonStr = objectMapper.writeValueAsString(jsonData);
            renderJson(resp,jsonStr);
        }

    }


    private void renderJson(HttpServletResponse response,String json){
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        try(PrintWriter writer = response.getWriter()){
            writer.print(json);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 容器销毁时
     */
    @Override
    public void destroy() {
        Filter.super.destroy();
        System.out.println("destroy");
    }
}

~~~

  

## **使用 Servlet3.0的注解自定义原生Servlet**

~~~java
@WebServlet(name = "userServlet", urlPatterns = "/api/v1/test/customs" )
class UserServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        PrintWriter writer = resp.getWriter();
        writer.write("this is my custom servlet");
        writer.flush();
        writer.close();

    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        this.doGet(req,resp);
    }

}
~~~

## **监听器和Servlet3.0的注解自定义原生Listener监听器实战**

- 监听器：应用启动监听器，会话监听器，请求监听器
- 作用
  - ServletContextListener 应用启动监听
  - HttpSessionLisener 会话监听
  - ServletRequestListener 请求监听
- 常用的监听器 ServletContextListener、HttpSessionListener、ServletRequestListener)

~~~java
@WebListener
public class RequestListener implements ServletRequestListener {

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
            System.out.println("======contextDestroyed========");
    }

    @Override
    public void contextInitialized(ServletContextEvent sce) {
            System.out.println("======contextInitialized========");

    }
}
~~~

## **Spingboot2.x新版本配置拦截器的使用**



- 拦截器： 和过滤器用途基本类似

- SpringBoot2.x使用步骤

  - SpringBoot2.X 新版本配置拦截器 implements WebMvcConfigurer

    - 自定义拦截器 HandlerInterceptor
      - preHandle：调用Controller某个方法之前(一般使用他进行逻辑处理)
      - postHandle：Controller之后调用，视图渲染之前，如果控制器Controller出现了异常，则不会执行此方法
      - afterCompletion：不管有没有异常，这个afterCompletion都会被调用，用于资源清理

     

  - 按照注册顺序进行拦截，先注册，先被拦截

拦截器不生效常见问题：

~~~
- 是否有加@Configuration
- 拦截路径是否有问题 **  和 * 
- 拦截器最后路径一定要 /**  如果是目录的话则是 /*/
~~~

和Filter过滤器的区别

~~~
Filter和Interceptor二者都是AOP编程思想的体现，功能基本都可以实现

拦截器功能更强大些，Filter能做的事情它都能做

Filter在只在Servlet前后起作用，而Interceptor够深入到方法前后、异常抛出前后等

filter依赖于Servlet容器即web应用中，而Interceptor不依赖于Servlet容器所以可以运行在多种环境。

在接口调用的生命周期里，Interceptor可以被多次调用，而Filter只能在容器初始化时调用一次。
	
Filter和Interceptor的执行顺序
 	
过滤前->拦截前->action执行->拦截后->过滤后
~~~

补充知识点

~~~
如何配置不拦截某些路径？
registry.addInterceptor(new LoginIntercepter()).addPathPatterns("/api/v1/pri/**")
//配置不拦截某些路径，比如静态资源
.excludePathPatterns("/**/*.html","/**/*.js"); 
~~~

使用方法

拦截配置类

~~~java
/**
 * @Description :拦截器配置类
 */
@Configuration
public class CustomWebMvcConfigurer implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {

        registry.addInterceptor(getLoginInterceptor()).addPathPatterns("/api/v1/pri/**");

        WebMvcConfigurer.super.addInterceptors(registry);
    }

    @Bean
    public LoginInterceptor getLoginInterceptor(){
        return new LoginInterceptor();
    }
}

~~~

拦截类

~~~java
/**
 * @Description :拦截类
 */
public class LoginInterceptor implements HandlerInterceptor {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        System.out.println("LoginInterceptor preHandle==========");

        String token = request.getHeader("token");
        if(StringUtils.isEmpty(token)){
            token = request.getParameter("token");
        }

        if(!StringUtils.isEmpty(token)){
            //判断token是否合法
            User user = UserServiceImpl.sessionMap.get(token);
            if(user != null){
                return true;
            }else{
                JsonData jsonData = JsonData.buildError("登录失败，token无效",-2);
                String jsonStr = objectMapper.writeValueAsString(jsonData);
                renderJson(response,jsonStr);
                return false;
            }
        }else{
            JsonData jsonData = JsonData.buildError("未登录",-3);
            String jsonStr = objectMapper.writeValueAsString(jsonData);
            renderJson(response,jsonStr);
            return false;
        }
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

        System.out.println("LoginInterceptor postHandle==========");

        HandlerInterceptor.super.postHandle(request,response,handler,modelAndView);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

        System.out.println("LoginInterceptor afterCompletion==========");
        HandlerInterceptor.super.afterCompletion(request,response,handler,ex);
    }

    private void renderJson(HttpServletResponse response,String json){
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        try(PrintWriter writer = response.getWriter()){
            writer.print(json);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
~~~

## SpringBoot2.X定时任务schedule

- SpringBoot使用注解方式开启定时任务
  - 启动类里面 @EnableScheduling开启定时任务，自动扫描
  - 定时任务业务类 加注解 @Component被容器扫描
  - 定时执行的方法加上注解 @Scheduled(fixedRate=2000) 定期执行一次

- cron 定时任务表达式 @Scheduled(cron="*/1 * * * * *") 表示每秒
  - crontab 工具 https://tool.lu/crontab/
- fixedRate: 定时多久执行一次（上一次开始执行时间点后xx秒再次执行；）
- fixedDelay: 上一次执行结束时间点后xx秒再次执行

定时任务业务类

~~~java
/**
 * @Description :定时统计订单金额
 */
@Component
public class VideoOrderTask {

    //每两秒执行一次
    //@Scheduled(fixedRate = 2000)
    //crontab表达式 每一秒执行一次
    @Scheduled(cron = "*/1 * * * * *")
    public void sum(){

        //正常的话是从数据库内查询

        System.out.println(LocalDateTime.now() + "当前交易额=" + Math.random());

    }

}

~~~

## SpringBoot2.x异步任务

- 启动类里面使用@EnableAsync注解开启功能，自动扫描
- 定义异步任务类并使用@Component标记组件被容器扫描,异步方法加上@Async

 **使用SpringBoot2.x开发异步任务Future获取结果**

- 注意点：
  - 要把异步任务封装到类里面，不能直接写到Controller
  - 增加Future 返回结果 AsyncResult("task执行完成");
  - 如果需要拿到结果 需要判断全部的 task.isDone()

异步类

~~~java
@Component
@Async
public class AsyncTask {

    public void task1(){

        try {
            Thread.sleep(4000L);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("task 1");

    }

    public void task2(){

        try {
            Thread.sleep(4000L);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("task 2");

    }

    public void task3(){
        try {
            Thread.sleep(4000L);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("task 3");

    }

    public Future<String> task4(){
        try {
            Thread.sleep(4000L);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("task 4");

        return new AsyncResult<String>("任务4");
    }

    public Future<String> task5(){
        try {
            Thread.sleep(4000L);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("task 5");

        return new AsyncResult<String>("任务5");
    }

}

~~~

操作

~~~java
@GetMapping("async")
    public JsonData testAsync(){
        long begin = System.currentTimeMillis();

//        asyncTask.task1();
//        asyncTask.task2();
//        asyncTask.task3();

        Future<String> task4 = asyncTask.task4();
        Future<String> task5 = asyncTask.task5();

        for(;;){//一直循环直到得到值
            if(task4.isDone() && task5.isDone()){
                try {
                    String task4Result = task4.get();
                    System.out.println(task4Result);

                    String task5Result = task5.get();
                    System.out.println(task5Result);

                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (ExecutionException e) {
                    e.printStackTrace();
                }finally {
                    break;
                }
            }
        }

        long end = System.currentTimeMillis();

        return JsonData.buildSuccess(end - begin);//返回运行时间
    }
~~~

## **Mybaits3.X**

- Mybatis使用流程
  - 创建mybatis-config.xml 全局的配置文件
  - 创建XXXMapper.xml配置文件
  - 创建SqlSessionFactory
  - 用SqlSessionFactory创建SqlSession对象
  - 用SqlSession执行增删改查CRUD

- 添加maven依赖

  ~~~xml
  <dependencies>
          <!-- https://mvnrepository.com/artifact/org.mybatis/mybatis -->
          <dependency>
              <groupId>org.mybatis</groupId>
              <artifactId>mybatis</artifactId>
              <version>3.5.4</version>
          </dependency>
  
          <!-- 使用JDBC链接mysql的驱动-->
          <dependency>
              <groupId>mysql</groupId>
              <artifactId>mysql-connector-java</artifactId>
              <version>8.0.19</version>
          </dependency>
  
  </dependencies>
  ~~~

- 配置mybatis-config.xml

  **Mybatis配置驼峰字段到java类**

  不加可能导致select到的值无法映射到类中的值

  ~~~xml
   <!--下划线自动映射驼峰字段-->
      <settings>
          <setting name="mapUnderscoreToCamelCase" value="true"/>
      </settings>
  ~~~

  **mybatis-config.xml**

  ~~~xml
  <?xml version="1.0" encoding="UTF-8" ?>
  <!DOCTYPE configuration
          PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
          "http://mybatis.org/dtd/mybatis-3-config.dtd">
  <configuration>
      <!--下划线自动映射驼峰字段-->
      <settings>
          <setting name="mapUnderscoreToCamelCase" value="true"/>
      </settings>
      <environments default="development">
          <environment id="development">
              <transactionManager type="JDBC"/>
              <dataSource type="POOLED">
                  <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                  <property name="url" value="jdbc:mysql://127.0.0.1:3306/xdclass_demo?useUnicode=true&amp;characterEncoding=utf-8&amp;useSSL=false&amp;serverTimezone=UTC"/>
                  <property name="username" value="root"/>
                  <property name="password" value=""/>
              </dataSource>
          </environment>
      </environments>
      <mappers>
          <mapper resource="mapper/VideoMapper.xml"/>
      </mappers>
  </configuration>
  ~~~

- 配置VideoMapper.xml

  ~~~xml
  <?xml version="1.0" encoding="UTF-8" ?>
  <!DOCTYPE mapper
          PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
          "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
  
  <mapper namespace="net.xdclass.online_class.dao.VideoMapper">
      <select id="selectById" resultType="net.xdclass.online_class.domain.Video">
      select * from video where id = #{video_id}
    </select>
  
  </mapper>
  ~~~

- 获取参数中的值

  - 注意 ：取java对象的某个值，属性名大小写要一致

  ~~~
  #{value} ： 推荐使用, 是java的名称
  
  ${value} ： 不推荐使用，存在sql注入风险
  ~~~

  

## **Mybatis在控制台打印sql**

- 内置的日志工厂提供日志功能, 使用log4j配置打印sql,添加依赖

  ~~~xml
  <dependency>
      <groupId>org.slf4j</groupId>
      <artifactId>slf4j-log4j12</artifactId>
      <version>1.7.30</version>
  </dependency>
  ~~~

- 在应用的classpath中创建名称为`log4j.properties`的文件

  ![image-20220221153916904](/SSMLearningNotes.assets/image-20220221153916904.png)

  ~~~properties
  log4j.rootLogger=ERROR, stdout
  log4j.logger.net.xdclass=DEBUG
  log4j.appender.stdout=org.apache.log4j.ConsoleAppender
  log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
  log4j.appender.stdout.layout.ConversionPattern=%5p [%t] - %m%n
  ~~~

  

## **Mybatis查询**记录


- 取参数值，具体某个字段的类型，从java类型映射到数据库类型

  - 例子 #{title, jdbcType=VARCHAR}
  - 注意:
    - 多数情况不加是正常使用，但是如果出现报错：无效的列类型，则是缺少jdbcType;
    - 只有当字段可为NULL时才需要jdbcType属性
  - 常见的数据库类型和java列席对比
  
  ~~~
  JDBC Type           Java Type 
  
  CHAR                String 
  VARCHAR             String 
  LONGVARCHAR         String 
  NUMERIC             java.math.BigDecimal 
  DECIMAL             java.math.BigDecimal 
  BIT                 boolean 
  BOOLEAN             boolean 
  TINYINT             byte 
  SMALLINT            short 
  INTEGER             INTEGER 
  INTEGER       		int
  BIGINT              long 
  REAL                float 
  FLOAT               double 
  DOUBLE              double 
  BINARY              byte[] 
  VARBINARY           byte[] 
  LONGVARBINARY       byte[] 
  DATE                java.sql.Date 
  TIME                java.sql.Time 
  TIMESTAMP           java.sql.Timestamp 
  CLOB                Clob 
  BLOB                Blob 
  ARRAY               Array 
  DISTINCT            mapping of underlying type 
  STRUCT              Struct 
  REF                 Ref 
  DATALINK            java.net.URL
  ~~~
  
  

- 模糊查询

  ~~~xml
  <select id="selectByPointAndTitleLike" resultType="net.xdclass.online_class.domain.Video">
  
  select * from video where point=#{point} and title like concat('%', #{title},'%')
  
  </select>
  ~~~

## **Mybatis增加记录**

- 新增一条记录

  - VideoMapper

  ~~~java
  int add(Video video);
  ~~~

  - VideoMapper.xml

  ~~~xml
  <insert id="add" parameterType="net.xdclass.online_class.domain.Video">
  
          INSERT INTO `video`(`title`, `summary`, `cover_img`, `price`, `create_time`, `point`)
          VALUES
          (#{title,jdbcType = VARCHAR},#{summary,jdbcType = VARCHAR},#{coverImg,jdbcType = VARCHAR},#{price,jdbcType = INTEGER},
           #{createTime,jdbcType = TIMESTAMP},#{point,jdbcType = DOUBLE});
  
  
      </insert>
  ~~~

- 新增一条记录并获得自增主键(自动放到类对象里)

  - VideoMapper.xml

    ~~~xml
    <insert id="add" parameterType="net.xdclass.online_class.domain.Video" useGeneratedKeys="true" keyProperty="id" keyColumn="id">
    
            INSERT INTO `video`(`title`, `summary`, `cover_img`, `price`, `create_time`, `point`)
            VALUES
            (#{title,jdbcType = VARCHAR},#{summary,jdbcType = VARCHAR},#{coverImg,jdbcType = VARCHAR},#{price,jdbcType = INTEGER},
             #{createTime,jdbcType = TIMESTAMP},#{point,jdbcType = DOUBLE});
    
    
        </insert>
    ~~~

  - main

    ~~~java
    Video video = new Video();
    video.setTitle("小滴课堂面试专题900道");
    video.setCoverImg("xdclass.net/aaa.png");
    video.setPoint(9.4);
    video.setCreateTime(new Date());
    video.setPrice(9900);
    video.setSummary("这个是面试专题概要");
    
    int rows = videoMapper.add(video);
    System.out.println(rows);
    System.out.println(video.toString());
    ~~~

## Mybatis批量增加记录

- foreach: 用于循环拼接的内置标签，常用于 批量新增、in查询等常见

- ~~~
  包含以下属性：
  collection：必填，值为要迭代循环的集合类型，情况有多种
    入参是List类型的时候，collection属性值为list
    入参是Map类型的时候，collection 属性值为map的key值
  
    item：每一个元素进行迭代时的别名
    index：索引的属性名，在集合数组情况下值为当前索引值，当迭代对象是map时，这个值是map的key
    open：整个循环内容的开头字符串
    close：整个循环内容的结尾字符串
    separator: 每次循环的分隔符
  ~~~

VideoMapper.xml

~~~xml
<insert id="addBatch" parameterType="net.xdclass.online_class.domain.Video">

        INSERT INTO `video`(`title`, `summary`, `cover_img`, `price`, `create_time`, `point`)
        VALUES
        <foreach collection="list" item="video" index="index" separator=",">
            (#{video.title,jdbcType = VARCHAR},#{video.summary,jdbcType = VARCHAR},#{video.coverImg,jdbcType = VARCHAR},#{video.price,jdbcType = INTEGER},
             #{video.createTime,jdbcType = TIMESTAMP},#{video.point,jdbcType = DOUBLE})

        </foreach>

    </insert>
~~~

VideoMapper.java

~~~java
/**
* 批量插入
* @param list
* @return
*/
int addBatch(List<Video>list);
~~~

## Mybatis更新操作

- update 语法更新视频对象

  ~~~xml
  <update id="updateVideo" parameterType="net.xdclass.online_class.domain.Video">
  
          UPDATE `xdclass_demo`.`video`
          SET `title` = #{title,jdbcType = VARCHAR}, `summary` = #{summary,jdbcType = VARCHAR},
              `cover_img` = #{coverImg,jdbcType = VARCHAR}, `price` = #{price,jdbcType = INTEGER},
              `create_time` = #{createTime,jdbcType = TIMESTAMP}, `point` = #{point,jdbcType = DOUBLE}
          WHERE `id` = #{id};
  
      </update>
  ~~~

- 存在其他不想被更新的字段却置为null或者默认值了

## Mybatis更新操作选择性更新标签使用

- 代码（里面包含一个惨痛教训，一定要看pojo类里面的是基本数据类型，还是包装数据类型）

  ~~~xml
  <update id="updateVideoSelective" parameterType="net.xdclass.online_class.domain.Video">
  
  	UPDATE `xdclass_demo`.`video`
  	<trim prefix="SET" suffixOverrides=",">
  		<if test="title != null">`title` = #{title,jdbcType = VARCHAR},</if>
  
  		<if test="summary != null">`summary` = #{summary,jdbcType = VARCHAR},</if>
  
  		<if test="coverImg != null">`cover_img` = #{coverImg,jdbcType = VARCHAR},</if>
  
  		<if test="price != 0">`price` = #{price,jdbcType = INTEGER},</if>
  
  		<if test="createTime!= null">`create_time` = #{createTime,jdbcType = TIMESTAMP},</if>
  		<!-- 特别注意： 一定要看pojo类里面的是基本数据类型，还是包装数据类型-->
  		<if test="point != 0.0">`point` = #{point,jdbcType = DOUBLE},</if>
  
  	</trim>
  
  	WHERE `id` = #{id};
  
  </update>
  ~~~

## **Mybatis删除语法操作**

~~~xml
<delete id="deleteByCreateTimeAndPrice" parameterType="java.util.Map">

 delete from video where create_time <![CDATA[ >= ]]> #{createTime} and price <![CDATA[ >= ]]> #{price}

</delete>
~~~

- 为什么要转义字符:

  - 由于MyBatis的sql写在XML里面， 有些sql的语法符号和xml里面的冲突

  ```
  大于等于 <![CDATA[ >= ]]>
  
  小于等于 <![CDATA[ <= ]]>
  ```

## **Mybatis的mybatis-config.xml常见配置**

- 核心配置文件（dom节点顺序要求，不然报错）

  - 记住常用的，不常用的简单介绍，

  ```
  configuration（配置）
      properties（属性）
      settings（设置）
      typeAliases（类型别名）
      typeHandlers（类型处理器）
      objectFactory（对象工厂）
      plugins（插件，少用）
      environments（环境配置，不配多环境，基本在Spring里面配置）
      environment（环境变量）
        transactionManager（事务管理器）
        dataSource（数据源）
    databaseIdProvider（数据库厂商标识）
    mappers（映射器）
  ```

- 官方文档：https://mybatis.org/mybatis-3/zh/configuration.html#

## **Mybatis的查询类别名typeAlias的使用**

- typeAlias

  - 类型别名，给类取个别名，可以不用输入类的全限定名

  - mybatis-config.xml

    ~~~xml
    <typeAliases>
            
    	<typeAlias type="net.xdclass.online_class.domain.Video" alias="Video"/>
              
    </typeAliases>
    ~~~

- 如果有很多类，使用包扫描即可

  ~~~xml
  <typeAliases>
  
          <package name="net.xdclass.online_class.domain"/>
  
  </typeAliases>
  ~~~

- 本身就内置很多别名，比如Integer、String、List、Map 等

## **Mybatis的sql片段**

- 你是否常用select * 去查询数据库

  - 小项目没问题，高并发项目不推荐这样使用，查询性能低，应该选择需要的字段

- 什么是sql片段

  - 根据业务需要，自定制要查询的字段，并可以复用

    ~~~xml
    <sql id="base_video_field">
    	id,title,summary,cover_img
    </sql>
        
    <select id="selectById" parameterType="java.lang.Integer" resultType="Video">
    
    	select <include refid="base_video_field"/>  from video where id = #       {video_id,jdbcType=INTEGER}
    
    </select>
    
    
    <select id="selectListByXML" resultType="Video">
    
    	select <include refid="base_video_field"/>  from video
    
    </select>
    ~~~

    

## **Mybatis的resultMap**(复杂sql查询)


Mybatis的SQL语句返回结果有两种

- resultType
  - 查询出的字段在相应的pojo中必须有和它相同的字段对应，或者基本数据类型
  - 适合简单查询
- resultMap
  - 需要自定义字段，或者多表查询，一对多等关系，比resultType更强大
  - 适合复杂查询

~~~xml
<resultMap id="VideoResultMap" type="Video">

        <!--
        id 指定查询列的唯一标示
        column 数据库字段的名称
        property pojo类的名称
        -->
	<id column="id" property="id" jdbcType="INTEGER"/>

	<result column="video_title" property="title" jdbcType="VARCHAR"/>
	<result column="summary" property="summary" jdbcType="VARCHAR"/>
	<result column="cover_img" property="coverImg" jdbcType="VARCHAR"/>

</resultMap>

<select id="selectBaseFieldByIdWithResultMap" resultMap="VideoResultMap">

	select id ,title as video_title,summary,cover_img from video where id = #{video_id}

</select>
~~~

## Mybatis 复杂对象一对一查询结果映射之association(复杂sql查询)

- association: 映射到POJO的某个复杂类型属性，比如订单order对象里面包含 user对象

~~~xml
    <resultMap id="videoOrderResultMap" type="VideoOrder">

        <id column="id" property="id"/>

        <result column="user_id" property="userId" jdbcType="INTEGER"/>
        <result column="out_trade_no" property="outTradeNo" jdbcType="VARCHAR"/>
        <result column="state" property="state" jdbcType="INTEGER"/>
        <result column="create_time" property="createTime" jdbcType="TIMESTAMP"/>
        <result column="total_fee" property="totalFee" jdbcType="INTEGER"/>
        <result column="video_id" property="videoId" jdbcType="INTEGER"/>
        <result column="video_title" property="videoTitle" jdbcType="VARCHAR"/>
        <result column="video_img" property="videoImg" jdbcType="VARCHAR"/>
        <!--
            association 配置属性一对一
            property 对应videoOrder里面的user属性名
            javaType 这个属性的类型
        -->
        <association property="user" javaType="User">
            <id column="user_id" property="id"/>

            <result column="name" property="name" jdbcType="VARCHAR"/>
            <result column="pwd" property="pwd" jdbcType="VARCHAR"/>
            <result column="head_img" property="headImg" jdbcType="VARCHAR"/>
            <result column="phone" property="phone" jdbcType="VARCHAR"/>
            <result column="user_create_time" property="createTime" jdbcType="TIMESTAMP"/>
        </association>
    </resultMap>

    <!--一对一管理查询订单，订单内部包含用户属性-->
    <select id="queryVideoOrder" resultMap="videoOrderResultMap">

        select
        o.id id,
        o.user_id,
        o.out_trade_no,
        o.state,
        o.create_time,
        o.total_fee,
        o.video_id,
        o.video_title,
        o.video_img,
        u.name,
        u.pwd,
        u.head_img,
        u.phone,
        u.create_time user_create_time
        from  video_order o left join user u on o.user_id = u.id
    </select>
~~~

main函数

~~~java
VideoOrderMapper videoOrderMapper = sqlSession.getMapper(VideoOrderMapper.class);
List<VideoOrder> list = videoOrderMapper.queryVideoOrder();
System.out.println(list.toString());
~~~

## **Mybatis 复杂对象一对多查询结果映射配置ResultMap的collection**

- collection: 一对多查询结果查询映射，比如user有多个订单

~~~xml
<resultMap id="userOrderResultMap" type="User">
        <id column="user_id" property="id"/>

        <result column="name" property="name" jdbcType="VARCHAR"/>
        <result column="pwd" property="pwd" jdbcType="VARCHAR"/>
        <result column="head_img" property="headImg" jdbcType="VARCHAR"/>
        <result column="phone" property="phone" jdbcType="VARCHAR"/>
        <result column="user_create_time" property="createTime" jdbcType="TIMESTAMP"/>

        <!--
        property 填写pojo类中集合类属性的名称
        ofType 集合里面的pojo对象
        -->
        <collection property="videoOrderList" ofType="VideoOrder">
            <!--配置主键，关联order的唯一标识-->
            <id column="order_id" property="id"/>

            <result column="user_id" property="userId" jdbcType="INTEGER"/>
            <result column="out_trade_no" property="outTradeNo" jdbcType="VARCHAR"/>
            <result column="state" property="state" jdbcType="INTEGER"/>
            <result column="create_time" property="createTime" jdbcType="TIMESTAMP"/>
            <result column="total_fee" property="totalFee" jdbcType="INTEGER"/>
            <result column="video_id" property="videoId" jdbcType="INTEGER"/>
            <result column="video_title" property="videoTitle" jdbcType="VARCHAR"/>
            <result column="video_img" property="videoImg" jdbcType="VARCHAR"/>
        </collection>
        
    </resultMap>
    <select id="queryUserOrder" resultMap="userOrderResultMap">

        select
        u.id,
        u.name,
        u.head_img,
        u.create_time user_create_time,
        u.phone,
        o.id order_id,
        o.user_id,
        o.out_trade_no,
        o.state,
        o.create_time,
        o.total_fee,
        o.video_id,
        o.video_title,
        o.video_img
        from user u left join video_order o on u.id = o.user_id


    </select>
~~~

- 主函数

~~~java
List<User> userList = videoOrderMapper.queryUserOrder();
            System.out.println(userList.toString());
~~~

## Mybatis3.X ResultMap复杂对象查询总结

- 

- association 映射的是一个pojo类，处理一对一的关联关系。
- collection 映射的一个集合列表，处理的是一对多的关联关系。
- 模板

~~~ xml
<!-- column不做限制，可以为任意表的字段，而property须为type 定义的pojo属性-->
<resultMap id="唯一的标识" type="映射的pojo对象">
  <id column="表的主键字段,或查询语句中的别名字段" jdbcType="字段类型" property="映射pojo对象的主键属性" />
  <result column="表的一个字段" jdbcType="字段类型" property="映射到pojo对象的一个属性"/>

  <association property="pojo的一个对象属性" javaType="pojo关联的pojo对象">
    <id column="关联pojo对象对应表的主键字段" jdbcType="字段类型" property="关联pojo对象的属性"/>
    <result  column="表的字段" jdbcType="字段类型" property="关联pojo对象的属性"/>
  </association>

  <!-- 集合中的property 需要为oftype定义的pojo对象的属性-->
  <collection property="pojo的集合属性名称" ofType="集合中单个的pojo对象类型">
    <id column="集合中pojo对象对应在表的主键字段" jdbcType="字段类型" property="集合中pojo对象的主键属性" />
    <result column="任意表的字段" jdbcType="字段类型" property="集合中的pojo对象的属性" />  
  </collection>
</resultMap>
~~~

## **Mybatis一级缓存**

- 什么是缓存
  - 程序经常要调用的对象存在内存中,方便其使用时可以快速调用,不必去数据库或者其他持久化设备中查询，主要就是提高性能
- Mybatis一级缓存
  - 简介：一级缓存的作用域是SQLSession，同一个SqlSession中执行相同的SQL查询(相同的SQL和参数)，第一次会去查询数据库并写在缓存中，第二次会直接从缓存中取
  - 基于PerpetualCache 的 HashMap本地缓存
  - 默认开启一级缓存
- 失效策略：当执行SQL时候两次查询中间发生了增删改的操作，即insert、update、delete等操作commit后会清空该SQLSession缓存; 比如sqlsession关闭，或者清空等

## **Mybatis二级缓存和配置**

- Mybatis二级缓存

  - 简介：二级缓存是namespace级别的，多个SqlSession去操作同一个namespace下的Mapper的sql语句，多个SqlSession可以共用二级缓存,如果两个mapper的namespace相同，（即使是两个mapper，那么这两个mapper中执行sql查询到的数据也将存在相同的二级缓存区域中，但是最后是每个Mapper单独的名称空间）
  - 基于PerpetualCache 的 HashMap本地缓存，可自定义存储源，如 Ehcache/Redis等
  - 默认是没有开启二级缓存
  - 操作流程：第一次调用某个namespace下的SQL去查询信息，查询到的信息会存放该mapper对应的二级缓存区域。 第二次调用同个namespace下的mapper映射文件中，相同的sql去查询信息，会去对应的二级缓存内取结果

- 失效策略：执行同个namespace下的mapepr映射文件中增删改sql，并执行了commit操作,会清空该二级缓存

- 注意：实现二级缓存的时候，MyBatis建议返回的POJO是可序列化的， 也就是建议实现Serializable接口

- 缓存淘汰策略：会使用默认的 LRU （最近最少使用的）算法来收回

- 如何开启某个二级缓存 

  - mapper.xml里面配置

    ~~~xml
    <!--开启mapper的namespace下的二级缓存-->
        <!--
            eviction:代表的是缓存回收策略，常见下面两种。
            (1) LRU,最近最少使用的，一处最长时间不用的对象
            (2) FIFO,先进先出，按对象进入缓存的顺序来移除他们
    
            flushInterval:刷新间隔时间，单位为毫秒，这里配置的是100秒刷新，如果不配置它，当SQL被执行的时候才会去刷新缓存。
    
            size:引用数目，代表缓存最多可以存储多少个对象，设置过大会导致内存溢出
    
            readOnly:只读，缓存数据只能读取而不能修改，默认值是false
        -->
    <cache eviction="LRU" flushInterval="100000" readOnly="true" size="1024"/>
    ~~~

  - mybatis-config.xml里的配置

    ~~~xml
    <!--全局配置：-->
    <settings>
    <!--这个配置使全局的映射器(二级缓存)启用或禁用缓存，全局总开关，这里关闭，mapper中开启了也没用-->
            <setting name="cacheEnabled" value="true" />
    </settings>
    ~~~

- 如果需要控制全局mapper里面某个方法不使用缓存，可以配置 useCache="false"

  ~~~xml
  <select id="selectById" parameterType="java.lang.Integer" resultType="Video" useCache="false">
  
  select <include refid="base_video_field"/>  from video where id = #{video_id,jdbcType=INTEGER}
  
  </select>
  ~~~

- 一级缓存和二级缓存使用顺序

  - 优先查询二级缓存-》查询一级缓存-》数据库

## **Mybatis3.x的懒加载**

- 什么是懒加载： 按需加载，先从单表查询，需要时再从关联表去关联查询，能大大提高数据库性能,并不是所有场景下使用懒加载都能提高效率
- Mybatis懒加载： resultMap里面的association、collection有延迟加载功能

mybatis-config.xml里的配置

~~~xml
<!--全局参数设置-->
<settings>
    <!--延迟加载总开关-->
    <setting name="lazyLoadingEnabled" value="true"/>
    <!--将aggressiveLazyLoading设置为false表示按需加载，默认为true-->
    <setting name="aggressiveLazyLoading" value="false"/>
</settings>
~~~

mapper.xml

~~~xml
<resultMap id="VideoOrderResultMapLazy" type="VideoOrder">
        <id column="id" property="id"/>

        <result column="user_id" property="userId"/>
        <result column="out_trade_no" property="outTradeNo"/>
        <result column="create_time" property="createTime"/>
        <result column="state" property="state"/>
        <result column="total_fee" property="totalFee"/>
        <result column="video_id" property="videoId"/>
        <result column="video_title" property="videoTitle"/>
        <result column="video_img" property="videoImg"/>

<!-- 
select： 指定延迟加载需要执行的statement id 
column： 和select查询关联的字段
-->
        <association property="user" javaType="User" column="user_id" select="findUserByUserId"/>


</resultMap>

    <!--一对一管理查询订单， 订单内部包含用户属性  懒加载-->
<select id="queryVideoOrderListLazy" resultMap="VideoOrderResultMapLazy">

        select
         o.id id,
         o.user_id ,
         o.out_trade_no,
         o.create_time,
         o.state,
         o.total_fee,
         o.video_id,
         o.video_title,
         o.video_img
         from video_order o

</select>
`

<select id="findUserByUserId" resultType="User">

       select  * from user where id=#{id}

</select>
~~~

## **mysql常见的两种存储引擎的区别**

- | 区别项   | Innodb                                  | myisam                   |
  | :------- | :-------------------------------------- | :----------------------- |
  | 事务     | 支持                                    | 不支持                   |
  | 锁粒度   | 行锁，适合高并发                        | 表锁，不适合高并发       |
  | 是否默认 | 默认                                    | 非默认                   |
  | 支持外键 | 支持外键                                | 不支持                   |
  | 适合场景 | 读写均衡,写大于读场景，需要事务         | 读多写少场景，不需要事务 |
  | 全文索引 | 可以通过插件实现, 更多使用ElasticSearch | 支持全文索引             |

- 重点：MyISAM不支持事务，如果需要事务则改为innodb引擎 更改数据库的表里面的引擎

![image-20220224210945098](/SSMLearningNotes.assets/image-20220224210945098.png)

## **mybatis事务控制**

- 为什么原先没进行commit操作，也可以插入成功？
  - 因为原先是myisam引擎,没有事务，直接插入成功
  - innodb引擎有事务，需要commit操作

main函数

~~~java
public class TransactionDemo {

    public static void main(String[] args) throws IOException {

        String resource = "config/mybatis-config.xml";

        //读取配置文件
        InputStream inputStream = Resources.getResourceAsStream(resource);

        //构建session工厂
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        SqlSession sqlSession = sqlSessionFactory.openSession(false);

        //获取session
        try{
            VideoMapper videoMapper = sqlSession.getMapper(VideoMapper.class);

            Video video1 = new Video();
            video1.setTitle("小滴课堂 微服务架构");
            videoMapper.add(video1);
            int i = 1 / 0;
            sqlSession.commit();
        }catch (Exception e){
            e.printStackTrace();
            sqlSession.rollback();
        }
        sqlSession.close();
    }

}
~~~

## **使用 IDEA + Maven + Spring5创建项目**

- 创建项目

  - maven

- 添加依赖

  ~~~xml
      <dependencies>
          <!-- https://mvnrepository.com/artifact/org.springframework/spring-context -->
          <dependency>
              <groupId>org.springframework</groupId>
              <artifactId>spring-context</artifactId>
              <version>5.3.16</version>
          </dependency>
          <!-- https://mvnrepository.com/artifact/org.springframework/spring-core -->
          <dependency>
              <groupId>org.springframework</groupId>
              <artifactId>spring-core</artifactId>
              <version>5.3.16</version>
          </dependency>
          <!-- https://mvnrepository.com/artifact/org.springframework/spring-beans -->
          <dependency>
              <groupId>org.springframework</groupId>
              <artifactId>spring-beans</artifactId>
              <version>5.3.16</version>
          </dependency>
  
  
      </dependencies>
  ~~~

- 添加配置文件applicationContext.xml（helloworld例子）

  - 添加bean配置

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://www.springframework.org/schema/beans
            https://www.springframework.org/schema/beans/spring-beans.xsd">
    
    
        <bean name="video" class="net.xdclass.sp.domain.Video" scope="prototype">
                <property name="name" value="tom"/>
                <property name="id" value="23"/>
        </bean>
    
    </beans>
    ```
    
  - bean标签 id属性：指定Bean的名称，在Bean被别的类依赖时使用

    name属性：用于指定Bean的别名，如果没有id，也可以用name

    class属性：用于指定Bean的来源，要创建的Bean的class类，需要全限定名

- main函数（helloworld例子）

  ~~~java
  public class App {
  
      public static void main(String[] args){
  
          ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
  
          Video video = (Video) applicationContext.getBean("video");
  
          System.out.println(video.toString());
  
      }
  
  }
  ~~~

  

## **spring的依赖注入**

- 什么是DI Dependency Injection ,依赖注入

  IOC容器在运行期间，动态地将对象某种依赖关系注入到对象之中，比如视频订单对象，依赖用视频对象

- applicationContext.xml

  ~~~xml
  <?xml version="1.0" encoding="UTF-8"?>
  <beans xmlns="http://www.springframework.org/schema/beans"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.springframework.org/schema/beans
          https://www.springframework.org/schema/beans/spring-beans.xsd">
  
          <bean id="video" class="net.xdclass.sp.domain.Video">
  
              <property name="id" value="9"/>
              <property name="title" value="Spring 5.x课程"/>
  
          </bean>
  
          <bean id="videoOrder" class="net.xdclass.sp.domain.VideoOrder">
              <property name="id" value="8"/>
              <property name="outTradeNo" value="23432sdasdas"/>
              <property name="video" ref="video"/>
          </bean>
  
  </beans>
  ~~~

- main

  ~~~java
  ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
  
  VideoOrder videoOrder = (VideoOrder) applicationContext.getBean("videoOrder");
  
  System.out.println(videoOrder.toString());
  ~~~

## Spring5.x的bean的scope作用域

- scope属性

  - singleton：单例, 默认值，调用getBean方法返回是同一个对象,实例会被缓存起来，效率比较高 当一个bean被标识为singleton时候，spring的IOC容器中只会存在一个该bean

  ```xml
  <!--<bean id="video" class="net.xdclass.sp.domain.Video" scope="singleton"> -->
  <bean id="video" class="net.xdclass.sp.domain.Video" scope="prototype">
  
          <property name="id" value="9"/>
          <property name="title" value="Spring 5.X课程" />
  
  </bean>
  ```

   

  - prototype: 多例，调用getBean方法创建不同的对象，会频繁的创建和销毁对象造成很大的开销
  - 其他少用 （作用域 只在 WebApplicationContext）
    - request ：每个Http请求都会创建一个新的bean
    - session: 每个Http Session请求都会创建一个新的bean
    - global session（基本不用）

  ```java
   private static  void testScope(ApplicationContext context){
          Video  video1 = (Video)context.getBean("video");
  
          Video  video2 = (Video)context.getBean("video");
  
          //靠匹配内存地址，== 是匹配内存地址
          System.out.println( video1 == video2 );
  
    }
  ```

## **spring的常见的注入方式**

- 使用set方法注入

```xml
<bean id="video" class="net.xdclass.sp.domain.Video" scope="singleton">

        <property name="id" value="9"/>
        <property name="title" value="Spring 5.X课程" />

</bean>
```

- 使用带参的构造函数注入

```xml
<bean id="video" class="net.xdclass.sp.domain.Video" >

	<constructor-arg name="title" value="面试专题课程第一季"></constructor-arg>

</bean>
```

- POJO类型注入(property 没有使用value属性，而是使用了ref属性)

```xml
  <bean id="video" class="net.xdclass.sp.domain.Video" >

        <constructor-arg name="title" value="面试专题课程第一季"></constructor-arg>

    </bean>


    <bean id="videoOrder" class="net.xdclass.sp.domain.VideoOrder" >
        <property name="id" value="8" />
        <property name="outTradeNo" value="23432fnfwedwefqwef2"/>
        <property name="video" ref="video"/>
    </bean>
```

- 注意: 类的构造函数重写的时候，一定要保留空构造函数！！！

## Spring5.X List-Map类型的注入

- 复杂类型注入，添加两个属性

  ~~~xml
  <bean id="video" class="net.xdclass.sp.domain.Video" >
  
          <!--list类型注入-->
          <property name="chapterList">
              <list>
                  <value>第一章SpringBoot</value>
                  <value>第二章Mybatis</value>
                  <value>第三章Spring</value>
              </list>
          </property>
  
          <property name="videoMap">
              <map>
                  <entry key="1" value="SpringCloud课程"></entry>
                  <entry key="2" value="面试课程"></entry>
                  <entry key="3" value="javaweb课程"></entry>
              </map>
          </property>
  </bean>
  ~~~

- 实体类

  ~~~java
  public class Video {
  
      private int id;
  
      private String title;
  
  
      private List<String> chapterList;
  
  
      private Map<Integer,String> videoMap;
  
  //省略set get方法
  }
  ~~~

## **spring里面bean的依赖和继承**

- bean继承：两个类之间大多数的属性都相同，避免重复配置，通过bean标签的parent属性重用已有的Bean元素的配置信息 继承指的是配置信息的复用，和Java类的继承没有关系

~~~xml
<bean id="video" class="net.xdclass.sp.domain.Video" scope="singleton">

        <property name="id" value="9"/>
        <property name="title" value="Spring 5.X课程" />

</bean>


<bean id="video2" class="net.xdclass.sp.domain.Video2" scope="singleton" parent="video">

        <property name="summary" value="这个是summary"></property>

</bean>

~~~

- 属性依赖: 如果类A是作为类B的属性, 想要类A比类B先实例化，设置两个Bean的依赖关系

~~~xml
<bean id="video" class="net.xdclass.sp.domain.Video" scope="singleton">

        <property name="id" value="9"/>
        <property name="title" value="Spring 5.X课程" />

</bean>

<!--设置两个bean的关系，video要先于videoOrder实例化-->

<bean id="videoOrder" class="net.xdclass.sp.domain.VideoOrder" depends-on="video">
        <property name="id" value="8" />
        <property name="outTradeNo" value="23432fnfwedwefqwef2"/>
        <property name="video" ref="video"/>
</bean>
~~~

## spring ioc容器Bean的生命周期的init和destroy方法

~~~ xml
<bean id="video" class="net.xdclass.sp.domain.Video" scope="singleton" init-method="init" destroy-method="destroy">

        <property name="id" value="9"/>
        <property name="title" value="Spring 5.X课程" />

</bean>
~~~

主函数

~~~java
public static void main(String [] args){

  ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");

  Video video = (Video) context.getBean("video");
  System.out.println(video.toString());
  ((ClassPathXmlApplicationContext) context).registerShutdownHook();

}
~~~

结果

![image-20220227104901123](/SSMLearningNotes.assets/image-20220227104901123.png)

## Spring5.x后置处理器 BeanPostProcessor

- 什么是BeanPostProcessor

  - 是Spring IOC容器给我们提供的一个扩展接口
  - 在调用初始化方法前后对 Bean 进行额外加工，ApplicationContext 会自动扫描实现了BeanPostProcessor的 bean，并注册这些 bean 为后置处理器
  - 是Bean的统一前置后置处理而不是基于某一个bean

- 执行顺序

  ```
  Spring IOC容器实例化Bean
  调用BeanPostProcessor的postProcessBeforeInitialization方法
  调用bean实例的初始化方法
  调用BeanPostProcessor的postProcessAfterInitialization方法
  ```

  ![image-20220227124108040](/SSMLearningNotes.assets/image-20220227124108040.png)

- 注意：接口重写的两个方法不能返回null，如果返回null那么在后续初始化方法将报空指针异常或者通过getBean()方法获取不到bean实例对象

CustomBeanPostProcessor.class

~~~java
public class CustomBeanPostProcessor implements BeanPostProcessor,Ordered {

    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {

        System.out.println("CustomBeanPostProcessor1 postProcessBeforeInitialization beanName="+beanName);

        return bean;
    }

    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("CustomBeanPostProcessor1 postProcessAfterInitialization beanName="+beanName);
        return bean;
    }

	//后置处理器优先级
    public int getOrder() {
        return 1;
    }
}
~~~

xml

~~~xml
<bean class="net.xdclass.sp.processor.CustomBeanPostProcessor"/>
~~~

- 可以注册多个BeanPostProcessor顺序
  - 在Spring机制中可以指定后置处理器调用顺序，通过BeanPostProcessor接口实现类实现Ordered接口getOrder方法，该方法返回整数，默认值为 0优先级最高，值越大优先级越低

## **Spring的Bean的自动装配属性autowire**

- 前面学过属性注入，set方法、构造函数等，属于手工注入
- Spring自动注入
  - 使用元素的 autowire 属性为一个 bean 定义指定自动装配模式
  - **autowire**设置值
    - no：没开启
    - byName: 根据bean的id名称，注入到对应的属性里面
    - byType：根据bean需要注入的类型，注入到对应的属性里面
      - 如果按照类型注入，存在2个以上bean的话会抛异常
      - expected single matching bean but found 2
    - constructor: 通过构造函数注入，需要这个类型的构造函数

~~~xml
<!--<bean id="videoOrder" class="net.xdclass.sp.domain.VideoOrder" autowire="byName">-->
<!--<bean id="videoOrder" class="net.xdclass.sp.domain.VideoOrder" autowire="byType">-->
    <bean id="videoOrder" class="net.xdclass.sp.domain.VideoOrder" autowire="constructor">

        <property name="id" value="8" />
        <property name="outTradeNo" value="23432fnfwedwefqwef2"/>
    </bean>
~~~

## **AOP面向切面编程相关核心概念**

- 横切关注点

  - 对哪些方法进行拦截，拦截后怎么处理，这些就叫横切关注点
  - 比如 权限认证、日志、事物

   

- 通知 Advice

  - 在特定的切入点上执行的增强处理，有5种通知，后面讲解
  - 做啥？ 比如你需要记录日志，控制事务 ，提前编写好通用的模块，需要的地方直接调用

   

- 连接点 JointPoint

  - 要用通知的地方，业务流程在运行过程中需要插入切面的具体位置，
  - 一般是方法的调用前后，全部方法都可以是连接点
  - 只是概念，没啥特殊

   

- 切入点 Pointcut

  - 不能全部方法都是连接点，通过特定的规则来筛选连接点, 就是Pointcut，选中那几个你想要的方法
  - 在程序中主要体现为书写切入点表达式（通过通配、正则表达式）过滤出特定的一组 JointPoint连接点
  - 过滤出相应的 Advice 将要发生的joinpoint地方

   

- 切面 Aspect

  - 通常是一个类，里面定义 **切入点+通知** , 定义在什么地方； 什么时间点、做什么事情
  - **通知 advice指明了时间和做的事情（前置、后置等）**
  - **切入点 pointcut 指定在什么地方干这个事情**
  - web接口设计中，web层->网关层->服务层->数据层，每一层之间也是一个切面，对象和对象，方法和方法之间都是一个个切面

   

- 目标 target

  - 目标类，真正的业务逻辑，可以在目标类不知情的条件下，增加新的功能到目标类的链路上

 

- 织入 Weaving
  - 把切面（某个类）应用到目标函数的过程称为织入

 

- AOP代理

  - AOP框架创建的对象，代理就是目标对象的加强
  - Spring中的AOP代理可以使JDK动态代理，也可以是CGLIB代理

- 常见例子

  - 用户下单
    - 核心关注点：创建订单
    - 横切关注点：记录日志、控制事务
  - 用户观看付费视频
    - 核心关注点：获取播放地址
    - 横切关注点：记录日志、权限认证

  ![image-20220227152334302](/SSMLearningNotes.assets/image-20220227152334302.png)

  - 接口业务流程例子

  ~~~java
  //目标类 VideoOrderService； 里面每个方法都是连接点，；切入点是CUD类型的方法，R读取的不作为切入点
  //CRDU全称：增加(Create)、读取查询(Retrieve)、更新(Update)和删除(Delete)
  
  VideoOrderService{
      //新增订单
      addOrder(){ }
      //查询订单
     findOrderById(){}
     //删除订单
     delOrder(){}
     //更新订单
     updateOrder(){}   
  }
  
  
  //权限切面类 = 切入点+通知 
  PermissionAspects{
    
    //切入点  定义了什么地方
      @Pointcut("execution(public int net.xdclass.sp.service.VideoOrderService.*(..))")
    public void pointCut(){}
    
    
    //before 通知 表示在目标方法执行前切入, 并指定在哪个方法前切入
    //什么时候，做什么事情
    @Before("pointCut()")
    public void permissionCheck(){
      
      System.out.println("在 xxx 之前执行权限校验");
    }
    ....
  }
  
  //日志切面类 = 切入点+通知 
  LogAspect{
    
    //切入点  定义了什么地方
      @Pointcut("execution(public int net.xdclass.sp.service.VideoOrderService.*(..))")
    public void pointCut(){}
    
    
    //after 通知 表示在目标方法执行后切入, 并指定在哪个方法前切入
    //什么时候，做什么事情
    @After("pointCut()")
    public void logStart(){
      
      System.out.println("在 xxx 之后记录日志");
    }
    ....
  }
  ~~~

  

## **AOP里面Advice通知的讲解**

- @Before前置通知
  - 在执行目标方法之前运行
- @After后置通知
  - 在目标方法运行结束之后
- @AfterReturning返回通知
  - 在目标方法正常返回值后运行
- @AfterThrowing异常通知
  - 在目标方法出现异常后运行
- @Around环绕通知
  - 在目标方法完成前、后做增强处理 ,环绕通知是最重要的通知类型 ,像事务,日志等都是环绕通知,注意编程中核心是一个ProceedingJoinPoint，需要手动执行 joinPoint.procced()

## AOP的静态代理和动态代理概述

- 什么是代理
  - 为某一个对象创建一个代理对象，程序不直接用原本的对象，而是由创建的代理对象来控制对原对象，通过代理类这中间一层，能有效控制对委托类对象的直接访问，也可以很好地隐藏和保护委托类对象，同时也为实施不同控制策略预留了空间
  - A ->B-> C
- 什么是静态代理
  - 由程序创建或特定工具自动生成源代码，在程序运行前，代理类的.class文件就已经存在
- 什么是动态代理
  - 在程序运行时，运用反射机制动态创建而成，无需手动编写代码
    - JDK动态代理
    - CGLIB动态代理

## AOP**静态代理**

- 什么是静态代理

  - 由程序创建或特定工具自动生成源代码，在程序运行前，代理类的.class文件就已经存在
  - 通过将目标类与代理类实现同一个接口，让代理类持有真实类对象，然后在代理类方法中调用真实类方法，在调用真实类方法的前后添加我们所需要的功能扩展代码来达到增强的目的
  - A -> B -> C

- 优点

  - 代理使客户端不需要知道实现类是什么，怎么做的，而客户端只需知道代理即可
  - 方便增加功能，拓展业务逻辑

- 缺点

  - 代理类中出现大量冗余的代码，非常不利于扩展和维护
  - 如果接口增加一个方法，除了所有实现类需要实现这个方法外，所有代理类也需要实现此方法。增加了代码维护的复杂度

- 例子

  StaticProxyPayServiceImpl类

  ~~~java
  public class StaticProxyPayServiceImpl implements PayService {
  
      private PayService payService;
  
      public  StaticProxyPayServiceImpl(PayService payService){
          this.payService = payService;
      }
  
      public String callback(String outTradeNo) {
  
          System.out.println("StaticProxyPayServiceImpl callback begin");
  
          String result = payService.callback(outTradeNo);
  
          System.out.println("StaticProxyPayServiceImpl callback end");
  
          return result;
      }
  
      public int save(int userId, int productId) {
  
          System.out.println("StaticProxyPayServiceImpl save begin");
  
          int id = payService.save(userId, productId);
  
          System.out.println("StaticProxyPayServiceImpl save end");
  
          return id;
      }
  }
  ~~~

  main函数

  ~~~java
  public class ProxyTest {
  
      public static void main(String[] args){
  
          PayService payService = new StaticProxyPayServiceImpl(new PayServiceImpl());
  
          payService.save(11,22);
  
      }
  
  }
  ~~~

## **AOP的实现的策略JDK动态代理**

- 什么是动态代理
  - 在程序运行时，运用反射机制动态创建而成，无需手动编写代码
  - JDK动态代理与静态代理一样，目标类需要实现一个代理接口,再通过代理对象调用目标方法
- 实操：

定义一个java.lang.reflect.InvocationHandler接口的实现类，重写invoke方法

~~~java
public class JdkProxy implements InvocationHandler {

    private Object targetObject;

    public Object newProxyInstance(Object targetObject){

        this.targetObject = targetObject;

        return Proxy.newProxyInstance(targetObject.getClass().getClassLoader(), targetObject.getClass().getInterfaces(),this);
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {

        Object result = null;

        try {
            System.out.println("通过JDK动态调用 " + method.getName() + ",打印日志 begin");

            result = method.invoke(targetObject,args);

            System.out.println("通过JDK动态调用 " + method.getName() + ",打印日志 end");
        }catch (Exception e){

            e.printStackTrace();

        }

        return result;

    }
}
~~~

main方法

~~~java
public class ProxyTest {

    public static void main(String[] args){
        //Jdk动态代理
        JdkProxy jdkProxy = new JdkProxy();

        //获取代理对象
        PayService payServiceProxy = (PayService) jdkProxy.newProxyInstance(new PayServiceImpl());

        payServiceProxy.callback("Asdasda");

        payServiceProxy.save(111,222);
    }

}
~~~



## AOP的实现策略之CGLib动态代理

- 什么是动态代理
  - 在程序运行时，运用反射机制动态创建而成，无需手动编写代码
  - CgLib动态代理的原理是对指定的业务类生成一个子类，并覆盖其中的业务方法来实现代理

定义一个org.springframework.cglib.proxy.MethodInterceptor接口的实现类，重写intercept方法

~~~java
public class CglibProxy implements MethodInterceptor {

    //目标类
    private Object targetObject;

    //绑定关系
    public Object newProxyInstance(Object targetObject){
        this.targetObject = targetObject;

        Enhancer enhancer = new Enhancer();

        //设置代理类的父类（目标类）
        enhancer.setSuperclass(this.targetObject.getClass());

        //设置回调函数
        enhancer.setCallback(this);

        //创建子类（代理对象）
        return enhancer.create();
    }


    @Override
    public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {

        Object result = null;

        try {
            System.out.println("通过Cglib动态调用 " + method.getName() + ",打印日志 begin");

            result = methodProxy.invokeSuper(o,objects);

            System.out.println("通过Cglib动态调用 " + method.getName() + ",打印日志 end");
        }catch (Exception e){
            e.printStackTrace();
        }

        return result;
    }
}
~~~

main方法

~~~java
public class ProxyTest {

    public static void main(String[] args){
        //CGlib动态代理

        CglibProxy cglibProxy = new CglibProxy();

        PayService payService = (PayService) cglibProxy.newProxyInstance(new PayServiceImpl());

        //调用目标方法
        payService.save(111,222);
    }

}
~~~

## CGLib动态代理和JDK动态代理总结

- 动态代理与静态代理相比较，最大的好处是接口中声明的所有方法都被转移到调用处理器一个集中的方法中处理，解耦和易维护
- 两种动态代理的区别：
  - JDK动态代理：要求目标对象*实现一个接口*，但是有时候目标对象只是一个单独的对象,并没有实现任何的接口,这个时候就可以用CGLib动态代理
  - CGLib动态代理,它是在内存中构建一个子类对象从而实现对目标对象功能的扩展
  - JDK动态代理是自带的，CGlib需要引入第三方包
  - CGLib动态代理基于继承来实现代理，所以无法对final类、private方法和static方法实现代理
- Spring AOP中的代理使用的默认策略：
  - 如果目标对象实现了接口，则默认采用JDK动态代理
  - 如果目标对象没有实现接口，则采用CgLib进行动态代理
  - 但是如果目标对象实现了接口，程序里面依旧可以指定使用CGlib动态代理

## **实战SpringAOP配置日志打印基础准备**

- 需求分析：针对Videoservice接口实现日志打印
- 三个核心包
  - spring-aop：AOP核心功能，例如代理工厂
  - aspectjweaver：简单理解，支持切入点表达式
  - aspectjrt：简单理解，支持aop相关注解
- 定义service接口和实现类

- 定义横切关注点

- 引入相关包

  ~~~xml
  <dependencies>
          <!-- https://mvnrepository.com/artifact/org.springframework/spring-context -->
          <dependency>
              <groupId>org.springframework</groupId>
              <artifactId>spring-context</artifactId>
              <version>5.3.16</version>
          </dependency>
          <!-- https://mvnrepository.com/artifact/org.springframework/spring-core -->
          <dependency>
              <groupId>org.springframework</groupId>
              <artifactId>spring-core</artifactId>
              <version>5.3.16</version>
          </dependency>
          <!-- https://mvnrepository.com/artifact/org.springframework/spring-beans -->
          <dependency>
              <groupId>org.springframework</groupId>
              <artifactId>spring-beans</artifactId>
              <version>5.3.16</version>
          </dependency>
          <dependency>
              <groupId>org.aspectj</groupId>
              <artifactId>aspectjweaver</artifactId>
              <version>1.6.11</version>
          </dependency>
  </dependencies>
  ~~~

- 添加schema

  applicationContext.xml

  ~~~
  <project xmlns="http://maven.apache.org/POM/4.0.0"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  ~~~

- 配置bean和aop

  ~~~xml
  <bean id="timeHandler" class="net.xdclass.sp.aop.TimeHandler"/>
  
  <bean id="videoService" class="net.xdclass.sp.service.VideoServiceImpl"/>
  
  <!--aop配置-->
  <aop:config>
      <!--横切关注点-->
  	<aop:aspect id="timeAspect" ref="timeHandler">
          <!--定义切入点表达式-->
  		<aop:pointcut id="allMethodLogPointCut" expression="execution(* net.xdclass.sp.service.VideoService.*(..))"/>
  		<!--配置前置通知和后置通知-->
  		<aop:before method="printBefore" pointcut-ref="allMethodLogPointCut"/>
  		<aop:after method="printAfter" pointcut-ref="allMethodLogPointCut"/>
      </aop:aspect>
  
  </aop:config>
  ~~~

  

## **spring的使用注解配置项目**

- 开启注解配置和包扫描

VideoService类

~~~java
@Component("videoService")
public class VideoServiceImpl implements VideoService{
    @Override
    public int save(Video video) {
        System.out.println("保存video");
        return 1;
    }

    @Override
    public Video findById(int id) {
        System.out.println("根据id找视频");
        return new Video();
    }
}
~~~

main

~~~java
public class App {

    public static void main(String[] args){

        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();

        context.scan("net.xdclass");

        context.refresh();

        VideoService videoService = (VideoService) context.getBean("videoService");

        videoService.findById(44);

    }
}

~~~

## **spring的xml和注解对比**

- 常用注解
  - bean定义
    - xml方式：
    - 注解方式：@Component 通用组件 细分： @Controller (用于web层) @Service (用于service层) @Repository (用于dao仓库层)
  - bean取名
    - xml方式：通过id或者name
    - 注解方式：@Component("XXXX")
  - bean注入
    - xml方式：通过
    - 注解方式：类型注入@Autowired 名称注入@Qualifier
  - bean生命周期
    - xml方式：init-method、destroy-method
    - 注解方式：@PostConstruct初始化、@PreDestroy销毁

## **@Configuration和@Bean注解的使用**

- @Configuration标注在类上，相当于把该类作为spring的xml配置文件中的，作用为：配置spring容器(应用上下文)

 

- @bean注解：用于告诉方法产生一个Bean对象，然后这个Bean对象交给Spring管理，Spring将会将这个Bean对象放在自己的IOC容器中



- 注意点:SpringIOC容器管理一个或者多个bean，这些bean都需要在@Configuration注解下进行创建

~~~java
@Configuration
public class AppConfig {

    //使用@bean注解，表明这个bean交个spring 进行管理
    // 如果没有指定名称，默认采用 方法名 + 第一个字母小写 作为bean的名称
    @Bean(name = "videoOrderName",initMethod = "init",destroyMethod = "destroy")
    @Scope
    public VideoOrder videoOrder(){
        return new VideoOrder();
    }

}
~~~

## **@PropertySource注解的使用**

- @PropertySource，指定加载配置文件
  - 配置文件映射到实体类
- 使用@Value映射到具体的java属性

~~~java
@Configuration
@PropertySource(value = {"classpath:config.properties"})
public class CustomConfig {

    @Value("${server.host}")
    private String host;

    @Value("${server.port}")
    private int port;

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }
}
~~~

## Spring AOP注解实现(前置、后置通知)

- 声明切面类 @Aspect(切面): 通常是一个类，里面可以定义切入点和通知
- 配置切入点和通知

~~~java
@Component
//告诉spring，这是一个切面类，里面可以定义切入点和通知
@Aspect
public class LogAdvice {

    //切入点表达式
    @Pointcut("execution(* net.xdclass.sp.service.VideoServiceImpl.*(..))")
    public void aspect(){

    }

    //前置通知
    //@Before("aspect()")
    @Before("execution(* net.xdclass.sp.service.VideoServiceImpl.*(..))")
    public void beforeLog(JoinPoint joinPoint){
        System.out.println("LogAdvice beforeLog");
    }

    //后置通知
    @After("aspect()")
    public void afterLog(JoinPoint joinPoint){
        System.out.println("LogAdvice afterLog");
    }

    /**
     * 环绕通知
     */
    @Around("aspect()")
    public void around(JoinPoint joinPoint){

        //通过joinPoint获取调用者的类名
        Object target = joinPoint.getTarget().getClass().getName();
        System.out.println("调用者 = " + target);

        //通过joinPoint获取调用方法名
        System.out.println("调用方法 = " + joinPoint.getSignature());

        //通过joinPoint获取参数
        Object[] args = joinPoint.getArgs();
        System.out.println("参数 = " + args[0]);

        long start = System.currentTimeMillis();
        System.out.println("环绕通知 环绕前");

        //执行连接点的方法
        try {
            ((ProceedingJoinPoint)joinPoint).proceed();
        }catch (Throwable throwable){
            throwable.printStackTrace();
        }
        long end = System.currentTimeMillis();
        System.out.println("环绕通知 环绕后");

        System.out.println("调用方法总耗时 time = " + (end - start) + "ms");

    }
}

~~~

- 开启SpringAOP注解配置

~~~java
@Configuration
@ComponentScan("net.xdclass")
@EnableAspectJAutoProxy  //开启了spring对aspect的支持
public class AnnotationAppConfig {

}
~~~

- 主函数

~~~java
public static void main(String[] args) {

	AnnotationConfigApplicationContext context = new 		AnnotationConfigApplicationContext(AnnotationAppConfig.class);

	VideoService videoService = (VideoService) context.getBean("videoService");

	videoService.findById(2);

}
~~~

## Spring 常见的事务管理-面试常考点

- 事务：多个操作，要么同时成功，要么失败后一起回滚

  - 具备ACID四种特性
    - Atomic（原子性）
    - Consistency（一致性）
    - Isolation（隔离性）
    - Durability（持久性）

   

- 你知道常见的Spring事务管理方式吗

- 编程式事务管理:

  - 代码中调用beginTransaction()、commit()、rollback()等事务管理相关的方法，通过TransactionTempalte手动管理事务(用的少)

- 声明式事务管理:

  - 通过AOP实现，可配置文件方式或者注解方式实现事务的管理控制(用的多)

- 你知道声明式事务管理本质吗：

  本质是对方法前后进行拦截，底层是建立在 AOP 的基础之上

  在目标方法开始之前创建或者加入一个事务，在执行完目标方法之后根据执行情况提交或者回滚事务





## **Spring事务的传播属性和隔离级别**

- 事物传播行为介绍:

  - 如果在开始当前事务之前，一个事务上下文已经存在，此时有若干选项可以指定一个事务性方法的执行行为

    - @Transactional(propagation=Propagation.REQUIRED) 

      如果有事务, 那么加入事务, 没有的话新建一个(默认情况下)(用的多)

    - @Transactional(propagation=Propagation.NOT_SUPPORTED) 

      不为这个方法开启事务

    - @Transactional(propagation=Propagation.REQUIRES_NEW) 

      不管是否存在事务,都创建一个新的事务,原来的挂起,新的执行完毕,继续执行老的事务

    - @Transactional(propagation=Propagation.MANDATORY) 

      必须在一个已有的事务中执行,否则抛出异常(可能用)

    - @Transactional(propagation=Propagation.NEVER) 

      必须在一个没有的事务中执行,否则抛出异常(与Propagation.MANDATORY相反)

    - @Transactional(propagation=Propagation.SUPPORTS)

       如果其他bean调用这个方法,在其他bean中声明事务,那就用事务.如果其他bean没有声明事务,那就不用事务.

    - @Transactional(propagation=Propagation.NESTED) 

      如果当前存在事务，则创建一个事务作为当前事务的嵌套事务来运行； 如果当前没有事务，则该取值等价于Propagation.REQUIRED。

- 事务隔离级别: 是指若干个并发的事务之间的隔离程度

  - @Transactional(isolation = Isolation.READ_UNCOMMITTED) 

    读取未提交数据(会出现脏读, 不可重复读) 基本不使用

  - @Transactional(isolation = Isolation.READ_COMMITTED) 

    读取已提交数据(会出现不可重复读和幻读)

  - @Transactional(isolation = Isolation.REPEATABLE_READ)

     可重复读(会出现幻读)(mysql默认)

  - @Transactional(isolation = Isolation.SERIALIZABLE) 

    串行化(最安全)

   > **脏读**：（同时操作都没提交的读取）
   >
   > 脏读又称无效数据读出。一个事务读取另外一个事务还没有提交的数据叫脏读。
   >
   > 例如：事务T1修改了一行数据，但是还没有提交，这时候事务T2读取了被事务T1修改后的数据，之后事务T1因为某种原因Rollback了，那么事务T2读取的数据就是脏的。
   >
   > **不可重复读**：（同时操作，事务一分别读取事务二操作时和提交后的数据，读取的记录内容不一致）
   >
   > 不可重复读是指在同一个事务内，两个相同的查询返回了不同的结果。
   >
   > 例如：事务T1读取某一数据，事务T2读取并修改了该数据，T1为了对读取值进行检验而再次读取该数据，便得到了不同的结果。 
   >
   > **幻读**：（和可重复读类似，但是事务二的数据操作仅仅是插入和删除，不是修改数据，读取的记录数量前后不一致）
   >
   > 例如：系统管理员A将数据库中所有学生的成绩从具体分数改为ABCDE等级，但是系统管理员B就在这个时候插入（注意时插入或者删除，不是修改））了一条具体分数的记录，当系统管理员A改结束后发现还有一条记录没有改过来，就好像发生了幻觉一样。这就叫幻读。

## SpringBoot-Spring-Mybatsi事务控制讲解

- 快速创建SpringBoot+Spring+Mybatsi项目

  - https://start.spring.io/

- 连接打通数据库

  application.properties

  ```properties
  spring.datasource.driver-class-name =com.mysql.cj.jdbc.Driver
  spring.datasource.url=jdbc:mysql://127.0.0.1:3306/online_xdclass?useUnicode=true&characterEncoding=utf-8&useSSL=false
  spring.datasource.username=root
  spring.datasource.password=
  #使用阿里巴巴druid数据源，默认使用自带的
  #spring.datasource.type =com.alibaba.druid.pool.DruidDataSource
  #开启控制台打印sql
  mybatis.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
  ```

- 多表操作，通过@Transactional控制事务

  - 启动类加注解 @EnableTransactionManagement

    ~~~java
    @SpringBootApplication
    @MapperScan("net.xdclass.demo.mapper")
    @EnableTransactionManagement
    public class DemoApplication {
    
    	public static void main(String[] args) {
    		SpringApplication.run(DemoApplication.class, args);
    	}
    
    }
    ~~~

  - 业务类 加 @Transactional

    UserServiceImpl类

    ~~~java
    @Service
    @Transactional
    public class UserServiceImpl implements UserService {
    
        @Autowired
        private UserMapper userMapper;
    
        @Override
        public int save(User user) {
            userMapper.save(user);
            int i = 1/0;//触发异常
            return 1;
        }
    }
    
    ~~~

    
