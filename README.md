# 学习JavaScript
> 记录JavaScript知识点与遇到的一些问题

## 一、Ajax

​	Ajax(Asynchronous Javascript and XML)，向服务器请求额外的数据而无需加载页面，带来更好的用户体验。	Ajax的核心技术是`XMLHttpRequest`对象（简称xhr）。虽然名字带有XML，但是Ajax通信与数据格式无关；这种技术就是刷新页面即可从服务器取得数据，但不一定是XML数据。

### 1.1 XMLHttpRequest对象

​	IE7+、Fierfox、Chrome和Safari都支持原生的XHR对象，在这些浏览器中创建XHR对象只需像下面这样操作：

​	`var xhr = new XMLHttpRequest();`

#### 1.1.1 XHR的用法

| 方法名                      | 方法介绍 | 参数说明                                                     | 备注                                                         |
| :-------------------------- | -------- | :----------------------------------------------------------- | ------------------------------------------------------------ |
| open(methods, url, isAsync) | 创建请求 | 1、methods表示要发送的请求类型（get、post）<br />2、url表示请求的地址<br />3、isAsync表示是否异步发送请求的布尔值 | 1、调用open方法并不会真正的发送请求，只是启动一个请求以备发送；<br />2、url参数是相对于执行代码的当前页面（当然也可以使用绝对路径） |
| send(data)                  | 发送请求 | data：作为请求主体发送的数据，如果不许要通过请求主体发送数据，则必须要填写`null` |                                                              |

​	用法示例：

```js
var xhr = new XMLHttpRequest();
xhr.open(get,'www.baidu.com',false);
xhr.send(null);
```

​	本次发送的请求是同步的，JavaScript代码将等到服务响应之后再继续执行。在收到响应后，响应的数据会自动填充XHR对象的属性。XHR的属性介绍如下：

- responseText：作为响应主体被返回的文本。
- responseXML：如果响应的内容是"text/xml"或者"application/xml"，这个属性中将保存包含着相应数据的XML DOM文档。
- status：响应的HTTP状态。
- statusText：HTTP状态的说明。

​	在接收到服务器的响应后，首先应该检查status属性，以确定响应是否成功。一般来说，可以将HTTP状态码200作为响应成功的标志，此外304表示浏览器缓存资源可用，也应该作为相映成功来检查。

```js
var xhr = new XMLHttpRequest();
xhr.open(get,'www.baidu.com',false);
xhr.send(null);

if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
    alert(responseText);
}else {
    alert('failure, the reason is :' + statusText)
}
```

​	在大多数情况下，需要发送异步的ajax请求，不能让JavaScript代码因为ajax请求而等待。此时则需要检查readyState属性的值。该属性表示请求/响应过程中的当前活动阶段，该属性可取值如下：

- 0：未初始化。尚未调用open()方法；
- 1：启动。已经调用open()方法，未调用send()方法；
- 2：发送。已调用send()方法，但尚未接收到响应；
- 3：接受。已经接收到部分数据；
- 4：完成。已经接受到全部数据，可以在客户端使用了。

​	每次当readyState属性发生变化的时候，都会触发readstatechange事件。可以利用这个事件来判断ajax的状态。

```js
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if(xhr.readyState == 4) {
        if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            alert(xhr.responseText)
        }else {
            alert('unsuccessful,the reason is :' + status)
        }
    }
};
xhr.open('get','example.txt',true);
xhr.send(null);
```

​	这个例子中在onreadystatechange事件中没有使用this对象，使用了xhr对象，原因是该事件的作用域问题。如果使用this对象，在有的浏览器中会导致函数执行失败，或者导致错误发生。因此，在实际使用中XHR对象实例是较为可靠的一种方式。

#### 1.1.2 HTTP的头部信息

​	每个HTTP请求/响应都会带有头部信息，有些对于开发人员有用，有些没用，XHR也提供了操作这两种头部信息的方法。

​	在默认情况下，在发送XHR请求的同时，还会发送下列头部请求：

- Accept：浏览器能够处理的内容
- Accept-charset：浏览器能够显示的字符集
- Accept-encoding：浏览器能够处理的压缩编码
- Accept-language：浏览器当前设置的语言
- Connection：浏览器与服务之间连接的类型
- Cookie：当前页面设置的任何cookie
- Host：发出请求的页面所在的域
- Referer：发出请求的页面的URI
- User-Agent：浏览器的用户代理字符串

​	虽然不同浏览器发送的头部信息会有所不同，但是以上列出的基本是所有浏览器都会发送的。使用`setRequestHeader(key,value)`方法可以设置自定义的请求头信息。这个方法接受两个参数：头部字段的名称和头部字段的值。要成功发送自定义头部信息，必须在open()方法之后，send()方法之前调用setRe.....()方法

```js
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if(xhr.readyState == 4) {
        if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            alert(xhr.responseText)
        }else {
            alert('unsuccessful,the reason is :' + status)
        }
    }
};

xhr.open('get','example.txt',true);
xhr.setRequestHeader('token',token);
xhr.send(null);
```

​	调用XHR对象的getResponseHeader(key)方法可以获得指定头部字段的值，而getAllResponseHeader()方法则可以取得一个包含所有头部信息的长字符串。

#### 1.1.3 GET请求

​	GET请求最常用于向服务器查询某些信息。必要时可以将查询字符串追加到url末尾，以便将信息发送给服务器。对于XHR来说，查询字符串必须要经过正确的编码才行。

​	使用GET请求经常会发生一个错误，就是查询字符串格式有问题。查询字符串中每个键和值都需要通过`encodeURIComponent()`编码，然后才能追加到url的末尾，并且所有键值对都需要&分割。

​	`xhr.open('get', 'example.php?name1=value1&name2=value2', true);`

​	下面的函数可以辅助我们向现有的url末尾添加查询字符串参数：

```js
function addQueryString(url, name, value) {
    url += (url.indexof('?') == -1 ? '?' : '&');
    url += encodeURIComponent(name) + '=' + encodeURIComponet(value);
    return url;
}

var url = 'example.php';
var name = 'key1';
var value = 'value1';
url = addQueryString(url, name, value);

var xhr = new XMLHttpRequest();
xhr.open('get',url,true);
```

​	在这里使用`addQueryString`函数可以确保查询字符串的格式良好，并可靠地用于XHR对象。

#### 1.1.4 POST请求

​	POST请求通常向服务器发送应该保存的数据。POST请求应该将数据作为请求主体提交，而GET通常不这样做。POST请求主体可以包含非常多的数据，而且格式不限。

​	`xhr.open('post','example.php',true)`

​	发送post请求的第二步就是想send()方法中传入某些数据。可以发送XML DOM文档，也可以发送任何想发送的字符串。

​	默认情况下，服务器对POST请求和Web表单并不会一视同仁。因此，服务器端必须有程序来读取发送过来的原始数据，并从中解析出有用的部分。不过，我们可以使用XHR来模拟表单提交：将Content-Type头部信息设置为application/x-www-form-urlencoded，并以适当的格式创建一个字符串。

```js
function addQueryString(url, name, value) {
    url += (url.indexof('?') == -1 ? '?' : '&');
    url += encodeURIComponent(name) + '=' + encodeURIComponet(value);
    return url;
}

var xhr = new XMLHttpRequest();
xhr.open('post','example.txt',true);
xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
xhr.send('[nuber=10]');
```

