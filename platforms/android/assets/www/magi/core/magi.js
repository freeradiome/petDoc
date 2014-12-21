//Name:Magi
//Author:zengweiqi
//Descreption: mini handphone js-framework of MVC-SPA for luohu-wifi;
//Mail:zeng444@163.com
(function(window, $) {

	var dojob = (function() {

		//set and get http get query
		var query = (function() {
			function build_http_query(array) {
				var str = '';
				for (var i in array) {
					if (i != 'job') str += '&' + i + '=' + encodeURIComponent(array[i]);
				}
				return str;
			}
			return {
				change_locaton_address: function(_class, _method, _query,_without_history) {

					if( history.replaceState ){
						var _query = build_http_query(_query);
						var location_url = "?job="+_class+'#'+_method+_query;
						var route = ( _class+'#'+_method+ _query ).replace('&','?');
						var state = {  title : document.title, url : location_url,route:route};
						if( _without_history ){
							history.replaceState(state, document.title, location_url);
						}else{
							history.pushState(state, document.title, location_url);
						}
					    window.onpopstate = function(event){
					       if(event && event.state){
					            magi.route.url(event.state.route,'none',false,true);
					        }
					        return false;
					    }
					}
				},
				//获取http string中的query,len决定是否带dojob的方法
				get_in_url: function(url,len) {

					var regEx = /\?(.*)/i;
					var query_array = regEx.exec(url);

					if (query_array) {
						var _GET,query_array = query_array[1].split('&');
						if( query_array.length >len ){
							_GET = new Array();
							for (var i = 0; i < query_array.length; i++) {
								var key_val = query_array[i].split('=');

								_GET[key_val[0]] = decodeURIComponent(key_val[1]);
							}
						}

					}

					return _GET;
				},
				get: function(_class,_method,len) {

					var url = window.location.href;
					var regEx = /job=([\d\w\-\_]+)#([\d\w\-\_]+)/i;
					var route = regEx.exec(url);
					var _query = query.get_in_url(window.location.href,len);

					if (route) {
						if (route[1] && route[2]) {
							_class = route[1];
							_method = route[2];

						}
					}
					return {
						_class: _class,
						_method: _method,
						_query: _query
					}
				}

			}

		})();

		//playground S.P.A loading 
		var playground = (function() {
			return {

				//隐藏浏览器
				hidden_browser_address: function() {
					document.body.scrollTop = 1;
				},
				//create a safe div prevent quick click
				create_safe_transition_end: function(obj) {
					//创建一个蒙板防止误点
					var fobid_click = document.createElement('div');
					fobid_click.style.width = '100%';
					fobid_click.style.height = '100%';
					fobid_click.style.position = 'absolute';
					fobid_click.style.left = '0px';
					fobid_click.style.Zindex = '1000';
					fobid_click.style.top = '0px';
					if($.navigator.is_ie()){
						fobid_click.style.background = "#fff";
						fobid_click.style.filter = 'alpha(opacity=0)';
					}else{
						fobid_click.style.background =  "rgba(0,0,0,0)";
					}
					return obj.appendChild(fobid_click);
				},

				//create parent playground
				create: function(idname, parent) {
					// alert(define.app_playground_obj)
					var ground = document.createElement('div');
					ground.id = idname;
					ground.style.position = 'relative';
					var mask = document.createElement('div');
					mask.id = idname + '_mask';
					ground.appendChild(mask);
					((parent) ? parent : document.body).appendChild(ground);
				},
				/*
				 * page loading with transition
				 * _effect : opacity swipeleft swapright swaptop swapbottom
				 */
				load: function(_class, _method, _query, _effect, _construct, _callback) {

					var page_group_obj = $('#' + define.playground_name)[0]; //page contenter: contenter >contenter mask >page
					var page_mask_name = define.playground_name + '_mask'; //new page's parentNode named mask
					var page_mask_obj = $('#' + page_mask_name)[0]; //contenter mask
					var append_page_name = dojob.route.page_name(_class, _method, _query); //new page id name
					page_group_obj.style.overflowX = 'hidden';
					page_mask_obj.style.width = '100%';
					// page_group_obj.style.minHeight = '100%';
					// page_mask_obj.style.minHeight = '100%';
					if (!window._this) { //frist page
						var page = document.createElement('div');
						page.style.minHeight = '100%';
						page.id = '_blank';
						page_mask_obj.appendChild(page);

						dojob.effect.none(append_page_name, page, page_mask_obj, page_group_obj, _construct, _callback);
					} else { //switch page
						if (!$('#' + append_page_name)[0]) {
							_effect = (_effect && _effect!='undefined') ? _effect : define.default_page_effection;
							eval('var effect_fun = dojob.effect.' + _effect);
							if (effect_fun) {
								
								effect_fun(append_page_name, window._this, page_mask_obj, page_group_obj, _construct, _callback);
							} else {
								dojob.effect.none(append_page_name, window._this, page_mask_obj, page_group_obj, _construct, _callback);
							}
						}
					}

				}

			}

		})();
		var browser_init = (function() {

			return {

				/* if ie browser not support to do*/
				browser_not_support: function() {

					if ($.navigator.is_ie() && !$.navigator.is_ie10() ) {
						$('body')[0].innerHTML = ('<div style="margin:15px;"><h2>Magi js-framework ' + dojob.ver + '</h2><span>Notice:This framework do not  support absolute browser ,you can try to webkit or mozila browser<br />if you want get more infomation you can mail to:<a href="mailto:zeng444@163.com">zeng444@163.com</a></span></div>');
						return true;
					}
					//initialize browser css and some
					window.view_page_cache = new Array();
					dojob.cache.if_not_supurt_to_do();
				}
			}

		})();

		/*define config*/
		var define = {
			is_mvc:true,
			view_path: 'themes/',
			module_path: 'model/',
			controller_path: 'controller/',
			default_controller: 'index',
			default_action: 'index',
			app_playground_obj: '',
			playground_name: 'contenter',
			ajax_tip_class: '_ajax_loading',
			default_page_effection: 'swipeleft',	 
			is_header_footer_transition_fixed: true,
			default_query: {},
			allow_browser_url_change: true,
			is_use_tpl_cache:false,
			tpl_rule:'{$class}.{$method}.html',
			extend_utility: [],
			default_controller_construct:undefined
		};


		return {

			/*version */
			ver: 'alpha0.3.2',

			//display in waiting for loading
			loading: {
				init: function() {
					if (define.ajax_tip_class == 'none') return false;
					var obj = $('#' + define.ajax_tip_class)[0];
					if (!obj) {
						var div = document.createElement('div');
						div.id = define.ajax_tip_class;
						div.className = define.ajax_tip_class;
						div.style.position = 'fixed';
						document.body.appendChild(div);
						div.style.left =  (document.body.clientWidth/2) - (div.clientWidth/2)+ 'px';
					} else {
						obj.style.display = 'block';
					}
				},
				close: function() {
					if (define.ajax_tip_class == 'none') return false;
					var obj = $('#' + define.ajax_tip_class)[0];
					if (obj) obj.style.display = 'none';
				}
			},
		 

			url:{
				get:function(){
					return query.get('','',0);
				}
			},

			//validate data
			validate: {
				is_number: function(value) {
					value = unescape(value);
					return (!isNaN(value) && value != '')
				}, //是否为数字
				is_string: function(value) {
					value = unescape(value);
					return (isNaN(value) && value != '')
				}, //是否为字符串
				is_mail: function(value) {
					value = unescape(value);
					var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
					return (reg.test(value))
				}, //是否是邮件
				is_mobile: function(value) {
					value = unescape(value);
					var reg = /^[1][\d][\d]{9}$/;
					return (reg.test(value))
				}, //是否是手机号码
				is_tel: function(value) {
					value = unescape(value);
					var reg = /^(\+\d{1,3}(\-|\s){1})?(\d{3,4}(\-|\s){1})?\d{7,8}((\-|\s){1}\d{1,4})?$/;
					return (reg.test(value))
				}, //是否座机
				is_zipcode: function(value) {
					value = unescape(value);
					return (value.length == 6 && validate.is_number(value))
				}, //是否为邮政编码
				is_zhcn: function(value) {
					value = unescape(value);
					var reg = /^[\u4e00-\u9fa5]+$/;
					return (reg.test(value))
				}, //是否为中文
				is_idcard: function(value) {
					value = unescape(value);
					var reg = /^[\d]{17}[A-Za-z]{1}$|^[\d]{18}$|^[\d]{15}$/;
					return (reg.test(value))
				}
			},


			effect: {
				config: {
					time:100,
					opacity_time: 400,
					spread_time: 300,
					flip_time:700
				},
				/**
				 * _ground_obj
				 * _mask_obj
				 * _absolute_page_obj 当前页对象
				 * _append_name 添加的场景名，可利用 dojob.effect.appendPage(_append_name,_mask_obj); 添加
				 */
				none: function(_append_name, _absolute_page_obj, _mask_obj, _ground_obj, _construct, _callback) {
					// if(_construct ) _construct(_absolute_page_obj);
					var append_page_obj = document.createElement('div');
					append_page_obj.id = _append_name;
					_mask_obj.appendChild(append_page_obj);
					_absolute_page_obj.parentNode.removeChild(_absolute_page_obj);
					if (_callback) _callback(_append_name);
				},
				/**
				 * _ground_obj
				 * _mask_obj
				 * _absolute_page_obj 当前页对象
				 * _append_name 添加的场景名，可利用 dojob.effect.appendPage(_append_name,_mask_obj); 添加
				 */
				opacity: function(_append_name, _absolute_page_obj, _mask_obj, _ground_obj, _construct, _callback) {
					//add  a page
					var append_page_obj = document.createElement('div');
					append_page_obj.id = _append_name;
					var fobid_click = playground.create_safe_transition_end(_ground_obj);
					_mask_obj.appendChild(append_page_obj);
					append_page_obj.style.width = '100%';
					append_page_obj.style.position = 'absolute';
					append_page_obj.style.Zindex = '900';
					append_page_obj.style.left = '0px';
					append_page_obj.style.top = '0px';
					// append_page_obj.style.minHeight = '100%';
					$.transition.play(append_page_obj, {
						opacity: ['0', '1.0', 'ease']
					}, dojob.effect.config.opacity_time);
					$.transition.play(_absolute_page_obj, {
						opacity: ['1.0', '0', 'ease']
					}, dojob.effect.config.opacity_time);
					setTimeout(function() {
						append_page_obj.style.position = 'static';
						if (_callback) _callback(_append_name);
						if (fobid_click) _ground_obj.removeChild(fobid_click);
						if (_absolute_page_obj) _absolute_page_obj.parentNode.removeChild(_absolute_page_obj);
					}, dojob.effect.config.opacity_time);
				},
				flip:function(_append_name, _absolute_page_obj, _mask_obj, _ground_obj, _construct, _callback) {
					
					 if (_construct) _construct(_absolute_page_obj);
					var fobid_click = playground.create_safe_transition_end(_ground_obj);
	

					_mask_obj.style.position='relative';
					_mask_obj.style.webkitTransformStyle = 'preserve-3d';
					_mask_obj.style.transformStyle = 'preserve-3d';

					_mask_obj.style.webkitPerspectiveOrigin = '50% 40px 0';

					_mask_obj.style.webkitTransform = 'rotateY(0deg)';
					_mask_obj.style.transform = 'rotateY(0deg)';
					_mask_obj.style.height = _absolute_page_obj.scrollHeight + 'px';

					_absolute_page_obj.style.position = "absolute";
					_absolute_page_obj.style.left = '0px';
					_absolute_page_obj.style.top = '0px';

					_absolute_page_obj.style.webkitBackfaceVisibility="hidden";
					_absolute_page_obj.style.mozBackfaceVisibility="hidden";
					_absolute_page_obj.style.backfaceVisibility="hidden";
					
					_absolute_page_obj.style.webkitTransform="rotateY(0deg)";
					_absolute_page_obj.style.mozTransform="rotateY(0deg)";
					_absolute_page_obj.style.transform="rotateY(0deg)";

					var append_page_obj = document.createElement('div');
					append_page_obj.id = _append_name;
					append_page_obj.style.position = "absolute";
					append_page_obj.style.left = '0px';
					append_page_obj.style.top = '0px';

					append_page_obj.style.webkitBackfaceVisibility="hidden";
					append_page_obj.style.mozBackfaceVisibility="hidden";
					append_page_obj.style.backfaceVisibility="hidden";

					append_page_obj.style.webkitTransform="rotateY(180deg)";
					append_page_obj.style.mozTransform="rotateY(180deg)";
					append_page_obj.style.transform = "rotateY(180deg)";
					_mask_obj.appendChild(append_page_obj);

					$.transition.play(_mask_obj,{
						'webkit-transform':['rotateY(0deg)','rotateY(180deg)'],
						'moz-transform':['rotateY(0deg)','rotateY(180deg)'],
						'transform':['rotateY(0deg)','rotateY(180deg)']
					},700,function(){
							
							_absolute_page_obj.parentNode.removeChild(_absolute_page_obj);
							if (fobid_click) _ground_obj.removeChild(fobid_click);
							_mask_obj.style.position='static';
							_mask_obj.style.webkitTransformStyle = 'flat ';
							_mask_obj.style.transformStyle = 'flat ';
							_mask_obj.style.webkitTransform = 'rotateY(0deg)';
							_mask_obj.style.transform = 'rotateY(0deg)';

							append_page_obj.style.webkitTransform="rotateY(0deg)";
							append_page_obj.style.transform = "rotateY(0deg)";

							append_page_obj.style.position = "static";
							append_page_obj.style.webkitTransform='none';
							append_page_obj.style.mozTransform='none';
							append_page_obj.style.transform='none';
							append_page_obj.style.overflow = "auto";
							append_page_obj.style.width = '100%';
							append_page_obj.style.minHeight = '100%';
							append_page_obj.style.height = 'auto';
							if (_callback) _callback(_append_name);
						
					});
				
				
					
				},
				flyin:function(_append_name, _absolute_page_obj, _mask_obj, _ground_obj, _construct, _callback) {
					if (_construct) _construct(_absolute_page_obj);
					var append_page_obj = document.createElement('div');
					append_page_obj.id = _append_name;
					var fobid_click = playground.create_safe_transition_end(_ground_obj);
					_mask_obj.appendChild(append_page_obj);
					_absolute_page_obj.style.position = "absolute";
					_absolute_page_obj.style.left = '0px';
					_absolute_page_obj.style.top = '0px';
					$.transition.play(append_page_obj,{
						'webkit-transform':['scale(0.7,0.7) translate(100px,0px)','scale(1,1) translate(30px,0px)','ease-out'],
						'moz-transform':['scale(0.7,0.7) translate(100px,0px)','scale(1,1) translate(30px,0px)','ease-out'],
						'transform':['scale(0.7,0.7) translate(100px,0px)','scale(1,1) translate(30px,0px)','ease-out']
					},100,function(){
						append_page_obj.style.webkitTransform = 'translate(30px,0px)';
						append_page_obj.style.mozTransform = 'translate(30px,0px)';
						append_page_obj.style.transform = 'translate(30px,0px)';
						$.transition.play(append_page_obj,{
							'webkit-transform':['translate(30px,0px)','translate(0px,0px)','ease'],
							'moz-transform':['translate(30px,0px)','translate(0px,0px)','ease'],
							'transform':['translate(30px,0px)','translate(0px,0px)','ease']
						},200,function(){
							_absolute_page_obj.parentNode.removeChild(_absolute_page_obj);
							if (fobid_click) _ground_obj.removeChild(fobid_click);
							append_page_obj.style.webkitTransform='none';
							append_page_obj.style.mozTransform='none';
							append_page_obj.style.transform='none';
							append_page_obj.style.overflow = "auto";
							append_page_obj.style.width = '100%';
							append_page_obj.style.minHeight = '100%';
							if (_callback) _callback(_append_name);
						});	
					});
				},
				flyout:function(_append_name, _absolute_page_obj, _mask_obj, _ground_obj, _construct, _callback) {
					if (_construct) _construct(_absolute_page_obj);
					var append_page_obj = document.createElement('div');
					append_page_obj.id = _append_name;
					var fobid_click = playground.create_safe_transition_end(_ground_obj);

					_mask_obj.appendChild(append_page_obj);

					_absolute_page_obj.style.position = "absolute";
					_absolute_page_obj.style.left  = '0px';
					_absolute_page_obj.style.top   = '0px';
					_absolute_page_obj.style.zIndex   = 98;

					$.transition.play(_absolute_page_obj,{
						'webkit-transform':['scale(1,1) translate(0px,0px)','scale(1,1) translate(30px,0px)','ease'],
						'moz-transform':['scale(1,1) translate(0px,0px)','scale(1,1) translate(30px,0px)','ease'],
						'transform':['scale(1,1) translate(0px,0px)','scale(1,1) translate(30px,0px)','ease']
					},200,function(){
					
						$.transition.play(_absolute_page_obj,{
							'opacity':['1.0','0','ease-out'],
							'webkit-transform':['scale(1,1) translate(30px,0px)','scale(0.95,0.95) translate(100px,0px)','ease-out'],
							'moz-transform':['scale(1,1) translate(30px,0px)','scale(0.95,0.95) translate(100px,0px)','ease-out'],
							'transform':['scale(1,1) translate(30px,0px)','scale(0.95,0.95) translate(100px,0px)','ease-out']
						},120,function(){
							_absolute_page_obj.parentNode.removeChild(_absolute_page_obj);
							if (fobid_click) _ground_obj.removeChild(fobid_click);
							append_page_obj.style.webkitTransform='none';
							append_page_obj.style.mozTransform='none';
							append_page_obj.style.transform='none';
							append_page_obj.style.overflow = "auto";
							append_page_obj.style.width = '100%';
							append_page_obj.style.minHeight = '100%';
							if (_callback) _callback(_append_name);
						})
						
					});
				},
				spread: function(_append_name, _absolute_page_obj, _mask_obj, _ground_obj, _construct, _callback) {
					if (_construct) _construct(_absolute_page_obj);
					var append_page_obj = document.createElement('div');
					append_page_obj.id = _append_name;
					var fobid_click = playground.create_safe_transition_end(_ground_obj);
					_mask_obj.appendChild(append_page_obj);
					_absolute_page_obj.parentNode.removeChild(_absolute_page_obj);
					$.transition.play(append_page_obj,{
						'webkit-transform':['scale(0.9,0.9)','scale(1,1)','ease'],
						'moz-transform':['scale(0.9,0.9)','scale(1,1)','ease'],
						'transform':['scale(0.9,0.9)','scale(1,1)','ease']
					},dojob.effect.config.time,function(){
						if (fobid_click) _ground_obj.removeChild(fobid_click);
						append_page_obj.style.webkitTransform='none';
						append_page_obj.style.mozTransform='none';
						append_page_obj.style.transform='none';
						append_page_obj.style.overflow = "auto";
						append_page_obj.style.width = '100%';
						append_page_obj.style.minHeight = '100%';
						if (_callback) _callback(_append_name);
					});
				},

				/**
				 * _ground_obj
				 * _mask_obj
				 * _absolute_page_obj 当前页对象
				 * _append_name 添加的场景名，可利用 dojob.effect.appendPage(_append_name,_mask_obj); 添加
				 */
				swipeleft: function(_append_name, _absolute_page_obj, _mask_obj, _ground_obj, _construct, _callback) {
				
					if (_construct) _construct(_absolute_page_obj);
					// var client_width = document.body.clientWidth;
					var client_width = _ground_obj.clientWidth;
					_mask_obj.style.width = (client_width * 2) + 'px';
					var append_page_obj = document.createElement('div');
					append_page_obj.style.mozBoxSizing = "border-box";
					append_page_obj.style.webkitBoxSizing = "border-box";
					append_page_obj.id = _append_name;
					_mask_obj.appendChild(append_page_obj);
					var fobid_click = playground.create_safe_transition_end(_ground_obj);
					_ground_obj.style.width = client_width + 'px';
					_ground_obj.style.overflowX = 'hidden';
 					_mask_obj.style.float = 'left';
					_mask_obj.style.cssFloat = 'left';
					_mask_obj.style.styleFloat = 'left';
					_absolute_page_obj.style.float = 'left';
					_absolute_page_obj.style.cssFloat = 'left';
					_absolute_page_obj.style.styleFloat = 'left';
					_absolute_page_obj.style.width = client_width + 'px';
					_absolute_page_obj.style.minHeight = '100%';
					append_page_obj.style.float = 'left';
					append_page_obj.style.cssFloat = 'left';
					append_page_obj.style.styleFloat = 'left';
					append_page_obj.style.width = client_width + 'px';
					append_page_obj.style.minHeight = '100%';
					document.body.scrollTop=1;

					//_mask_obj

					$.transition.play(_mask_obj,{
						'webkit-transform':['translate(0px,0px)','translate(-'+client_width+'px,0px)'],
						'moz-transform':['translate(0px,0px)','translate(-'+client_width+'px,0px)'],
						'transform':['translate(0px,0px)','translate(-'+client_width+'px,0px)']
					},dojob.effect.config.time,function(){
						_mask_obj.removeChild(_absolute_page_obj);
						_mask_obj.style.webkitTransform='none';
						_mask_obj.style.mozTransform='none';
						_mask_obj.style.transform='none';
						_mask_obj.style.float = 'none';
						_mask_obj.style.cssFloat = 'none';
						_mask_obj.style.styleFloat = 'none';
						if (fobid_click) _ground_obj.removeChild(fobid_click);
						_ground_obj.style.width = '100%';
						_mask_obj.style.width = '100%';
						append_page_obj.style.width = '100%';
						append_page_obj.style.minHeight = '100%';
						append_page_obj.style.float = 'auto';
						append_page_obj.style.cssFloat = 'auto';
						append_page_obj.style.styleFloat = 'auto';
						if (_callback) _callback(_append_name);	
					});

					
					
				},

				
				/**
				 * _ground_obj
				 * _mask_obj
				 * _absolute_page_obj 当前页对象
				 * _append_name 添加的场景名，可利用 dojob.effect.appendPage(_append_name,_mask_obj); 添加
				 */
				swiperight: function(_append_name, _absolute_page_obj, _mask_obj, _ground_obj, _construct, _callback) {

					if (_construct) _construct(_absolute_page_obj);
					// var client_width = document.body.clientWidth;
					var client_width = _ground_obj.clientWidth;
					_mask_obj.style.width = (client_width * 2) + 'px';
					var append_page_obj = document.createElement('div');
					append_page_obj.style.mozBoxSizing = "border-box";
					append_page_obj.style.webkitBoxSizing = "border-box";
					append_page_obj.id = _append_name;
					
					_mask_obj.style.float = 'right';
					_mask_obj.style.cssFloat = 'right';
					_mask_obj.style.styleFloat = 'right';

					append_page_obj.style.float = 'right';
					append_page_obj.style.cssFloat = 'right';
					append_page_obj.style.styleFloat = 'right';

					append_page_obj.style.width = client_width + 'px';
					append_page_obj.style.minHeight = '100%';
					_absolute_page_obj.style.float = 'right';
					_absolute_page_obj.style.cssFloat = 'right';
					_absolute_page_obj.style.styleFloat = 'right';
					_absolute_page_obj.style.width = client_width + 'px';
					_absolute_page_obj.style.minHeight = '100%';
					
					_mask_obj.appendChild(append_page_obj);
					var fobid_click = playground.create_safe_transition_end(_ground_obj);
					_ground_obj.style.width = client_width + 'px';
					_ground_obj.style.overflowX = 'hidden';
					document.body.scrollTop=1;

					$.transition.play(_mask_obj,{
						'webkit-transform':['translate(0,0px)','translate('+client_width+'px,0px)'],
						'moz-transform':['translate(0px,0px)','translate('+client_width+'px,0px)'],
						'transform':['translate(0px,0px)','translate('+client_width+'px,0px)']
					},dojob.effect.config.time,function(){
						_mask_obj.style.float = 'none';
						_mask_obj.style.cssFloat = 'none';
						_mask_obj.style.styleFloat = 'none';
						_mask_obj.style.transform='none';
						_mask_obj.style.mozTransform='none';
						_mask_obj.style.webkitTransform='none';
						_mask_obj.removeChild(_absolute_page_obj);
						if (fobid_click) _ground_obj.removeChild(fobid_click);
						_ground_obj.style.width = '100%';
						_mask_obj.style.width = '100%';
						append_page_obj.style.width = '100%';
						append_page_obj.style.minHeight = '100%';
						append_page_obj.style.float = 'auto';
						append_page_obj.style.cssFloat = 'auto';
						append_page_obj.style.styleFloat = 'auto';
						if (_callback) _callback(_append_name); 
					}); 

				}

			},

			//add  screen  touch events
			evt: {
				config: {
					distance: 0.25,
					tap_time: 1000
				},
				watch_swipe: function(callback) {
					function evt_start(e) {
						var startx = e.touches[0].pageX,
							diff = 0;

						function evt_move(e) {
							diff = e.touches[0].pageX - startx;
						}

						function evt_end() {
							callback(diff);
							window._this.removeEventListener('touchmove', evt_start, false);
							window._this.removeEventListener('touchend', evt_end, false);
						}
						window._this.addEventListener('touchmove', evt_move, false);
						window._this.addEventListener('touchend', evt_end, false);
					}

					window._this.addEventListener('touchstart', evt_start, false);
				},
				swipeleft: function(callback) {

					dojob.evt.watch_swipe(function(diff) {
						if (diff < 0 && Math.abs(diff) > document.body.clientWidth * dojob.evt.config.distance) callback();
					});
				},
				swiperight: function(callback) {
					dojob.evt.watch_swipe(function(diff) {
						if (diff > 0 && Math.abs(diff) > document.body.clientWidth * dojob.evt.config.distance) callback();
					});
				},
				onorientationchange:function(callback){
					 window.onorientationchange =  function(){
					 	
						( $.navigator.is_ios() ) ? callback() : setTimeout(callback,500);
					 	
					 }	
				}
				// tap:function(){
				// 	var starttime = +new Date();
				// 	dojob.evt.watch_swipe(function(diff){
				// 		if(diff==0 && (+new Date()-starttime)>dojob.evt.config.tap_time)  callback(); 
				// 	});
				// }
			},


			//cache  control
			cache: {
				ticket: 'renren',
				value: function(key, value, expires) {
					if (window.localStorage) {
						return (value) ? dojob.cache.set(dojob.cache.ticket + key, value, expires) : dojob.cache.get(dojob.cache.ticket + key);
					}
				},
				get: function(key) {
					if (window.localStorage) {
						var json = JSON.parse(localStorage.getItem(key));
						if (json) {
							var expires = (+new Date()) - json.create_at;
							if (expires < json.expires || json.expires == 0) return json.val;
							dojob.cache.remove(key);
						}
					}
				},
				set: function(key, value, expires) {

					if (window.localStorage) {

						localStorage.setItem(
						key,
						JSON.stringify({
							expires: (expires) ? parseInt(expires) : 0,
							create_at: +new Date(),
							val: value
						}));

						return true;
					}
				},
				remove: function(key) {
					if (window.localStorage) {
						localStorage.removeItem(key);
						return true;
					}
				},
				if_not_supurt_to_do: function() {
					if (!window.localStorage) {
						window.localStorage = {
							getItem: function(sKey) {
								if (!sKey || !this.hasOwnProperty(sKey)) {
									return null;
								}
								return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
							},
							key: function(nKeyId) {
								return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
							},
							setItem: function(sKey, sValue) {
								if (!sKey) {
									return;
								}
								document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
								this.length = document.cookie.match(/\=/g).length;
							},
							length: 0,
							removeItem: function(sKey) {
								if (!sKey || !this.hasOwnProperty(sKey)) {
									return;
								}
								document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
								this.length--;
							},
							hasOwnProperty: function(sKey) {
								return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
							}
						};
						window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
					}
				}

			},

			/*js file lasy load*/
			lasyload: {
				timeout: 30000,
				loaded_file_list: {}, //loaded file list
				file: function(src, callback) { //load single file
					if (!dojob.lasyload.loaded_file_list[src]) {
						var script = document.createElement('script');
						script.type = 'text/javascript';
						script.onload = script.onreadystatechange =function(){
							  //if(!this.readyState  || this.readyState == 'loaded' || this.readyState == 'complete') {
							  if(!this.readyState  || this.readyState == 'loaded' ) {
						       	dojob.lasyload.loaded_file_list[src] = true;
								if (callback) callback();
							 } 
						};
						script.src = './'+src + '?' + (+new Date());
						$('head')[0].appendChild(script);
					} else {
						if (callback) callback();
					}
				},
				files: function(src_json, callback) { //load multiple file			
					var loaded_rate = src_json.length;
					var absolute_rate = 0;
					var rate_trace = setInterval(function() {
						if (loaded_rate == absolute_rate) {
							clearInterval(rate_trace);
							callback();
						}
					}, 50);
					//outdate setting
					setTimeout(function() {
						if (loaded_rate != absolute_rate) clearInterval(rate_trace);
					}, dojob.lasyload.timeout);
					//loading file one by one
					for (var i = 0; i < src_json.length; i++) {
						dojob.lasyload.file(src_json[i], function() {
							absolute_rate++;
						});
					};

				},

			},


			/* start up */
			startup: function(parmas) {

				
				//support  test
				if (browser_init.browser_not_support()) return false;

				window.magi_history = {
					absolute: [],
					history: []
				};

				//parse params
				dojob.init(parmas);

				//loading playground and execute controller

				function start_script() {

					//create playground and every page create or remove on here
					playground.create(define.playground_name, define.app_playground_obj);

					//route from url if http querys exists
					var query_get = query.get(define.default_controller, define.default_action,1);
					query_get._query =  (query_get._query) ? query_get._query : define.default_query ;
					//alert(define.default_query['me'])
					// var _query = ( query_get._query[0] ) ? query_get._query:define.default_query

					//begin route path
					dojob.route.to(query_get._class, query_get._method, query_get._query, 'none', true);
				}

				if(define.is_use_tpl_cache==true)  define.extend_utility.push(define.view_path+'_magi_page_cache.js');
				 
				//loading extend utility
				if (define.extend_utility[0]) {
					dojob.lasyload.files(define.extend_utility, function() {
						start_script();
					});
				} else {
					start_script();
				}


			},
			route: {
				//generate  id name from _class , _query and _method
				page_name: function(_class, _method, _query) {
					// var json_str =JSON.stringify(_query);
					// json_str  =( json_str) ?json_str:'';
					var json_str = '';
					for (var i in _query) {
						if (i != 'job') json_str += '_' + i + '_' + encodeURIComponent(_query[i]);
					};
					return _class + '-' + _method + json_str.replace(/\%|\.|\(|\)/g, '');
				},
				page_obj: function(_class, _method, _query,_without_history) {
					return $('#' + dojob.route.page_name(_class, _method, _query))[0];
				},
				to: function(_class, _method, _query, _effect, _hidden_ajax_tip,_without_history) {
					
					if(!_without_history){
						if (magi_history.history.length > 30) magi_history.history.splice(0, 1);
						magi_history.absolute = [_class, _method, _query];
						magi_history.history.push(magi_history.absolute);
					}
					if (!_hidden_ajax_tip) magi.loading.init();
					dojob.controller(_class, _method, _query, _effect , define.is_mvc,_without_history);
					
				},
				url: function(_url, _effect, _hidden_ajax_tip,_without_history) {
					var _query = ((/\?/i).test(_url)) ? query.get_in_url(_url,0) : {};
					var data = (/([\w\d_-]+)#([\w\d_-]+)/i).exec(_url);
					dojob.route.to(data[1], data[2], _query, _effect, _hidden_ajax_tip,_without_history);
				},
				back: function(_effect, url,_hidden_ajax_tip) {
					if(magi_history.history[1]){
						magi.route.history(-1, _effect, _hidden_ajax_tip);
					}else if(url){
						magi.route.url(url,_effect,_hidden_ajax_tip);
					}
				},
				history: function(_no, _effect, url,_hidden_ajax_tip) {
					if(magi_history.history[1]){

						magi.route.to(
							magi_history.history[magi_history.history.length - 1 + _no][0], 
							magi_history.history[magi_history.history.length - 2][1],
							magi_history.history[magi_history.history.length - 1 + _no][2],
							_effect,
							_hidden_ajax_tip,
							true
						);
						//删除magi_history.history最后一条
						magi_history.history.splice(magi_history.history.length-1, 1);
					}else if(url){
						magi.route.url(url,_effect,_hidden_ajax_tip);
					}
				}
			},
			debug: {
				start: function() {
					window._debug_start_time = +new Date();
				},
				print: function(tag) {
					var execute_time = (+new Date() - window._debug_start_time);
					var div = document.createElement('div');
					div.style.clear = 'both';
					div.style.fontSize = '12px';
					div.style.textAlign = "left";
					div.style.color = 'red';
					div.className = 'magi_debug';
					div.innerHTML = 'createat: '+(new Date()).toLocaleString()+'<br />execute: '+execute_time+'ms<br />message：'+tag+'<br /><hr />';
					document.body.appendChild(div);
					window._debug_start_time = +new Date();
				},
				logs:function(tag){
					var execute_time = (+new Date() - window._debug_start_time);
					var logs = dojob.cache.get('_magi_debug_log');
					logs = (  logs ) ? logs:[];
					logs.unshift('createat: '+(new Date()).toLocaleString()+'<br />execute: '+execute_time+'ms<br />message: '+tag+'<br /><hr />');
					dojob.cache.set('_magi_debug_log',logs,86400000);
					window._debug_start_time = +new Date();
				},
				clean:function(){
					dojob.cache.remove('_magi_debug_log');
				}
			},
			//ajax loading
			remote: {
				cache_name: function(url, json) {
					var str = '';
					for (var i in json) {
						str += '_' + i + '_' + json[i];
					}
					return url + str;
				},
				cache_clear: function(url, json) {
					dojob.cache.remove(dojob.remote.cache_name(url, json), json);
				},
				load: function(url, json, callback, expires,is_ajax) {

					var key = dojob.remote.cache_name(url, json),
						expires = parseInt(expires),
						value = dojob.cache.get(key);
					if (!value) {
						if(!is_ajax) magi.loading.init();
						
						// var rand = +new Date()+Math.ceil( Math.random()*1000);
						$.ajax.jsonp(url, json, function(json) {

							if(!is_ajax)  magi.loading.close();
							callback(json);
							if (expires > 0) {
								dojob.cache.set(key, json, expires);
							}
						}, 'call');
					} else {
						callback(value);
					}
				},
				get: function(url, json, callback, expires, errback,is_ajax) {
					var key = dojob.remote.cache_name(url, json),
						expires = parseInt(expires),
						value = dojob.cache.get(key);
					if (!value) {
						if(!is_ajax)   magi.loading.init();
						$.ajax.get(url, json, function(json) {
							if(!is_ajax) magi.loading.close();
							callback();
							if (expires > 0) {
								dojob.cache.set(key, json, expires);
							}
						}, function() {
							magi.loading.close();
							errback();
						});
					} else {
						callback(value);
					}
				},
				post: function(url, json, callback, expires, errback,is_ajax) {
					var key = dojob.remote.cache_name(url, json),
						expires = parseInt(expires),
						value = dojob.cache.get(key);
					if (!value) {
						if(!is_ajax) magi.loading.init();
						$.ajax.post(url, json, function(json) {
							if(!is_ajax) magi.loading.close();
							callback();
							if (expires > 0) {
								dojob.cache.set(key, json, expires);
							}
						}, function() {
							magi.loading.close();
							errback();
						});
					} else {
						callback(value);
					}
				},
				getJson: function(url, json, callback, expires, errback,is_ajax) {
					var key = dojob.remote.cache_name(url, json),
						expires = parseInt(expires),
						value = dojob.cache.get(key);
					if (!value) {
						if(!is_ajax) magi.loading.init();
						$.ajax.getJson(url, json, function(json) {
							if(!is_ajax) magi.loading.close();
							callback();
							if (expires > 0) {
								dojob.cache.set(key, json, expires);
							}
						}, function() {
							magi.loading.close();
							errback();
						});
					} else {
						callback(value);
					}
				}
			},

			init: function(parmas) {
				parmas = (parmas) ? parmas : {};
				if (parmas.module_path) define.module_path = parmas.module_path;
				if (parmas.controller_path) define.controller_path = parmas.controller_path;
				if (parmas.view_path) define.view_path = parmas.view_path;
				if (parmas.default_controller) define.default_controller = parmas.default_controller;
				if (parmas.default_action) define.default_action = parmas.default_action; 
				if (parmas.default_page_effection) define.default_page_effection = parmas.default_page_effection;
				if (parmas.playground_name) define.playground_name = parmas.playground_name;
				if (parmas.ajax_tip_class) define.ajax_tip_class = parmas.ajax_tip_class;
				if (parmas.default_query) define.default_query = parmas.default_query;
				if (parmas.extend_utility) define.extend_utility = parmas.extend_utility;
				if (parmas.tpl_rule) define.tpl_rule = parmas.tpl_rule;
				if (parmas.default_controller_construct) define.default_controller_construct = parmas.default_controller_construct;
				if (parmas.is_header_footer_transition_fixed) define.is_header_footer_transition_fixed = parmas.is_header_footer_transition_fixed;
				if (parmas.app_playground_obj) define.app_playground_obj = parmas.app_playground_obj;
				if (typeof(parmas.is_use_tpl_cache) == 'boolean') define.is_use_tpl_cache = parmas.is_use_tpl_cache;
				if (typeof(parmas.is_mvc) == 'boolean') define.is_mvc = parmas.is_mvc;
				if (typeof(parmas.allow_browser_url_change) == 'boolean') define.allow_browser_url_change = parmas.allow_browser_url_change;

			},

			render: {

				all: function() {
					dojob.render.a();
					dojob.render.btn();
				},
				header_and_footer: function() {
					dojob.render.header();
					dojob.render.footer();
				},
				btn:function(){
					var em = $('em');
					for(var i=0;i<em.length;i++){

						if( $.store.get(em[i],'magiTouchStyle') ){
							em[i].addEventListener('touchstart',function(){
								 this.rel= this.className;
								 this.className = this.className +' '+  $.store.get(this,'magiTouchStyle');

							},false);
							em[i].addEventListener('touchend',function(){
								this.className =  this.rel;
							},false);
						}

						if( $.store.get(em[i],'magiRouteUrl') ){
							em[i].onclick=function(){
								 
								dojob.route.url( $.store.get(this,'magiRouteUrl'), ( $.store.get(this,'magiEffect') ) ? $.store.get(this,'magiEffect') : define.default_page_effection );
							}
						}

						if( $.store.get(em[i],'magiRouteBack') =='true'){
							em[i].onclick=function(){
								dojob.route.back();
							}
						}
						
					}
					// data-magi-touch-style
				},
				disable_header_and_footer      : function(_absolute_page_obj) {
					dojob.render.disable_header(_absolute_page_obj);
					dojob.render.disable_footer(_absolute_page_obj);
				},
				disable_header: function(_absolute_page_obj) {
					
					var header = _absolute_page_obj.getElementsByTagName('header')[0];
				
					if (header && $.store.get( header,'magiFixed' ) == 'true') {

						header.style.position = "static";
						header.parentNode.style.paddingTop = '0px';
					}
				},
				disable_footer: function(_absolute_page_obj) {
					var footer = _absolute_page_obj.getElementsByTagName('footer')[0];
					if (footer && $.store.get( footer,'magiFixed' ) == 'true') {
						footer.style.position = "static";
						footer.parentNode.style.paddingBottom = '0px';
					}
				},
				header: function() {
					var header = $('#' + _this_name + ' header')[0];
					if (header && $.store.get( header,'magiFixed' ) == 'true') {
						header.style.position = "fixed";
						header.style.left = '0px';
						header.style.top = '0px';
						header.style.zIndex = 100;
						header.style.width=document.body.clientWidth+'px';
						header.parentNode.style.paddingTop = header.scrollHeight + 'px';
					}
				},
				footer: function() {
					var footer = $('#' + _this_name + ' footer')[0];

					if (footer && $.store.get( footer,'magiFixed' ) == 'true') {
						footer.style.position = "fixed";
						footer.style.left = '0px';
						footer.style.bottom = '0px';
						footer.style.zIndex = 100;
						footer.parentNode.style.paddingBottom = footer.scrollHeight + 'px';
					}
				},
				a: function() {
					var a = $('#' + _this_name + ' a');
					for (var i = 0; i < a.length; i++) {
						if ( $.store.get( a[i],'magiRoute' ) == 'true') {
							var fake = document.createElement('span');
							fake.innerHTML = a[i].innerHTML;
							fake.setAttribute('rel', a[i].getAttribute('href'));
							if( $.store.get( a[i],'magiEffect' )  )   $.store.set( fake,'magiEffect', $.store.get(a[i],'magiEffect') );
							a[i].parentNode.replaceChild(fake, a[i]);
							fake.onclick = function(e) {
								var url = this.getAttribute('rel');
								if (url != '') {

									dojob.route.url(url,  $.store.get(this,'magiEffect') );
								}
								return false;
							}
						}
						$.store.get(a[i],'magiRouteBack');
						if($.store.get(a[i],'magiRouteBack')=='true'){
							a[i].onclick=function(){
								dojob.route.back();
							}
						}
					}

				}


			},

			util: {},
			 
			controller: function(_class, _method, _query, _effect,_is_mvc,_without_history) {

				window.onscroll=null;//解除scrooll绑定
				if (define.allow_browser_url_change) {
					query.change_locaton_address(_class, _method, _query,_without_history);
				}
				window._this_class = _class;
				window._this_method = _method;
				window._this_name = dojob.route.page_name(_class, _method, _query);
				
				//transition playgroud   
				playground.load(_class, _method, _query, _effect, function(_absolute_page_obj) {

					if (define.is_header_footer_transition_fixed) {
						dojob.render.disable_header_and_footer(_absolute_page_obj);
					}
				}, function(_append_page) {
					var _append_page_obj = $('#' + _append_page)[0];
					var watch_dom = setInterval(function() {
						if (_append_page_obj.getElementsByTagName('*')[0]) {
							dojob.render.header_and_footer();
							//hidden loading tips
							playground.hidden_browser_address();
							clearInterval(watch_dom);
						}
					}, 30);
				});

				function render_view(_class, _method, _callback) {
					
					page_cache_name = 'page_' + _class + '_' + _method;
					if (!window.view_page_cache[page_cache_name]) {
						var file = define.tpl_rule.replace(/\{\$class\}/,_class).replace(/\{\$method\}/,_method);
						$.ajax.get(define.view_path + file , {}, function(html) {
							if (_callback) _callback(html);
							window.view_page_cache[page_cache_name] = html;
						});
					} else {
						if (_callback) _callback(window.view_page_cache[page_cache_name]);
					}
				}

				//loading_viewer
				render_view(_class, _method, function(content) {
				
					window._GET = _query;
					window._this = $('#' + window._this_name)[0];
					window._this.innerHTML = content;
					if( _is_mvc ){
						dojob.lasyload.files([define.controller_path + _class + '.js'], function() {
							eval('var controller_models =  ' + _class + '.model;');
							var preload_file = [];
							if (controller_models) {
								for (var i = 0; i < controller_models.length; i++) {
									preload_file.push(define.module_path + controller_models[0] + '.js');
								}
							}
							
							dojob.lasyload.files(preload_file, function() {

								magi.loading.close();
								if( define.default_controller_construct )  define.default_controller_construct();
								eval('if( window.' + _class + '.__construct ) window.' + _class + '.__construct(_query)');
								//execute controller method
								eval('window.'+_class + '.' + _method + '(_query)');
								//execute controller's __destruct 
								eval('if( window.' + _class + '.__destruct) window.' + _class + '.__destruct(_query);');
								dojob.render.all();

							});
						});
						
					}else{
							magi.loading.close();
							dojob.render.all();
					}
				});

			}
		}
	})();

	//MAGI扩展
	dojob.util.file = (function() {
		var outdate = {
			file: 20000, //单个图片超时时间
			script: 10000 //单个脚本超时时间
		};

		function get_file_ext(str) {
			return /\.[^\.]+$/.exec(str).toString();
		}

		function down_for_loop(json, call) {

			var count = json.length,
				complete = 0;

			function callback() {
				if (call) call(++complete, count);
			}
			// magi.debug.start();
			// magi.debug.print('begin debug time');
			for (var i in json) {
				(get_file_ext(json[i]).toLowerCase() == '.js') ? down_script(json[i], callback) : down_image(json[i], callback);
			}
		}

		function down_script(url, call) {
			if (!dojob.lasyload.loaded_file_list[url]) {
				// var header = document.getElementsByTagName('head')[0];
				var script = document.createElement('script');
				var flag = false;
				script.type = 'text/javascript';
				
				script.onload = script.onreadystatechange =function(){

					 // if(!this.readyState  || this.readyState == 'loaded' || this.readyState == 'complete') { //ie10
					 if(!this.readyState  || this.readyState == 'loaded' || this.readyState == 'complete') { 
				        if (!flag) {
							if (call) call();
							flag = true;
							dojob.lasyload.loaded_file_list[url] = true;
						}
					 } 
				};
				script.src = url;
				$('head')[0].appendChild(script);
				//header.appendChild(script);
				setTimeout(function() {
					if (!flag) {
						if (call) call();
						flag = true;
					}
				}, outdate.file);
			}else{
				if (call) call();
			}
		}

		function down_image(url, call) {
			var image = new Image();
			var flag = false;
			image.src = url;
			image.onload = function() {
				// magi.debug.print(url+':');
				if (image.complete) {
					if (!flag) {
						if (call) call();
						flag = true;
					}
				}
			};
			setTimeout(function() {
				if (!flag) {
					if (call) call();
					flag = true;
				}
			}, outdate.script);
		}
		return {
			load: function(json, call) {

				down_for_loop(json, call);
			}
		}
	})();

	window.magi = window.dojob = dojob;

})(window, $);

