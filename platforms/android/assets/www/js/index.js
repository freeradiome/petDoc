/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
         var footer = document.getElementsByTagName('footer');
        footer[0].style.width=document.body.clientWidth + 'px';
        var li = $('footer ul li');
        window.xfocus =  function(obj){
            for(var i=0;i<li.length;i++){
                li[i].className='';
            }
            obj.className='hover';
        }
       // window.api = 'http://www.missmis.com/public/pet/';
       window.api = 'http://www.freeradio.cn/pet/';
       window.ver = 1.7;
       magi.startup({   
            is_mvc:true,
            controller_path:'controller/',
            module_path:'model/',
            view_path:'themes/',
            default_controller:'index',
            default_action:'index', 
            default_page_effection:'none',
            // default_page_effection:'none',
            // default_query:{me:'56'},
            allow_browser_url_change:true,
            // is_use_tpl_cache:false,
            is_use_tpl_cache:true,
            is_use_tpl_memcache:false,
            // tpl_rule:'{$class}.{$method}.php'
            
            app_playground_obj:$('#this_doc')[0]
            // extend_utility:['app.config.js']
        });

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
     
    }
};
