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
xhr.send(serialize(form)); // serialize(form)为表单序列化函数。
```

### 1.2 XMLHttpRequest 2级

> 并非所有浏览器都实现了XMLHttpRequest 2级规范，但是所有浏览器都实现了它规定的部分。

#### 1.2.1 FormData

​	FormData用于表单序列化以及创建与表单格式相同的数据。可以用其替代表单序列化函数。

```js
var data = new FormData();
data.append('name','Nichoals');
```

​	这个append()方法接受两个参数：键和值。分别对应表单字段的名字和字段所包含的值。可以像这样添加任意多个键值对。而通过想FormData构造函数中传入表单元素，也可以用表单元素的数据预先向其中填入键值对。

```js
var data = new FormData(document.forms[0]);
```

​	创建了FormData的实例后，可以直接将其传给XHR的send()方法，如下：

```js
var xhr = new XMLHttpRequest();
xhr.onreadtstatechange = function(){
    if(xhr.readystate == 4) {
        if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
            alert(xhr.reponseText);
        }else {
            alert('unsuccessful!');
        }
    }
}
xhr.open('post','example.php',true);
var form = document.querySelector('form');
xhr.send(new FormData(form));
```

​	使用FormData的方便之处在于不必设置请求头部信息，XHR对象能够识别传入的数据是FormData的实例，并自动适配适当的头部信息。

#### 1.2.2 超时设定

​	当给XHR对象设置timeout属性时，如果请求在规定的ms内没有返回，则会终止请求，同时出发timeout事件，进而调用ontimeout事件处理程序。

```js
var xhr = new XMLHttpRequest();
xhr.onreadtstatechange = function(){
    if(xhr.readystate == 4) {
        try{
            if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                alert(xhr.reponseText);
            }else {
                alert('unsuccessful!');
        }
        }catch (e){
            // 由ontimeout事件处理程序处理
        }
    }
}
xhr.open('post','example.php',true);
xhr.timeout = 2000;
xhr.ontimeout = function(){
    alert('Request did not return in two second.')
}
var form = document.querySelector('form');
xhr.send(new FormData(form));
```

​	在这个示例中，将timeout设置为2000，意味着请求在2s内还没有返回，就会自动终止。请求终止时会调用ontimeout事件处理程序。但此时readyState可能已经变为4了，如果程序中了再调用status属性，就会发生错误。为了避免浏览器报错，可将检查status的代码片段放入try-catch语句中。（IE8+）

#### 1.2.3 overrideMimeType()方法

​	该方法用于重写XHR响应的MIME类型。

```js
var xhr = new XMLHttpRequest();
xhr.open('get','example.php',true);
xhr.overrideMimeType('text/xml');
xhr.send(null);
```

​	这个例子强迫XHR对象将响应作为XML而非纯文本来处理。调用overrideMimeType()方法必须在send()方法之前，才能保证重写响应的Mime类型。

### 1.3 进度事件

6个进度事件

- loadstart：在接受响应数据的第一个字节时触发。
- progress：在接受响应期间持续不断地触发。
- error：在请求时发生错误时触发。
- abort：在因为调用abort()方法而终止时触发。
- load：在接受到完整的相应数据时触发。
- loadend：在通信完成或者触发error、abort或load事件后触发。

#### 1.3.1 load事件

​	load事件可以替代readystatechange事件。响应接受完毕后将触发load事件，因此也就没必要检查readyState属性了。onload事件处理程序会接收到一个event对象，其target属性就指向XHR对象实例，因而可以访问到XHR对象的所有方法和属性。

​	然而，并非所有浏览器都为这个事件实现了适当的实践对象。因此，开发人员仍需继续是有XHR对象变量。

```js
var xhr = new XMLHttpRequest();
xhr.onload = function() {
    if((xhr.status>=200 && xhr.status < 300) || xhr.status == 304) {
        // 成功操作
    }else {
        // 失败操作
    }
}
xhr.open('get', 'example.php', true);
xhr.send(null);
```

​	只要浏览器接收到服务器的响应，不管其状态如何，都会触发load事件。而这意味着你必须要检查status属性，才能确定数据是否真的已经可用了。

#### 1.3.2 progress事件

​	该事件会在浏览器接收新数据的时候触发。而onprogress事件处理程序会接受到一个event对象，其target属性是XHR对象，但包含其他三个属性：

- lengthComputable：表示进度信息是否可用的布尔值
- position：表示已经接收的字节数
- totalSize：表示根据Content-Type响应头部确定的预期字节数

可以通过该属性实现一个进度指示器：

```js
var xhr = new XMLHttpRequest();
xhr.onload = function() {
    if((xhr.status>=200 && xhr.status < 300) || xhr.status == 304) {
        // 成功操作
    }else {
        // 失败操作
    }
}
xhr.onprogress = function(event) {
    let divStatus = document.querySelector('status');
    if(event.lengthComputable) {
        divStatus.innerHTML = "Recieved" + event.positon + "of" + event.totalSize + "bytes";
    }
}
xhr.open('get', 'example.php', true);
xhr.send(null);
```

​	为确保正确执行，必须在open()方法之前添加onprogress事件处理程序。

### 1.4 跨域资源共享

​	通过XHR实现Ajax通信的一个主要限制，来源于跨域安全策略。默认情况下，XHR对象只能访问与包含它的页面位于同一个域中的资源。这种安全策略可以预防某些恶意行为。但是实现合理的跨域也是至关重要的。

​	CORS(Cross-Origin Resource Sharing，跨域资源共享)，其背后思想是使用自定义的HTTP的头部信息让浏览器与服务器进行沟通，从而决定请求或响应是否成功。

​	比如一个简单GET或POST请求，他没有自定义的头部，而主体内容是text/plain，在发送请求时，需要给他额外附加一个Origin头部，其中包含请求页面的源信息（协议、域名和端口号），以便服务器决定是否给予响应。下面是Origin头部的一个实例：

```http
Origin: http://www.nczonline.net
```

​	如果服务器认为这个请求可以接受，就在Access-Control-Allow-Origin头部会发相同的源信息（如果是公共资源，可以回发“*”）。例如：

```http
Access-Control-Allow-Origin: http://www.nczonline.net
```

​	如果没有这个头部信息，或者有但是源信息不匹配，浏览器就会驳回请求。正常情况下，浏览器会处理请求。**注意，请求和响应都不会包含cookie信息。**

#### 1.4.1 IE对CORS的实现

​	IE8中引入了XDR(XDomainRequest)类型。这个类型与XHR类似，但是可以实现安全可靠的跨域通信。以下是XDR与XHR不同的地方：

- cookie不会随请求发送，也不会随着响应返回。
- 只能设置请求头的Content-Type属性。
- 不能访问响应头部信息。
- 只支持GET和POST请求。

​	这些变化使得CSRF(Cross-Site Request Forgery，跨站点请求伪造)和XSS(Cross-site Scripting，跨站点脚本)的问题得到了缓解。

​	XDR对象的使用方法与XHR也非常相似。需要创建一个XDomainRequest的实例，调用open()方法，再调用send()方法。但是XDR对象的open()方法只有两个参数：请求的类型和URL。

​	所有XDR对象的请求都是异步的，不能用它来创建同步请求。请求返回之后会触发load事件，响应的数据也会保存在responseText属性中，如下所示：

```js
var xdr = new XDomainRequest();
xdr.onload = function(){
    alert(xdr.responseText);
}
xdr.open('get','example.php');
xdr.send(null);
```

​	在接收到响应之后，你只能访问响应的原始文本，无法访问响应的状态码。而且，只要响应有效就会触发load事件，如果失败（包括响应中缺少Access-Contorl-Allwo-Origin头部信息）就会触发error事件。但是除了错误本身就没有其他信息可以使用了，所以只能确定是否有错误发生。如果要检测错误，如下所示：

```js
var xdr = new XDomainRequest();
xdr.onload = function() {
	alert(xdr.responseText);
}
xdr.onerror = function() {
    alert('an error occurred');
}
xdr.open('get','example.php');
xdr.send(null);
```

​	与XHR对象相同，XDR对象也支持**timeout**属性以及**ontimeout**事件处理程序。

​	此外，为了配合POST请求，XDR对象可以通过**ContentType**属性设置发送数据的类型。

#### 1.4.2 其他浏览器对CORS的实现

​	除了IE外的所有浏览器都通过XMLHttpRequest对象实现了对CORS的原生支持。在尝试打开不同源的资源时，无需额外编写代码就可以触发这个行为。要请求位于另一个域中的资源，使用标准的XHR对象并在open()方法中传入绝对URL即可，例如：

```js
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if(xhr.readyState == 4) {
        if(xhr.status == 200) {
            alert(xhr.responseText);
        }else {
            alert('Unsuccessfully!');
        }
    }
}
xhr.open('get','http://other-origin-site.com/user',true);
xhr.send(null);
```

​	与IE浏览器中的XDR对象不同的是，跨域XHR对象可以访问status和statusText属性，还支持同步请求。跨域XHR也有一些限制：

- 不能使用setRequestHeader()设置自定义响应头。
- 不能发送和接受cookie。
- 调用getAllResponseHeaders()方法总是返回空字符串。

​	由于无论是同源请求还是跨域请求都是用相同的接口，因此对于本地资源，最好使用相对的URL，在访问远程的资源时使用绝对的URL。这样可以消除歧义，避免出现限制访问头部或本地cookie信息等问题。

#### 1.4.3 Preflighted Request

CORS通过名为preflighted Request的透明服务器验证机制，支持开发人员使用自定义头部、GET和POST以外的方法以及不同类型的主题内容。在使用以下高级选项来发送请求时，就会向服务器发送一个preflight请求，这种请求使用OPTIONS方法。

- Origin：与简单的请求相同。
- Access-Control-Request-Method：请求自身使用的方法。
- Access-Control-Request-Headers：（可选）自定义的头部信息，多个头部以逗号分割。

​	以下是带有自定义头部ChicKo的使用POST方法的请求：

```http
Origin: http://www.github.com/ChicKo1108
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Chicko
```

​	发送这个请求后，服务器可以决定是否允许这种类型的请求：

- Access-Control-Allow-Origin：与简单的请求相同。
- Access-Control-Allow-Methods：允许的方法，多个方法以逗号分割。
- Access-Control-Allow-Headers：允许的头部，多个头部以逗号分隔。
- Access-Control-Max-Age：应该将这个Preflight请求缓存多长时间（以秒表示）

```http
Access-Control-Allow-Origin: http://www.github.com/ChicKo1108
Access-Control-Allow-Methods: POST, GET
Access-Control-Allow-Headers: Chicko
Access-Control-Max-Age: 60*60*24*7 
```

​	**IE10以及更早版本不支持Preflight请求。**

#### 1.4.4 带凭证的请求

​	默认情况下，跨域的请求不提供凭证（cookie、HTTP认证以及SSL客户端证明等）。可以通过将withCredentials属性设置为true，指定某个请求发送凭证。如果服务器接收带凭证的请求，会用下面的HTTP头部来响应请求。

```http
Access-Control-Allow-Credentials: true
```

​	如果发送了带凭证的请求，但是服务器的响应中没有包含这个头部，name浏览器不会将响应交给JavaScript，于是，responseText是空字符串，status的值是0，而且会调用onerror()事件处理程序。

​	**IE10以及更早版本不支持该属性。**

