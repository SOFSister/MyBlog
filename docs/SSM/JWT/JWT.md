---
title: JWT原理以及SpringBoot使用
date: '2022-05-07 16:36:00'
sidebar: 'auto'
categories:
 - SSM
tags:
 - SpringBoot
 - JWT
---

**之前在做 SSM 整合项目的时候学习了使用 JWT ，并写在了个人简历上，但是由于对 JWT 始终一知半解，所以面试被问了两次回答得都不够好，所以研究了一波 JWT 是什么以及是如何工作的**

## 1.什么是  JWT

是目前最流行的跨域认证解决方案。它要解决的问题，就是为多种终端设备，提供统一的、安全的令牌格式

说白了就是解决登录问题的一种方案。

## 2.为什么要引入 JWT

### 2.1一般的用户认证流程

![image-20220507095032017](/JWT.assets/image-20220507095032017.png)

### 2.2存在的问题

如果是服务器集群，多台服务器之间需要想办法互通session（例如写入数据库或别的持久层），扩展性比较差。

## 3. JWT 认证流程

![image-20220507101759736](/JWT.assets/image-20220507101759736.png)

## 4. JWT 原理

### 4.1 token的组成

![image-20220507140323573](/JWT.assets/image-20220507140323573.png)

### 4.2 JWT如何保证数据不被篡改

关键就在于令牌签名。服务器分发 token 令牌时，通过密钥用特定的加密算法加密生成令牌签名。服务器在收到 token 令牌时，由于使用了对称加密算法，会对令牌签名进行通过密钥解密，解密后可以对比令牌负载内容是否相同。不同则代表被篡改。

## 5. JTW 的优缺点

### 5.1 优点

1. 服务器不需要再存用户数据到 session，变成了无状态，减轻了服务端压力
2. 由于有令牌签名部分的存在，不容易被客户端篡改数据

### 5.3缺点

1. 由于服务器不保存  session  状态，因此无法在使用过程中废止某个 token，或者更改 token 的权限。也就是说，一旦 JWT 签发了，在到期之前就会始终有效，除非服务器部署额外的逻辑。
2. 令牌负载部分不能存放敏感信息，若要存放需要进行二次加密。

## 6. Spring Boot 中使用 JWT

Controller 层

~~~java
/**
* 登录接口
* @param loginRequest
* @return
*/
@PostMapping("login")
public JsonData login(@RequestBody LoginRequest loginRequest){

	String token = userService.findByPhoneAndPwd(loginRequest.getPhone(),loginRequest.getPwd());

	return token == null ? JsonData.buildError("登陆失败，账号密码错误") : JsonData.buildSuccess(token);
}
~~~

service 层

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

工具类

~~~ java
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import net.xdclass.online_xdclass.model.entity.User;
import java.util.Date;
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
    private static final String SECRET = "feedsheep";

    /**
     * 令牌前缀
     */
    private static final String TOKEN_PREFIX = "feedsheep";


    /**
     * subject
     */
    private static final String SUBJECT = "feedsheep";

    /**
     * 根据用户信息生成令牌
     * @param user
     * @return
     */
    public static String geneJsonWebToken(User user){

        String token = Jwts.builder().setSubject(SUBJECT)
                .claim("head_img",user.getHeadImg())//设置负载
                .claim("id",user.getId())//设置负载
                .claim("name",user.getName())//设置负载
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

拦截器

~~~java
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import net.xdclass.online_xdclass.utils.JWTUtils;
import net.xdclass.online_xdclass.utils.JsonData;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
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

