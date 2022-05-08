---
title: SSM项目终极保姆级别创建过程
date: '2022-05-04 01:16:00'
sidebar: 'auto'
categories:
 - SSM
tags:
 - Spring
 - SpringBoot
 - Mybatis
---
## 打开Spring官网在线创建地址

1. 打开地址：https://start.spring.io/
2. ![image-20220301114912239](/SSMProject.assets/image-20220301114912239.png)
3. 会下载一个压缩包，解压到项目的位置，并用IDEA打开



## 配置依赖

1. 第一次操作会下载很多jar包，耐心等待几分钟。如果下载失败或下载过慢，请检查mevan是否安装、是否更换镜像。

2. 打开pom.xml

   - 如果刚刚创建时选择了依赖，文件内已经存在相关依赖，但是需要删掉一行。

     ![image-20220301120726730](/SSMProject.assets/image-20220301120726730.png)

   - 如果创建时没有选择依赖，则需要手动加入依赖

   - 列举了几个依赖，可以自行添加（也可以去https://mvnrepository.com/search?q=spring自己查）

     - springboot核心包

       ~~~xml
       <dependency>
       	<groupId>org.springframework.boot</groupId>
       	<artifactId>spring-boot-starter-web</artifactId>
       </dependency>
       <dependency>
       	<groupId>org.springframework.boot</groupId>
       	<artifactId>spring-boot-starter-test</artifactId>
       	<scope>test</scope>
       	<exclusions>
       		<exclusion>
       			<groupId>org.junit.vintage</groupId>
       			<artifactId>junit-vintage-engine</artifactId>
       		</exclusion>
       	</exclusions>
       </dependency>
       ~~~

     - mybaits依赖

       ~~~xml
       <dependency>
             <groupId>org.mybatis.spring.boot</groupId>
             <artifactId>mybatis-spring-boot-starter</artifactId>
             <version>2.1.2</version>
       </dependency>
       ~~~

     - mysql驱动 (注意需要去掉runtime，否则报错)

       ~~~xml
       <dependency>
             <groupId>mysql</groupId>
             <artifactId>mysql-connector-java</artifactId>
       </dependency>
       ~~~

     - 通用工具包

       ~~~xml
       <dependency>
             <groupId>org.apache.commons</groupId>
             <artifactId>commons-lang3</artifactId>
             <version>3.9</version>
       </dependency>
       ~~~

     - 跨域身份验证解决方案 Json web token包

       ~~~xml
       <!-- JWT相关 -->
       <dependency>
             <groupId>io.jsonwebtoken</groupId>
             <artifactId>jjwt</artifactId>
             <version>0.7.0</version>
       </dependency>
       ~~~

     - 高性能缓存组件

       ~~~xml
       <!--guava依赖包-->
       <dependency>
             <groupId>com.google.guava</groupId>
             <artifactId>guava</artifactId>
             <version>19.0</version>
       </dependency>
       ~~~

     - Lombok
       
        ```xml
        <dependency>
        	<groupId>org.projectlombok</groupId>
        	<artifactId>lombok</artifactId>
        </dependency>
        ```

## 项目结构

1. 添加包

   ![image-20220301134012560](/SSMProject.assets/image-20220301134012560.jpg)

2. 添加实体类

   ![image-20220301142837290](/SSMProject.assets/image-20220301142837290.png)

## 连通数据库

1. 添加数据库配置

   ![image-20220301150103263](/SSMProject.assets/image-20220301150103263.png)

   ~~~properties
   server.port=8081
   
   #==============================数据库相关配置========================================
   spring.datasource.driver-class-name =com.mysql.cj.jdbc.Driver
   spring.datasource.url=jdbc:mysql://127.0.0.1:3306/online_xdclass?useUnicode=true&characterEncoding=utf-8&useSSL=false
   spring.datasource.username=root
   spring.datasource.password=
   #使用阿里巴巴druid数据源，默认使用自带的
   #spring.datasource.type =com.alibaba.druid.pool.DruidDataSource
   #开启控制台打印sql
   mybatis.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
   
   # mybatis 下划线转驼峰配置,两者都可以
   #mybatis.configuration.mapUnderscoreToCamelCase=true
   mybatis.configuration.map-underscore-to-camel-case=true
   #配置扫描
   mybatis.mapper-locations=classpath:mapper/*.xml
   #配置xml的结果别名
   mybatis.type-aliases-package=net.xdclass.online_xdclass.domain
   ~~~

2. 配置扫描mapper路径

   ![image-20220301153106352](/SSMProject.assets/image-20220301153106352.png)

   ~~~java
   @SpringBootApplication
   @MapperScan("net.xdclass.online_xdclass.mapper")
   public class OnlineXdclassApplication {
   
   	public static void main(String[] args) {
   		SpringApplication.run(OnlineXdclassApplication.class, args);
   	}
   
   }
   ~~~

3. mapper包添加接口类，resources下的mapper文件夹内新建xml配置文件

   ![image-20220301154107775](/SSMProject.assets/image-20220301154107775.png)

   接口类

   ~~~java
   public interface VideoMapper {
   
       /**
        * 视频列表查询
        * @return
        */
       List<Video> listVideo();
   
   }
   ~~~

   xml配置文件

   ~~~xml
   <?xml version="1.0" encoding="UTF-8" ?>
   <!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
   <mapper namespace="net.xdclass.online_xdclass.mapper.VideoMapper">
       
       <select id="listVideo" resultType="Video">
   
           select * from video;
   
       </select>
       
   </mapper>
   ~~~

4. service包内添加接口类，service包内添加impl包，impl包内继承实现接口类

   ![image-20220301154259008](/SSMProject.assets/image-20220301154259008.png)

   接口类

   ~~~java
   public interface VideoService {
   
       List<Video> listVideo();
   
   }
   ~~~

   继承实现接口类

   ~~~java
   @Service
   public class VideoServiceImpl implements VideoService {
   
       @Autowired
       private VideoMapper videoMapper;
   
   
       @Override
       public List<Video> listVideo() {
           return videoMapper.listVideo();
       }
   }
   
   ~~~

5. controller包内添加controller类

   ![image-20220301170210311](/SSMProject.assets/image-20220301170210311.png)

   controller类

   ~~~java
   @RestController
   @RequestMapping("video")
   public class VideoController {
   
       @Autowired
       private VideoService videoService;
   
       @RequestMapping("list")
       public Object listVideo(){
   
           return videoService.listVideo();
   
       }
   }
   ~~~

6. 连通测试（测试controller的接口是否正确）

   ![image-20220301170542597](/SSMProject.assets/image-20220301170542597.png)

 

## 连通redis

添加配置application.properties

~~~properties
server.port=8088
spring.redis.host=192.168.44.128
#Redis服务器连接端口
spring.redis.port=6379
#Redis服务器连接密码（默认为空）
spring.redis.password=
#连接池最大连接数（使用负值表示没有限制）
spring.redis.pool.max-active=8
#连接池最大等待阻塞时间（使用负值表示没有限制）
spring.redis.pool.max-wait=-1
#连接池中最大空闲连接
spring.redis.pool.max-idle=8
#连接池中最小空闲连接
spring.redis.pool.min-idle=0
#连接超时时间
spring.redis.timeout=30000
~~~

添加工具类

~~~java
@Slf4j
@Component
public class CacheService {
    @Autowired
    private StringRedisTemplate redisTemplate;

    private final String DEFAULT_KEY_PREFIX = "";
    private final int EXPIRE_TIME = 1;
    private final TimeUnit EXPIRE_TIME_TYPE = TimeUnit.DAYS;


    /**
     * 数据缓存至redis
     *
     * @param key
     * @param value
     * @return
     */
    public <K, V> void add(K key, V value) {
        try {
            if (value != null) {
                redisTemplate
                        .opsForValue()
                        .set(DEFAULT_KEY_PREFIX + key, JSON.toJSONString(value));
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException("数据缓存至redis失败");
        }
    }

    /**
     * 数据缓存至redis并设置过期时间
     *
     * @param key
     * @param value
     * @return
     */
    public <K, V> void add(K key, V value, long timeout, TimeUnit unit) {
        try {
            if (value != null) {
                redisTemplate
                        .opsForValue()
                        .set(DEFAULT_KEY_PREFIX + key, JSON.toJSONString(value), timeout, unit);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException("数据缓存至redis失败");
        }
    }

    /**
     * 写入 hash-set,已经是key-value的键值，不能再写入为hash-set
     *
     * @param key    must not be {@literal null}.
     * @param subKey must not be {@literal null}.
     * @param value  写入的值
     */
    public <K, SK, V> void addHashCache(K key, SK subKey, V value) {
        redisTemplate.opsForHash().put(DEFAULT_KEY_PREFIX + key, subKey, value);
    }

    /**
     * 写入 hash-set,并设置过期时间
     *
     * @param key    must not be {@literal null}.
     * @param subKey must not be {@literal null}.
     * @param value  写入的值
     */
    public <K, SK, V> void addHashCache(K key, SK subKey, V value, long timeout, TimeUnit unit) {
        redisTemplate.opsForHash().put(DEFAULT_KEY_PREFIX + key, subKey, value);
        redisTemplate.expire(DEFAULT_KEY_PREFIX + key, timeout, unit);
    }

    /**
     * 获取 hash-setvalue
     *
     * @param key    must not be {@literal null}.
     * @param subKey must not be {@literal null}.
     */
    public <K, SK> Object getHashCache(K key, SK subKey) {
        return  redisTemplate.opsForHash().get(DEFAULT_KEY_PREFIX + key, subKey);
    }


    /**
     * 从redis中获取缓存数据，转成对象
     *
     * @param key   must not be {@literal null}.
     * @param clazz 对象类型
     * @return
     */
    public <K, V> V getObject(K key, Class<V> clazz) {
        String value = this.get(key);
        V result = null;
        if (!StringUtils.isEmpty(value)) {
            result = JSONObject.parseObject(value, clazz);
        }
        return result;
    }

    /**
     * 从redis中获取缓存数据，转成list
     *
     * @param key   must not be {@literal null}.
     * @param clazz 对象类型
     * @return
     */
    public <K, V> List<V> getList(K key, Class<V> clazz) {
        String value = this.get(key);
        List<V> result = Collections.emptyList();
        if (!StringUtils.isEmpty(value)) {
            result = JSONArray.parseArray(value, clazz);
        }
        return result;
    }

    /**
     * 功能描述：Get the value of {@code key}.
     *
     * @param key must not be {@literal null}.
     * @return java.lang.String
     * @date 2021/9/19
     **/
    public <K> String get(K key) {
        String value;
        try {
            value = redisTemplate.opsForValue().get(DEFAULT_KEY_PREFIX + key);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException("从redis缓存中获取缓存数据失败");
        }
        return value;
    }

    /**
     * 删除key
     */
    public void delete(String key) {
        redisTemplate.delete(key);
    }

    /**
     * 批量删除key
     */
    public void delete(Collection<String> keys) {
        redisTemplate.delete(keys);
    }

    /**
     * 序列化key
     */
    public byte[] dump(String key) {
        return redisTemplate.dump(key);
    }

    /**
     * 是否存在key
     */
    public Boolean hasKey(String key) {
        return redisTemplate.hasKey(key);
    }

    /**
     * 设置过期时间
     */
    public Boolean expire(String key, long timeout, TimeUnit unit) {
        return redisTemplate.expire(key, timeout, unit);
    }

    /**
     * 设置过期时间
     */
    public Boolean expireAt(String key, Date date) {
        return redisTemplate.expireAt(key, date);
    }


    /**
     * 移除 key 的过期时间，key 将持久保持
     */
    public Boolean persist(String key) {
        return redisTemplate.persist(key);
    }

    /**
     * 返回 key 的剩余的过期时间
     */
    public Long getExpire(String key, TimeUnit unit) {
        return redisTemplate.getExpire(key, unit);
    }

    /**
     * 返回 key 的剩余的过期时间
     */
    public Long getExpire(String key) {
        return redisTemplate.getExpire(key);
    }
}
~~~



 ## 有可能用到的用法

### -API权限路径规划

/api/版本/权限/AA/BB格式

~~~
/api/v1/pub/AA/BB 公开接口（不需要登录即可访问）
/api/v1/pri/AA/BB 私有接口（需要登录才能访问）
~~~

### -jsondata工具类

~~~java
package net.xdclass.online_xdclass.utils;
public class JsonData {
    /**
     * 状态码 0表示成功,1表示处理中,-1表示失败
     */
    private Integer code;

    /**
     * 业务数据
     */
    private Object data;

    /**
     * 信息描述
     */
    private String msg;

    public JsonData(){}

    public JsonData(Integer code,Object data,String msg){

        this.code = code;

        this.data = data;

        this.msg = msg;
    }

    /**
     * 成功，不用返回数据
     * @return
     */
    public static JsonData buildSuccess(){
        return new JsonData(0,null,null);
    }

    /**
     * 成功，返回数据
     * @param data
     * @return
     */
    public static JsonData buildSuccess(Object data){
        return new JsonData(0,data,null);
    }

    /**
     * 失败，返回固定状态码和错误信息
     * @param msg
     * @return
     */
    public static JsonData buildError(String msg){
        return new JsonData(-1,null,msg);
    }

    /**
     * 失败，返回自定义状态码和错误信息
     * @param code
     * @param msg
     * @return
     */
    public static JsonData buildError(Integer code,String msg){
        return new JsonData(code,null,msg);
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
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
}

~~~

### -项目热部署

配置步骤

1. pom文件添加依赖包

   ~~~xml
    <dependency>  
            <groupId>org.springframework.boot</groupId>  
            <artifactId>spring-boot-devtools</artifactId>  
            <optional>true</optional>  
     </dependency>
     
     
     <build>
           <plugins>
               <plugin>
                   <groupId>org.springframework.boot</groupId>
                   <artifactId>spring-boot-maven-plugin</artifactId>
                   <configuration>
                       <fork>true</fork><!--必须添加这个配置-->
                   </configuration>
               </plugin>
           </plugins>
       </build>
   ~~~

2. settings配置

   ![image-20220302171243975](/SSMProject.assets/image-20220302171243975.png)

   ![image-20220302171333006](/SSMProject.assets/image-20220302171333006.png)

   

### -全局异常捕捉

~~~java
@ControllerAdvice
public class CustomExceptionHandler {

    private final static Logger logger = LoggerFactory.getLogger(CustomExceptionHandler.class);

    @ExceptionHandler(value = Exception.class)
    @ResponseBody
    public JsonData handle(Exception e){

        logger.error("[ 系统异常 ]{}",e);

        return JsonData.buildError("全局异常，未知错误");

    }

}
~~~



### -注册MD5密码加密工具类

~~~java
public class CommonUtils {

    /**
     * MD5加密工具类
     * @param data
     * @return
     */
    public static String MD5(String data)  {
        try {
            java.security.MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] array = md.digest(data.getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder();
            for (byte item : array) {
                sb.append(Integer.toHexString((item & 0xFF) | 0x100).substring(1, 3));
            }

            return sb.toString().toUpperCase();
        } catch (Exception exception) {
        }
        return null;

    }

}
~~~

### -登录检验解决方案 JWT

- 什么是JWT

  - JWT 是一个开放标准，它定义了一种用于简洁，自包含的用于通信双方之间以 JSON 对象的形式安全传递信息的方法。 可以使用 HMAC 算法或者是 RSA 的公钥密钥对进行签名
  - **简单来说: 就是通过一定规范来生成token，然后可以通过解密算法逆向解密token，这样就可以获取用户信息**
  - 优点
    - 生产的token可以包含基本信息，比如id、用户昵称、头像等信息，避免再次查库
    - 存储在客户端，不占用服务端的内存资源
  - 缺点
    - token是经过base64编码，所以可以解码，因此token加密前的对象不应该包含敏感信息，如用户权限，密码等
    - 如果没有服务端存储，则不能做登录失效处理，除非服务端改秘钥

- JWT格式组成 头部、负载、签名

  - header+payload+signature
    - 头部：主要是描述签名算法
    - 负载：主要描述是加密对象的信息，如用户的id等，也可以加些规范里面的东西，如iss签发者，exp 过期时间，sub 面向的用户
    - 签名：主要是把前面两部分进行加密，防止别人拿到token进行base解密后篡改token

- 关于jwt客户端存储

  - 可以存储在cookie，localstorage和sessionStorage里面

- 操作步骤

  1、pom.xml加入相关依赖

  ~~~xml
  <!-- JWT相关 -->
  <dependency>
  	<groupId>io.jsonwebtoken</groupId>
  	<artifactId>jjwt</artifactId>
  	<version>0.7.0</version>
  </dependency>
  ~~~

  2、添加 JWT 工具类

  ~~~java
  /**
  
   * 注意点：
   * 1、生成的token，是可以通过base64进行解密出明文信息
   * 2、base64进行解密出明文信息，修改再进行编码，则会解密失败
   * 3、无法作废已颁布的token，除非改密钥
   */
  public class JWTUtils {
  
      /**
       * 过期时间 一周
       */
      private static final long EXPIRE = 60000 * 60 * 24 * 7;//过期时间 一周
  
      /**
       * 加密密钥
       */
      private static final String SECRET = "xdclass.net168";
  
      /**
       * 令牌前缀
       */
      private static final String TOKEN_PREFIX = "xdclass";
  
  
      /**
       * subject
       */
      private static final String SUBJECT = "xdclass";
  
      /**
       * 根据用户信息生成令牌
       * @param user
       * @return
       */
      public static String geneJsonWebToken(User user){
  
          String token = Jwts.builder().setSubject(SUBJECT)
                  .claim("head_img",user.getHeadImg())
                  .claim("id",user.getId())
                  .claim("name",user.getName())
                  .setIssuedAt(new Date())//设置创建时间
                  .setExpiration(new Date(System.currentTimeMillis() + EXPIRE))//设置过期时间
                  .signWith(SignatureAlgorithm.HS256,SECRET)//设置加密方法和密钥
                  .compact();
  
          token = TOKEN_PREFIX + token;
  
          return token;
      }
  
      /**
       * 校验token的方法
       * @param token
       * @return
       */
      public static Claims checkJWT(String token){
  
          try {
  
              final Claims claims = Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token.replace(TOKEN_PREFIX,"")).getBody();
  
              return claims;
  
          }catch (Exception e){
              return null;
          }
  
      }
  
  }
  
  ~~~

  3、controller层

  ~~~java
  @PostMapping("login")
  public JsonData login(@RequestBody LoginRequest loginRequest){
  
  	String token = userService.findByPhoneAndPwd(loginRequest.getPhone(),loginRequest.getPwd());
  
  	return token == null ? JsonData.buildError("登陆失败，账号密码错误") : JsonData.buildSuccess(token);
  }
  ~~~

  4、service层

  ~~~java
  @Override
  public String findByPhoneAndPwd(String phone, String pwd) {
  
  	User user = userMapper.findByPhoneAndPwd(phone,CommonUtils.MD5(pwd));
  
  	if(user == null){
  
  		return null;
  
  	}else{
  		String token = JWTUtils.geneJsonWebToken(user);
  		return token;
  	}
  
  }
  ~~~

### -编写登录拦截器

![image-20220308120534686](/SSMProject.assets/image-20220308120534686.png)

1. 创建拦截器LoginInterceptor

   ~~~java
   public class LoginInterceptor implements HandlerInterceptor {
   
       /**
        * 进入到controller之前的方法
        * @param request
        * @param response
        * @param handler
        * @return
        * @throws Exception
        */
       @Override
       public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
   
           try {
               String accessToken = request.getHeader("token");
               if(accessToken == null){
                   accessToken = request.getParameter("token");
               }
   
               if(StringUtils.isNotBlank(accessToken)){
                   Claims claims = JWTUtils.checkJWT(accessToken);
   
                   if(claims == null){
                       //告诉登录过期，重新登录
                       sendJsonMessage(response, JsonData.buildError("登录过期，重新登录"));
                       return false;
                   }
                   Integer id = (Integer) claims.get("id");
                   String name = (String) claims.get("name");
   
                   request.setAttribute("user_id",id);
                   request.setAttribute("name",name);
   
                   return true;
               }
           }catch (Exception e){
               //登陆失败
               e.printStackTrace();
   
           }
           sendJsonMessage(response, JsonData.buildError("登录过期，重新登录"));
           return false;
       }
   
       /**
        * 响应json数据给前端
        * @param response
        * @param obj
        */
       public static void sendJsonMessage(HttpServletResponse response,Object obj){
   
           try {
   
               ObjectMapper objectMapper = new ObjectMapper();
               response.setContentType("application/json; charset=utf-8");
               PrintWriter writer = response.getWriter();
               writer.print(objectMapper.writeValueAsString(obj));
               writer.close();
               response.flushBuffer();
   
           }catch (Exception e){
               e.printStackTrace();
           }
   
       }
   
       @Override
       public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
           HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
       }
   
       @Override
       public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
           HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
       }
   }
   ~~~

2. 创建拦截器配置类

   ~~~java
   @Configuration
   public class InterceptorConfig implements WebMvcConfigurer {
   
       @Override
       public void addInterceptors(InterceptorRegistry registry) {
   
           registry.addInterceptor(loginInterceptor()).addPathPatterns("/api/v1/pri/*/**")
                   .excludePathPatterns("/api/v1/pri/user/register","/api/v1/pri/user/login");
   
           WebMvcConfigurer.super.addInterceptors(registry);
       }
   
       @Bean
       public LoginInterceptor loginInterceptor(){
           return new LoginInterceptor();
       }
   
   }
   
   ~~~

   

### -开启事务

1. 在启动类添加注解@EnableTransactionManagement
2. 业务类，或者业务方法 @Transactional

### -调整返回Json格式

- 避免驼峰式

  ~~~java
  @JsonProperty("out_trade_no")
  private String outTradeNo;
  ~~~

- 日期格式化

  ~~~java
  @JsonProperty("create_time")
  @JsonFormat(pattern = "yyyy:MM:dd HH:mm:ss",timezone = "GMT+8")
  private Date createTime;
  ~~~

### -谷歌开源缓存框架Guava Cache使用

1. 添加依赖

   ~~~xml
   <!--guava依赖包-->
   <dependency>
   	<groupId>com.google.guava</groupId>
   	<artifactId>guava</artifactId>
   	<version>19.0</version>
   </dependency>
   ~~~

2. 添加工具类

   ~~~java
   @Component
   public class BaseCache {
   
       private Cache<String,Object> tenMinuteCache = CacheBuilder.newBuilder()
   
               //设置缓存初始大小，应该合理设置，后续会扩容
               .initialCapacity(10)
               //最大值
               .maximumSize(100)
               //并发数设置
               .concurrencyLevel(5)
   
               //缓存过期时间，写入后10分钟过期
               .expireAfterWrite(600, TimeUnit.SECONDS)
   
               //统计缓存命中率
               .recordStats()
   
               .build();
   
       private Cache<String,Object> oneHourCache = CacheBuilder.newBuilder()
   
               //设置缓存初始大小，应该合理设置，后续会扩容
               .initialCapacity(10)
               //最大值
               .maximumSize(100)
               //并发数设置
               .concurrencyLevel(5)
   
               //缓存过期时间，写入后1小时过期
               .expireAfterWrite(3600, TimeUnit.SECONDS)
   
               //统计缓存命中率
               .recordStats()
   
               .build();
   
       public Cache<String, Object> getOneHourCache() {
           return oneHourCache;
       }
   
       public void setOneHourCache(Cache<String, Object> oneHourCache) {
           this.oneHourCache = oneHourCache;
       }
   
       public Cache<String, Object> getTenMinuteCache() {
           return tenMinuteCache;
       }
   
       public void setTenMinuteCache(Cache<String, Object> tenMinuteCache) {
           this.tenMinuteCache = tenMinuteCache;
       }
   
   }
   
   ~~~

3. 添加配置类

   ![image-20220309104420463](/SSMProject.assets/image-20220309104420463.png)
   
3. 使用

   ~~~java
   @Service
   public class VideoServiceImpl implements VideoService {
   
       @Autowired
       private VideoMapper videoMapper;
   
       @Autowired
       private BaseCache baseCache;
   
       @Override
       public List<Video> listVideo() {
   
           try {
               //先去本地缓存里找
               Object cacheObj = baseCache.getTenMinuteCache().get(CacheKeyManager.INDEX_VIDEO_LIST,()->{
   
                   //回调 本地缓存内没有找到，去数据库找
                   List<Video> videoList = videoMapper.listVideo();
   
                   return videoList;
   
               });
   
               if(cacheObj instanceof List){
   
                   List<Video> videoList = (List<Video>) cacheObj;
   
                   return videoList;
   
               }
           } catch (ExecutionException e) {
               e.printStackTrace();
           }
   
           return null;
       }
   
       @Override
       public List<VideoBanner> listVideoBanner() {
   
           try {
               //先去本地缓存里找
               Object cacheObj = baseCache.getTenMinuteCache().get(CacheKeyManager.INDEX_BANNER_KEY,()->{
   
                   //回调 本地缓存内没有找到，去数据库找
                   List<VideoBanner> bannerList = videoMapper.listVideoBanner();
   
                   return bannerList;
   
               });
   
               if(cacheObj instanceof List){
   
                   List<VideoBanner> bannerList = (List<VideoBanner>) cacheObj;
   
                   return bannerList;
   
               }
           } catch (ExecutionException e) {
               e.printStackTrace();
           }
   
           return null;
       }
   
       @Override
       public Video findDetailById(int videoId) {
   
           String videoCacheKey = String.format(CacheKeyManager.VIDEO_DETAIL,videoId);
   
           try {
               //先去本地缓存里找
               Object cacheObj = baseCache.getOneHourCache().get(videoCacheKey,()->{
   
                   //回调 本地缓存内没有找到，去数据库找
                   Video video = videoMapper.findDetailById(videoId);
   
                   return video;
   
               });
   
               if(cacheObj instanceof Video){
   
                   Video video = (Video) cacheObj;
   
                   return video;
   
               }
           } catch (ExecutionException e) {
               e.printStackTrace();
           }
   
           return null;
       }
   
   
   }
   
   ~~~
   

### -接口压力测试apache-jmeter步骤

1. 打开E:\apache-jmeter-5.4.3\apache-jmeter-5.4.3\bin，运行jmeter.bat

2. 添加线程组![image-20220309113418580](/SSMProject.assets/image-20220309113418580.png)

3. 添加http请求

   ![image-20220309113508761](/SSMProject.assets/image-20220309113508761.png)

4. 添加结果树

   ![image-20220309113601943](/SSMProject.assets/image-20220309113601943.png)

5. 添加聚合报告

   ![image-20220309113630168](/SSMProject.assets/image-20220309113630168.png)

6. 线程组内进行设置

   ![image-20220309113720753](/SSMProject.assets/image-20220309113720753.png)

7. http内进行设置

   ![image-20220309113822619](/SSMProject.assets/image-20220309113822619.png)

8. 保存并启动查看聚合报告

   ![image-20220309113930010](/SSMProject.assets/image-20220309113930010.png)

### -开启跨域配置

1. 添加跨域拦截器

   ~~~java
   public class CorsInterceptor implements HandlerInterceptor {
       @Override
       public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
   
           //表示接受任意域名的请求,也可以指定域名
           response.setHeader("Access-Control-Allow-Origin", request.getHeader("origin"));
   
           //该字段可选，是个布尔值，表示是否可以携带cookie
           response.setHeader("Access-Control-Allow-Credentials", "true");
   
           response.setHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS");
   
           response.setHeader("Access-Control-Allow-Headers", "*");
   
           if(HttpMethod.OPTIONS.toString().equals(request.getMethod())){
               return  true;
           }
           return true;
       }
   
       @Override
       public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
           HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
       }
   
       @Override
       public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
           HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
       }
   }
   
   ~~~

2. 添加拦截器配置

   ~~~java
   @Configuration
   public class InterceptorConfig implements WebMvcConfigurer {
   
       @Override
       public void addInterceptors(InterceptorRegistry registry) {
   
           /**
            * 添加全局跨域拦截器配置
            */
           registry.addInterceptor(corsInterceptor()).addPathPatterns("/**");
   
           registry.addInterceptor(loginInterceptor()).addPathPatterns("/api/v1/pri/*/**")
                   .excludePathPatterns("/api/v1/pri/user/register","/api/v1/pri/user/login");
   
           WebMvcConfigurer.super.addInterceptors(registry);
       }
   
       @Bean
       public LoginInterceptor loginInterceptor(){
           return new LoginInterceptor();
       }
   
       @Bean
       public CorsInterceptor corsInterceptor(){return new CorsInterceptor();}
   
   }
   
   ~~~

   


## 打包项目

### -后端项目打包

~~~
mvn clean install package '-Dmaven.test.skip=true'
~~~

### -前端项目打包

~~~
cnpm run build
~~~



## 部署项目

### -后端

1. 将jar包放入/usr/local/software/api内
2. 在api文件夹内添加application.properties

3. 启动jar包

   ~~~
   nohup java -jar -Despring.config.location=./application.properties online_xdclass-0.0.1-SNAPSHOT.jar &
   ~~~

4. 测试接口

   ~~~
   curl 127.0.0.1:8081/api/v1/pub/video/list_banner
   ~~~

### -前端

1. 将dist文件夹放入/usr/local/software/front_end内

2. 进入

   ~~~
   cd /usr/local/nginx/
   ~~~

3. ~~~
   cd conf/
   ~~~

4. 配置nginx

   ~~~
   vim nginx.conf
   ~~~

   找到dist全路径名

   ![image-20220502151320576](/SSMProject.assets/image-20220502151320576.png)

   ~~~
   cd /usr/local/software/front_end/dist/
   pwd
   ~~~

   ![image-20220502151410576](/SSMProject.assets/image-20220502151410576.png)

   保存退出

5. 重启nginx服务

   ~~~
   cd ../sbin/
   ./nginx -s reload
   ~~~









