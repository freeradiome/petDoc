/**
* 测试模块
*/
function to_see_i(){
	var hei = $('#index_content',_this)[0].clientHeight;
	 $.animate.play(function(pos){
	 	document.body.scrollTop = hei*pos;
    },300);
}
var index=(function($){

	

	function chk_version(call){
		magi.remote.load(api+'?class=version&method=info',{},function(data){
			if(data.status==200){
				if( call ) call();
				if(data.results.ver>ver){
					cfm({
						html:"\r\n检查到新版本的客户端"+data.results.ver+"版\r\n"+data.results.note+"\r\n",
						// html:'发布新版本的客户端'+data.results.ver,
						title:'版本升级',
						button:'取消,现在升级',
						callback:function(buttonIndex){
							if(buttonIndex==2){
								window.open(data.results.url,"_system");
							}
							
						}
					});
				}else{
					if(!call){
						msg({
							html:'当前已经为最新版本程序',
							title:'版本升级',
							button:'确定'
						});
					}
				}
			}
		});
	}
	
	function cfm(json){
		// alert(json.html);
		if(  window.cordova  ){
			navigator.notification.confirm(json.html, json.callback, json.title, json.button)
		}else{
			alert(json.html);
		}
	

	}
	function msg(json){
		// alert(json.html);
		if(  window.cordova  ){
			navigator.notification.alert(json.html, json.callback, json.title, json.button)
		}else{
			alert(json.html);
		}
		

	}
	function get_uid(){
		
		if( window.device ){
			return device.uuid;
		}else{
			return 'zeng444';
		}

		// return 'zeng444';
	}

	function clear_fav_cache(){
		magi.remote.cache_clear(api+'?class=fav&method=lists',{uid:get_uid()});
	}

	function clear_illdetail_cache(id){ 
		magi.remote.cache_clear(api+'?class=illness&method=detail',{id:id,uid:get_uid()});
		// api+'?class=illness&method=detail',{id:id,uid:uid}
	}

	function show_tag_list(select){
		magi.remote.load(api+'?class=tag&method=filter_tags_type',{tag:select},function(data){
			if(data.status==200){
				
				var fragment = document.createDocumentFragment();
				for(var i=0;i<data.results.length;i++){
					var li = document.createElement('li');
					
					var span = document.createElement('span');

					span.onclick=(function(i){
						return function(){
							 magi.route.url('index#illtag?select='+select+'&cid='+data.results[i].id);
						}
					})(i);
					span.ontouchstart=function(){
						this.className="hover";
					}
					span.ontouchend=function(){
						this.className="";
					}
					span.innerHTML = data.results[i].name;
					li.appendChild(span);
					// html.push( '<li onclick="magi.route.url(\'index#illtag?select='+select+'&cid='+data.results[i].id+'\')"><span>'+data.results[i].name+'</span></li>' );
				
					fragment.appendChild(li);
				}
				$('.tagtype',_this)[0].innerHTML='';
				$('.tagtype',_this)[0].appendChild(fragment);
			}
		},60000000);
	}

	return {
	
		__construct:function(_get){
	
			//something execute before all
		},
		// model:['metro'],
		index:function(_get){

			//开始执行
			var select = ( _get.select ) ?  _get.select : '';
			//热门症状
			magi.remote.load(api+'?class=tag&method=hot',{limit:16},function(data){
				if(data.status==200){
					var html = [];
					var lists = data.results;
					var fragment = document.createDocumentFragment();
					for(var i=0;i<lists.length;i++){
						var li = document.createElement('li');
						li.innerHTML = lists[i].name;
						li.onclick=(function(i){
							return function(){
								magi.route.url('index#result?select='+lists[i].name);
							}
						})(i);
						li.ontouchstart=function(){

							this.className="hover";
						}
						li.ontouchend=function(){
							this.className="";
						}
						fragment.appendChild(li);
						// html.push( '<li onclick="magi.route.url(\'index#result?select='+q_str+lists[i].name+'\')">'+lists[i].name+'</li>' );
					}
					$('.itags',_this)[0].innerHTML='';
					$('.itags',_this)[0].appendChild(fragment);
				}
			},60000000);

			show_tag_list( select );
			//检查是否有新版本
			setTimeout(function(){
				if( !magi.cache.get('is_checked_ver')  ){
					chk_version(function(){
						magi.cache.set('is_checked_ver',true,86400000); 
					})
				}
			},2000)
	 		
		},
		illtag:function(_get){
			var select = ( _get.select) ? _get.select :'';
			var cid=  (_get.cid)?_get.cid:'';
			magi.remote.load(api+'?class=tag&method=filter_tags',{cid:cid,tag:select},function(data){
				var q_str = ( select ) ?  select+' ' : select+'';
				if(data.status==200){
					$('h1',_this)[0].innerHTML = data.results.type_name;
					var html = [];
					var lists = data.results.list;
					var fragment = document.createDocumentFragment();
					for(var i=0;i<lists.length;i++){
						var li = document.createElement('li');
						li.innerHTML = lists[i].name;
						li.onclick=(function(i){
							return function(){
								magi.route.url('index#result?select='+q_str+lists[i].name);
							}
						})(i);
						li.ontouchstart=function(){

							this.className="hover";
						}
						li.ontouchend=function(){
							this.className="";
						}
						fragment.appendChild(li);
						// html.push( '<li onclick="magi.route.url(\'index#result?select='+q_str+lists[i].name+'\')">'+lists[i].name+'</li>' );
					}
					$('.itags',_this)[0].innerHTML='';
					$('.itags',_this)[0].appendChild(fragment);
				}
			},6000000);
		},
		result:function(_get){
			
			var select = ( _get.select ) ?  _get.select : '';
			
			var tag_list = select.split(' ');
			
			var q_str = ( select ) ?  select+' ' : select+'';

			var uid  = get_uid();
			//获取结果
			magi.remote.load(api+'?class=illness&method=tag_filter_list',{tag:select,uid:uid},function(data){

				if(data.status==200){
					var list = data.results.lists;
					//显示结果 Math.round(x*100)/100; 
					if(list.length==1){
						$('.myslt',_this)[0].style.display='none';
						$('.result .red .y1',_this)[0].innerHTML = '可能患有：'+list[0].title + '<br />'; 
						 

						$('.result .red .y2',_this)[0].innerHTML = '匹配程度：'+ Math.round((tag_list.length/list[0].tags.length)*10000)/100+ '%<br />';
						$('.result .red',_this)[0].style.display='block';
						$('.result .green',_this)[0].style.display='none';
						var html = [];
						//该病其他症状

						if( list[0].tags.length!=tag_list.length ){
							for(var i=0;i<list[0].tags.length;i++){
								var no_not_add = false;
								for(var j =0;j<tag_list.length;j++){
									if( tag_list[j]==list[0].tags[i].tagall_name ){
										no_not_add=true;
										break;
									}
								}
								if( !no_not_add){
									html.push(' <li onclick="magi.route.url(\'index#result?select='+q_str+list[0].tags[i].tagall_name+'\')" >'+list[0].tags[i].tagall_name+'</li> ');
								}
							}
							$('.no_select_title',_this)[0].style.display='block';
							$('#no_select',_this)[0].innerHTML=html.join('');
						}else{
							
							$('.no_select_title',_this)[0].style.display='none';
						}
					}else{
						//获取症状分类
						// magi.remote.load(api+'?class=tag&method=filter_tags_type',{tag:select},function(data){
						// 	if(data.status==200){
						// 		// var html = [];
						// 		// for(var i=0;i<data.results.length;i++){
						// 		// 	html.push( '<li onclick="magi.route.url(\'index#illtag?select='+select+'&cid='+data.results[i].id+'\')"><span>'+data.results[i].name+'</span></li>' );
						// 		// }
						// 		var fragment = document.createDocumentFragment();
						// 		for(var i=0;i<data.results.length;i++){
						// 			var li = document.createElement('li');
									
						// 			var span = document.createElement('span');
					
						// 			span.onclick=(function(i){
						// 				return function(){
						// 					 magi.route.url('index#illtag?select='+select+'&cid='+data.results[i].id);
						// 				}
						// 			})(i);
						// 			span.ontouchstart=function(){

						// 				this.className="hover";
						// 			}
						// 			span.ontouchend=function(){
						// 				this.className="";
						// 			}
						// 			span.innerHTML = data.results[i].name;
						// 			li.appendChild(span);
									
						// 			fragment.appendChild(li);
						// 		}
						// 		$('.tagtype',_this)[0].appendChild(fragment);
						// 	}
						// });
						show_tag_list( select );
						$('.myslt',_this)[0].style.display='block';
						$('.result .green',_this)[0].innerHTML = '<span onclick="to_see_i()">所选症状相关的疾病 ( '+list.length+'种 )</span>';
						$('.result .red',_this)[0].style.display='none';
						$('.result .green',_this)[0].style.display='block';

					}
					//插入已选词
					
					var html = [];
					if( tag_list.length>1 ){
						for(var i=0;i<tag_list.length;i++){
							var n_str = [];
							for(var j=0;j<tag_list.length;j++){
								
								// if(tag_list[j]!=tag_list[i]) n_str.push(tag_list[i]);
								if(tag_list[j]!=tag_list[i]) n_str.push(tag_list[j]);
							}

							html.push(' <li class="hover" onclick="magi.route.url(\'index#result?select='+n_str.join(' ')+'\')">'+tag_list[i]+'</li> ')
						}
					}else{
						html.push(' <li class="hover" onclick="magi.route.url(\'index#index\')">'+tag_list[0]+'</li> ')
						
					}
					$('#on_select',_this)[0].innerHTML=html.join('');
					//输出列表
					// var html = [];
					var fragment = document.createDocumentFragment();
					for(var i=0;i<list.length;i++){



						var tags_str = '';
						var i_row = list[i].tags;
						var i_a = [];
						for(var j =0;j<i_row.length;j++){
							i_a.push( i_row[j]['tagall_name'] );
						}
						var dt = document.createElement('dt');
						var div_img =  document.createElement('div');
						var div_other =  document.createElement('div');
						
						var div_desc =  document.createElement('div');
						div_img.className = 'img';
						div_other.className = 'other';
						 
						var img  = new Image();
						img.onload=(function(div_img,img){
							return function(){
								div_img.appendChild(img);
							}
						})(div_img,img);

						img.src=list[i].pic;
						// div_img.appendChild(img);
						dt.onclick=(function(i){
							return function(){
								magi.route.url('index#illdetail?id='+list[i].id);
							}
						})(i);
						 
						var em_strx =  (list[i].normal=='1') ? "<em>常见</em>" : "";
						div_desc.className ='desc';
						div_desc.innerHTML = '<div class="title">'+list[i].title+' '+em_strx+'<span>'+list[i].master+'</span></div><div class="tag2">症状：'+i_a.join(' ')+'</div>';
						dt.appendChild(div_img);
						dt.appendChild(div_desc);
						fragment.appendChild(dt)


						// html.push( '<dt onclick="magi.route.url(\'index#illdetail?id='+list[i].id+'\')">');
 					// 	html.push( '<div class="img"><img src="'+list[i].pic+'"></div>');
				 	// 	html.push( '<div class="desc">');
					 // 	html.push( '<div class="title">'+list[i].title+' '+em_strx+'<span>'+list[i].master+'</span></div>');
					 // 	// html.push( '<div class="other">别名：'+ ( (list[i].other_name!='词条标签') ?list[i].other_name:'无' )+'</div>');
					 // 	html.push( '<div class="tag">症状：'+i_a.join(' ')+'</div>');
				 	// 	html.push( '</div></dt>');

					}
					$('.ill_list',_this)[0].appendChild(fragment);
					// $('.ill_list',_this)[0].innerHTML=html.join('');

				}
			},1200000);


			 
			

		},
		search:function(_get){
			//热门症状
			magi.remote.load(api+'?class=tag&method=hot',{},function(data){
				if(data.status==200){
					var fragment = document.createDocumentFragment();
					for(var i=0;i<data.results.length;i++){
						var dt = document.createElement('dt');
						dt.innerHTML= '<div onclick="magi.route.url(\'index#illlist?word='+data.results[i].name+'\')">'+data.results[i].name+'</div>';
						fragment.appendChild(dt);
					}
					$('.hot_tab',_this)[0].style.display='block';
					$('.hottag_2',_this)[0].appendChild(fragment);
				}
			},60000000);
			//热门词加载
			magi.remote.load(api+'?class=history&method=hot',{},function(data){
				if(data.status==200){

					var fragment = document.createDocumentFragment();
					for(var i=0;i<data.results.length;i++){
						var dt = document.createElement('dt');
						dt.innerHTML= '<div onclick="magi.route.url(\'index#illlist?word='+data.results[i].name+'\')">'+data.results[i].name+'</div>';
						fragment.appendChild(dt);
					}
					$('.hot_tab',_this)[0].style.display='block';
					$('.hottag',_this)[0].appendChild(fragment);
				}
			},6000000);
			document.form.word.onfocus=function(){
				if(this.value=='请输入症状或者疾病名') {
					this.value='';
				} 
			}
			document.form.word.oninput=function(){

				var word = $.trim( document.form.word.value );

				if( word && word!='请输入症状或者疾病名'){
					
					magi.remote.load(api+'?class=history&method=lists',{limit:20,word:word},function(data){
						
						if(data.status==200){
							if( data.results.length>0 ){
								var fragment = document.createDocumentFragment();
								for(var i=0;i<data.results.length;i++){
									var li = document.createElement('li');
									li.onclick=(function(i){
										return function(){
											magi.route.url('index#illlist?word='+data.results[i].name);
										}
										
									})(i);
										
									
									li.innerHTML = data.results[i].name+'<span>'+data.results[i].number+'条结果</span>';
									fragment.appendChild(li);
								}
								if( $('.his_list',_this)[0] )  $('.his_list',_this)[0].innerHTML='';
								if( $('.his_tab',_this)[0] ) $('.his_tab',_this)[0].style.display='block';
								if( $('.hot_tab',_this)[0] ) $('.hot_tab',_this)[0].style.display='none';
								if( $('.his_list',_this)[0] ) $('.his_list',_this)[0].appendChild(fragment);
								
							}else{
								if( $('.his_list',_this)[0] ) $('.his_list',_this)[0].innerHTML='';
								if( $('.his_tab',_this)[0] )  $('.his_tab',_this)[0].style.display='none';
								
							}
						}
						
					},600000);
				}else{
					$('.his_list',_this)[0].innerHTML='';
					$('.his_tab',_this)[0].style.display='none';
					$('.hot_tab',_this)[0].style.display='block';
								
				}
			}
			document.form.word.onblur=function(){
				if(this.value=='') {
					this.value='请输入症状或者疾病名';
				}
				$("footer")[0].style.display="block";
			}
			document.form.word.onfocus=function(){
				$("footer")[0].style.display="none";
			}

			document.form.submit.onclick=function(){
				var word = $.trim( document.form.word.value );
				if(  word  && word!='请输入症状或者疾病名' ){
					magi.route.url('index#illlist?word='+word);
				}
			}
	 		
		},
		corp:function(_get){
			
			$('.version',_this)[0].onclick=function(){
				msg({
					html:'软件当前版本'+ver,
					title:'版本升级',
					button:'确定'
				});
			}
			$('.check_up',_this)[0].onclick=function(){
				chk_version();
			}
			
	 		$('.clear_cache',_this)[0].onclick=function(){
	 			localStorage.clear();
	 			msg({
					html:'缓存清除成功！',
					title:'缓存清理',
					button:'确定'
				});
	 		}
		},
		us:function(_get){

	 		
		},
		
		channel:function(){

		},
		illness:function(){
			
			magi.remote.load(api+'?class=illness&method=type_list',{},function(data){
				
				if(data.status==200){

					var fragment = document.createDocumentFragment();
					for(var i = 0;i<data.results.length;i++){
						var row = data.results[i];
						var dt = document.createElement('dt');
						var div = document.createElement('div');
						var img_div = document.createElement('div');
						var desc_div = document.createElement('div');
						desc_div.className='desc';
						desc_div.innerHTML = row.name;
						var img = new Image();
						img.src='img/type/'+row.id+'.png';
						img_div.className='img';
						div.className = 'box';
						img_div.appendChild(img);
						div.appendChild(img_div);
						div.appendChild(desc_div);
						dt.appendChild(div);
						div.onclick=(function(row){
							return function(){
								magi.route.url('index#illlist?id='+row.id);
							} 
						})(row);
						fragment.appendChild(dt);
					}
					$('.illness_type',_this)[0].appendChild(fragment);
					
				}
			},3600000);

		},
		illlist:function(_get){

			var id = (_get.id) ?_get.id :'';
			var word =  (_get.word) ?_get.word :'';
			var start = 0;
			var limit = 20;
			if( word ){
				 $('.s_w',_this)[0].innerHTML='当前搜索“'+word+'”';
				$('.s_w',_this)[0].style.display="block";
				//刷新词
				magi.remote.load(api+'?class=history&method=touch',{word:word},function(data){});
				
			}
			function load(){
				magi.remote.load(api+'?class=illness&method=lists',{id:id,word:word,start:start,limit:limit},function(data){
					if(data.status==200){
						$('h1',_this)[0].innerHTML= (word)?'搜索':data.results.cat_name;
						//输出列表
						var list = data.results.lists;
						if(list.length==0){
							var div=document.createElement('div');
							div.style.heght = '60px';
							div.style.fontSize="18px";
							
							div.style.textAlign = 'center';
							div.style.padding = '20px 20px';
							div.innerHTML = '没有相关的内容！<span style="color:red" onclick="magi.route.url(\'index#search\')">重新搜索</span>';
							$('.ill_list',_this)[0].appendChild(div);
							return false;
						}
						var fragment = document.createDocumentFragment();
						for(var i=0;i<list.length;i++){
							var tags_str = '';
							var i_row = list[i].tags;
							var i_a = [];
							for(var j =0;j<i_row.length;j++){
								i_a.push( i_row[j]['tagall_name'] );
							}
							var dt = document.createElement('dt');
							var div_img =  document.createElement('div');
							var div_other =  document.createElement('div');
							
							var div_desc =  document.createElement('div');
							div_img.className = 'img';
							div_other.className = 'other';
							 
							var img  = new Image();
							img.onload=(function(div_img,img){

								return function(){
									div_img.appendChild(img);
								}
							})(div_img,img)
							img.src=list[i].pic;
							


							dt.onclick=(function(i){
								return function(){
									magi.route.url('index#illdetail?id='+list[i].id);
								}
							})(i);
							var   em_strx =  (list[i].normal=='1') ? "<em>常见</em>" : "";
							div_desc.className ='desc';
							div_desc.innerHTML = '<div class="title">'+list[i].title+' '+em_strx+'<span>'+list[i].master+'</span></div><div class="other">别名：'+(( list[i].other_name && list[i].other_name!='词条标签') ?list[i].other_name:'无')+'</div><div class="tag2">症状：'+i_a.join(' ')+'</div>';
							dt.appendChild(div_img);
							dt.appendChild(div_desc);
							fragment.appendChild(dt)
							// html.push( '<dt onclick="magi.route.url(\'index#illdetail?id='+list[i].id+'\')">');
	 					// 	html.push( '<div class="img"><img src="'+list[i].pic+'"></div>');
					 	// 	html.push( '<div class="desc">');
						 // 	html.push( '<div class="title">'+list[i].title+' '+em_strx+'<span>'+list[i].master+'</span></div>');
						 // 	// html.push( '<div class="other">别名：'+ ( (list[i].other_name!='词条标签') ?list[i].other_name:'无' )+'</div>');
						 // 	html.push( '<div class="tag">症状：'+i_a.join(' ')+'</div>');
					 	// 	html.push( '</div></dt>');
						}
						$('.ill_list',_this)[0].appendChild(fragment);

						$( '.loadmore',_this)[0].style.display = (data.results.is_page_end) ? "none":"block";
						
						$( '.loadmore',_this)[0].onclick=function(){
							start +=limit; 
							load();
						}
					}
				},6000000);
			}
			load();
		},
		illdetail:function(_get){
			var id = (_get.id) ? _get.id:'';
			var uid = get_uid(); 
			magi.remote.load(api+'?class=illness&method=detail',{id:id,uid:uid},function(data){
				if(data.status==200){ 
					$('h1',_this)[0].innerHTML = data.results.title;
					$('#type',_this)[0].innerHTML = data.results.catname;
					$('#master',_this)[0].innerHTML =data.results.master;
					$('#other_name',_this)[0].innerHTML = (data.results.other_name!='词条标签') ?data.results.other_name:'无' ;
					var img = new Image();
					img.onload=function(){
						$('.txt .pcache',_this)[0].appendChild(img);
					}
					img.src= data.results.pic;
					// $('#other_name',_this)[0].innerHTML = data.results.other_name;
					$('.txt',_this)[0].innerHTML = '<div class="pcache"></div>'+data.results.content;
					//是否收藏

					if( data.results.is_fav ==true){
						$('.edit',_this)[0].innerHTML='已收藏'
					}else{
						$('.edit',_this)[0].onclick=function(){
							var uid = get_uid();
							magi.remote.load(api+'?class=fav&method=add',{uid:uid,id:id},function(data){
								if(data.status==200){
									if(data.results==1){
										// msg({html:'收藏成功'})
										//清除本页缓存
										clear_illdetail_cache(id);
										//清除收藏夹缓存
										clear_fav_cache()
										$('.edit',_this)[0].innerHTML='已收藏'
										$('.edit',_this)[0].onclick=undefined;
									}
								}
							})
						}
					}
					//添加TAGS
					if( data.results.tags.length>0 ){
						var fragment = document.createDocumentFragment();
						for(var i=0;i<data.results.tags.length;i++){
							var li = document.createElement('li');
							li.innerHTML=data.results.tags[i].tagall_name;
							li.onclick=(function(i){
								return function(){
									magi.route.url('index#result?select='+data.results.tags[i].tagall_name);
								}
							})(i);
							fragment.appendChild(li);
						}
						$('.itags',_this)[0].appendChild(fragment);
					}else{
						$('.itags',_this)[0].innerHTML='暂无'
					}
					
				}
			},36000000);
			// });
			$('.btn-back',_this)[0].onclick=function(){
				magi.route.back();
			}


		},
		fav:function(_get){
			var uid = get_uid();
			var no_record =  '<div style="text-align:center;margin:20px 0px;font-size:18px;">暂时没有收藏！</div>';
					
			magi.remote.load(api+'?class=fav&method=lists',{uid:uid},function(data){
				if(data.status==200){
					if(data.results.length>0){
						$('.edit',_this)[0].style.display='block';
						var fragment = document.createDocumentFragment();

						for(var i=0;i<data.results.length;i++){
							var dt = document.createElement('dt');
							var img_div = document.createElement('div');
							img_div.className = 'img';
							var img = new Image();
							img.onload=(function(img_div,img){
								return function(){
									img_div.appendChild(img);
								}
							})(img_div,img);
							img.src = data.results[i].pic;
							img_div.onclick=(function(i){
								return function(){
									magi.route.url('index#illdetail?id='+data.results[i].id);
								}
							})(i);

							var pdr50_div = document.createElement('div');
							pdr50_div.className = 'pdr50';
							pdr50_div.onclick=(function(i){
								return function(){
									magi.route.url('index#illdetail?id='+data.results[i].id);
								}

							})(i);

							var img_title = document.createElement('div');
							img_title.className ='title';
							img_title.innerHTML=data.results[i].title

							var img_other = document.createElement('div');
							img_other.className = 'other';
							img_other.innerHTML='日期：'+data.results[i].created_at

							var img_other2 = document.createElement('div');
							img_other2.className = 'other';
							img_other2.innerHTML='对象：'+data.results[i].master;

							var delete_div = document.createElement('div');
							delete_div.className = 'delete';
							delete_div.innerHTML = '删除';
							delete_div.onclick=(function(i){
								 
								return function(){
									var self = this;
									clear_fav_cache();
									clear_illdetail_cache( data.results[i].id )
									magi.remote.load(api+'?class=fav&method=delete',{id:data.results[i].id,uid:uid},function(data){
										if(data.status==200){
											// msg({html:'删除成功！'});
											var removedt = self.parentNode;
											removedt.parentNode.removeChild(removedt);
											if( $('.ill_list dt',_this).length==0 ) {
												$('.edit',_this)[0].style.display='none';
												$('.ill_list',_this)[0].innerHTML = no_record;
											}
											
										}
									});
								}
							})(i);

							pdr50_div.appendChild(img_title);
							pdr50_div.appendChild(img_other);
							pdr50_div.appendChild(img_other2);
							dt.appendChild(img_div);
							dt.appendChild(pdr50_div);
							dt.appendChild(delete_div);
							fragment.appendChild(dt)
						}
						$('.ill_list',_this)[0].appendChild(fragment);

					}else{
						$('.ill_list',_this)[0].innerHTML = no_record;
						$('.edit',_this)[0].style.display='none';
					}
				}
			},60000000);


			$('header .edit',_this)[0].onclick=function(){
				var list = $('.pdr50',_this);
				var del = $('.delete',_this);
				var val = this.innerHTML;
				if(val=='编辑'){
					this.innerHTML = '取消';
					for(var i=0;i<list.length;i++){
						list[i].style.right='66px';
						del[i].style.display='block';
					}
				}else{
					this.innerHTML = '编辑';
					for(var i=0;i<list.length;i++){
						list[i].style.right='0px';
						del[i].style.display='none';
					}
				}
			}
		}



	}

})($);