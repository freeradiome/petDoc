//Name:JS基础对象库
//Author:zengweiqi
//Mail:zeng444@163.com
(function( window, undefined ) {
   	
    var zeng = (function() {
	 
	 //获取对象
   	  var zeng=function(query,dom,is_sigle)
	  {
		//return document.getElementById(obj);
		var obj = (dom )?dom:document;
		return (is_sigle)? obj.querySelectorAll(query) :obj.querySelectorAll(query);

	  };

		
      //基础功能
	  zeng.addEvent = function(obj,method,fun){
		if(obj.addEventListener){
			obj.addEventListener( method.toLowerCase() ,fun , false );
		}else if(obj.attachEvent){
			obj.attachEvent( 'on'+method.toLowerCase(),fun);
		}
	  };

	  zeng.removeEvent = function(obj,method,fun){
		if(obj.addEventListener){
			obj.removeEventListener(method.toLowerCase(), fun, false);
		}else if(obj.attachEvent){
			obj.detachEvent('on' + method.toLowerCase(), fun);
		}
	  };

	  zeng.msg = function(msg){
		alert(msg);
	  };

	  //浏览器判断
	  zeng.navigator={
	  	is_ie:function(){ return !!window.ActiveXObject },
	  	is_ie6:function(){ return (!-[1,] && !window.XMLHttpRequest)},
	  	is_ie8:function(){ return ( $.navigator.is_ie() && document.documentMode==8 ) },
	  	is_ie9:function(){ return ( $.navigator.is_ie() && document.documentMode==9 ) },
	  	is_ie10:function(){ return ( $.navigator.is_ie() && document.documentMode==10 ) },
	  	is_ie7:function(){  return (  $.navigator.is_ie() && !$.navigator.is_ie6() && (!document.documentMode || document.documentMode==7) ) },
	  	is_ios:function() { return (navigator.platform.indexOf('iPad') != -1 || navigator.platform.indexOf('iPod') != -1 );  },
	  	is_webkit:function(){ return true;},
	  	isAndroid2_3:function(){
			var str=navigator.userAgent;
			if( str.indexOf('Android')!=-1 || str.indexOf('android')!=-1 ){
				var n=str.indexOf('Android')||str.indexOf('android');
				str=str.substring(n);
				str=str.split(';')[0];
				if(str.indexOf('2.3')!=-1){
					return true;	
				}
				else{
					return false;	
				}
				
			}else{
				return false;	
			}
		},
		css_support:function(json){
			var div = document.createElement('div'),succes =  0;
			for(var i=0;i<json.length;i++){
 				if( json[i] in div.style )  succes++;
			}
			return succes;
		}
	};

	  //ajax方法
	  zeng.ajax= (function(obj){
		var e = {init:function(){
			if(obj.ActiveXObject){
				return  new ActiveXObject("Microsoft.XMLHTTP");
			}else if(obj.XMLHttpRequest){
				return  new XMLHttpRequest();
			}
		},
		todo:function(url,json,callback,errback,method,isEval){
			var xmlHttp = e.init(),param =  e.parsBuild(json);
			xmlHttp.onreadystatechange = todo;
			if(method =='post'){
				xmlHttp.open(method.toLowerCase(),url,true);
				xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			}else if(method.toLowerCase()=='get') {
				url +=  e._link(url) +param;param=null;xmlHttp.open(method.toLowerCase(),url,true);
			}
			(param!=null)?xmlHttp.send(param):xmlHttp.send();
			function todo(){
				if(typeof(callback)!='undefined' && xmlHttp.readyState==4 ){
					if(xmlHttp.status==200){
						var data = xmlHttp.responseText;
						data = (isEval===true)? eval('('+data+')'):data;
						callback(data);
					}else if(typeof(errback)!='undefined'){errback()}
				}
			}
		},
		jsonp:function(url,json,callback,server){

			json.callback = server = (server) ? server +Math.ceil(Math.random()*10000) :'callback'+Math.ceil(Math.random()*10000); 
			eval('obj.'+server+'=function(data){callback(data);}');
			
			var url = (url + e._link(url)+e.parsBuild(json)); addheader(url);
			function addheader(url){
				var header = document.getElementsByTagName('head')[0];
				var script = document.createElement('script');
				with(script){
					type="text/javascript";
					src=url;
				}
				header.appendChild(script);
				script.onload=function(){
					// header.removeChild(script);
				}
			}
		},
		_link:function(url){
			var regExp = /\?/;
			return (regExp.test(url))?'&':'?';	 
		},
		parsBuild:function(json){
			function random(){
				var date = new Date(); return 'rid='+date.getTime();
			}
			var str='';
			if( typeof(json)!='object' ) return random();
			for(var key in json){str +=key+'='+ encodeURIComponent(json[key])+'&'}
				return str+=random();
		}
		};
		return {
			ver:'1.34',
			get:function(url,json,callback,errback){e.todo(url,json,callback,errback,'get')},
			post:function(url,json,callback,errback){e.todo(url,json,callback,errback,'post')},
			getJson:function(url,json,callback,errback){e.todo(url,json,callback,errback,'post',true)},
			jsonp:function(url,json,callback,server){e.jsonp(url,json,callback,server)}
		}
	})(window);

	zeng.store = (function(obj){
		function is_support(){
			if(document.body.dataset) return true;	 
		}
		function set(obj,str,value){
			
			if(  is_support() ) {
				obj.dataset[str] = value; 
			}else{

				obj.setAttribute('data-'+str, value); 

			}
			return true;
		}
		function get(obj,str){
			if(  is_support() ) {
				return obj.dataset[str] ;
			}else{
				return obj.getAttribute('data-'+str);
			}
		}
		function remove(obj,str){
			if(  is_support() ) {
				delete(obj.dataset[str]);
			}else{
				obj.removeAttribute('data-'+str);
			}
			return true;
		}

		return {
			get:function(obj,str){ return get(obj,str) },
			set:function(obj,str,value){ return set(obj,str,value) },
			remove:function(obj,str,value){ return remove(obj,str,value) }
		}
	})();

	 
	 
	zeng.cookies=(function(){
		var cookies={
			
			
			//cookies接口
			opt:function(key,value,parm){
				return ( typeof(value)=='undefined' )?cookies.getCookies(key):cookies.setCookies(key,value,parm);
			},
			
			//获取cookies
			getCookies:function(key){
				var cookies= document.cookie.toString();
				eval("var regExp = /\s?"+key+"=(.*?)([;]|$)/;");
				var result = regExp.exec(cookies);
				return (result!=null)?unescape(result[1]):null;
			},
			
			//设置cookies
			setCookies:function(key,value,parm){
				var str = key+"="+escape(value);
				str+= cookies.paeseParm(parm);	
				document.cookie = str; return true;
			},
			
			//删除cookies
			del:function(key,parm){
				
				var str = key + "=";
				 if( typeof( parm )!='undefined' ){
					 parm.expires=-100000;
				 }else{
				 	
					parm={ expires:-100000 }
				 }
				str+= cookies.paeseParm(parm);
				document.cookie =  str; return true;
			},
			
			//解析cookies字串
			paeseParm:function (parm){
				
				var str='';
				if(typeof(parm)!='undefined'){
					if(typeof(parm.expires)!='undefined'){ //设置过期时间
						var date =new Date();
						date.setTime(date.getTime() + parseInt(parm.expires) );
						str += "; expires=" + date.toGMTString();
					}
					if(typeof(parm.path)!='undefined'){str += "; path="+parm.path;} //设置作用路径
					if(typeof(parm.domain)!='undefined'){str+= "; domain="+parm.domain;}//设置作用域
				}
				return str;
			}
			
			
		};
		return {
			ver:1.3,
			opt:function(key,value,parm){return cookies.opt(key,value,parm) },
			del:function(key,parm){ return cookies.del(key,parm)}
		}
	})();

	//easy control josn
	zeng.json = {
		string:function(json){
			return JSON.stringify(json);
		},
		object :function(string){
			return JSON.parse(json);
		}
	},

	//dom对象管理
	zeng.dom = {
		getNextSibling:function(startBrother){
			endBrother=startBrother.nextSibling;
			while(endBrother.nodeType!=1){
				endBrother = endBrother.nextSibling;
			}
			return endBrother;
		},
		getPreviousSibling:function(startBrother){
			
			while(endBrother.nodeType!=1){
				endBrother = endBrother.previousSibling;
			}
			return endBrother;
		},
		insertBefore:function(newdiv,parentnode){
		  (parentnode.children.length==0)?parentnode.appendChild(newdiv): parentnode.insertBefore(newdiv,parentnode.children[0]);
		}   	    
	 };

	zeng.trim = function(string) { return string.replace(/(^(\s|  )*)|((\s|  )*$)/g, ""); };
	zeng.length = function(value){return value.replace(/[^\x00-\xff]/g,"^^").length;};
	  

	zeng.transition = (function(){
		function string2hump(str){
			return str.replace(/\-(\w)/g, function(all, letter){  return letter.toUpperCase(); });
		}
		function _transition(dom,params,time,callback){

			var effect;
			for(var key in params){
				dom.style[string2hump(key)]=params[key][0]; 
				effect =  params[key][2];
			}
			effect = ( effect ) ? effect : 'linear';
			// style = style.join(',');
			style = 'all '+time+'ms '+effect;
			with(dom.style){
				WebkitTransition =style; transition = style;mozTransition = style; msTransition=style;
			}
			dom.focus();
			for(var key in params){ 
				dom.style[string2hump(key)]=params[key][1];  
			}
			setTimeout(function(){
				with(dom.style){ 
						WebkitTransition ='none'; transition = 'none'; msTransition='none'; 
				}
				if(callback) callback();
			},time+20);
			
		}
		return {
			play:function(dom,params,time,callback){
				
				_transition(dom,params,time,callback);
			}
		}

	})();

	  //动画函数
	  zeng.animate= (function(){
		var requestAnimationFrame = window.requestAnimationFrame
		|| window.mozRequestAnimationFrame
		|| window.webkitRequestAnimationFrame
		|| window.msRequestAnimationFrame
		|| window.oRequestAnimationFrame
		|| function(callback) {
		setTimeout(callback, 16);
		}; 
		function cpu(fun,time,callback){
			var start_time = +new Date();
			function todo(fun,time,callback){	
				var loop_time =  +new Date()-start_time;
				var  pos = loop_time/time;
				if(loop_time>=time){
					fun(1);
					if(callback) callback(); return ;
				}
				fun(pos);
				requestAnimationFrame(function(){
					 todo(fun,time,callback)
				});
				
			}
			requestAnimationFrame(function(){	
				todo(fun,time,callback)
			});
		}
		return {
			play:function(fun,time,callback){
				cpu(fun,time,callback)
			}
		} 
			
	 })();

    return zeng;
    })();
   
    window.zeng = window.$ = zeng;
	
})(window);
