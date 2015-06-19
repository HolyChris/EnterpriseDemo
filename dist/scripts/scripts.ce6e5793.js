"use strict";angular.module("ersApp",["ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ngRoute","ngSanitize","ngTouch","ui.sortable","ui.router","angular-table","flash","config"]).config(["$stateProvider","$urlRouterProvider",function(a,b){a.state("main",{url:"/",templateUrl:"views/main.html",controller:"MainCtrl"}).state("customers",{url:"/customers",templateUrl:"views/customer.html",controller:"AboutCtrl"}).state("newcustomer",{url:"/customers/new",templateUrl:"views/new_customer.html",controller:"NewCustomerCtrl"}).state("customers.overview",{url:"/overview",templateUrl:"views/customer_overview.html"}).state("sites",{url:"/sites",templateUrl:"views/sites.html",controller:"SitesCtrl"}).state("newsite",{url:"/sites/new",templateUrl:"views/new_site.html",controller:"NewSiteCtrl"}).state("overview",{url:"/overview",templateUrl:"views/overview.html",controller:"OverviewCtrl"}).state("overview.project",{url:"/project",templateUrl:"views/overview_project.html"}).state("overview.contract",{url:"/contract",templateUrl:"views/overview_contract.html"}).state("overview.project_doc",{url:"/project-documents",templateUrl:"views/overview_project_doc.html"}).state("overview.project_doc.photos",{url:"/photos",templateUrl:"views/overview_project_doc-photos.html"}).state("overview.production",{url:"/production",templateUrl:"views/overview_production.html"}),b.otherwise("/")}]),angular.module("ersApp").controller("SitesCtrl",["$scope","$http","ENV",function(a,b,c){a.config={itemsPerPage:10},a.state_abb=["MI","SD","WA","WI","AZ","IL","NH","NC","KS","MO","AR","NV","DC","ID","NE","PA","HI","UT","VT","DE","RI","OK","LA","MT","TN","MD","FL","VA","MN","NJ","OH","CA","ND","ME","IN","TX","OR","WY","AL","IA","MS","KY","NM","GA","CO","MA","CT","NY","SC","AK","WV","AA","AE","AP"],a.selected=1,a.isActive=function(b){return a.selected===b},a.gotopage=function(d){a.selected=d,b({method:"GET",url:c.apiEndpoint+"/api/v1/sites?page="+d,headers:{"Content-type":"application/json"}}).success(function(b){a.sites=b,a.siteList=b.sites}).error(function(){alert("error")})},a.pagerange=function(a,b,c){c=c||1;for(var d=[],e=a;b>=e;e+=c)d.push(e);return d},a.findSites=function(d,e,f,g,h,i){var j=[];angular.isUndefined(d)||""==d.trim()||j.push("q[managers_email_eq]="+d),angular.isUndefined(e)||""==e.trim()||j.push("q[name_cont]="+e),angular.isUndefined(f)||""==f.trim()||j.push("q[address_address1_cont]="+f),angular.isUndefined(g)||""==g.trim()||j.push("q[address_city_cont]="+g),angular.isUndefined(h)||""==h.trim()||j.push("q[address_state_id_eq]="+h),angular.isUndefined(i)||""==i.trim()||j.push("q[address_zipcode_eq]="+i);var k="",l=0;for(l=0;l<j.length;l++)l>0&&(k+="&"),k+=j[l];""!=k&&(k="?"+k),b({method:"GET",url:c.apiEndpoint+"/api/v1/sites"+k,headers:{"Content-type":"application/json"}}).success(function(b){a.sites=b,a.siteList=b.sites}).error(function(){alert("error")})},b({method:"GET",url:c.apiEndpoint+"/api/v1/sites",headers:{"Content-type":"application/json"}}).success(function(b){a.sites=b,a.siteList=b.sites}).error(function(){alert("error")})}]),angular.module("ersApp").run(["$http",function(a){a.defaults.headers.common={"X-Auth-Token":"D2EdWKgbs8cq9PHyLhrA"}}]).controller("MainCtrl",["$scope","$http","$window","$location","ENV",function(a,b,c,d,e){var f,g,h;a.sortableOptionsList=[{placeholder:"card-highlight",cursor:"-webkit-grabbing",items:".pipe-card:not(.create-opp)",start:function(a,b){h=b.item,g=f=b.item.parent()},stop:function(a,b){d.path("/overview/contract")},change:function(a,b){b.sender&&(g=b.placeholder.parent())},connectWith:"#con-cards"},{connectWith:"#pro-cards,#opp-cards",placeholder:"card-highlight",cursor:"-webkit-grabbing",start:function(a,b){h=b.item,g=f=b.item.parent()},stop:function(a,b){d.path("/overview/production")},change:function(a,b){b.sender&&(g=b.placeholder.parent())}},{connectWith:"#con-cards,#post-cards",placeholder:"card-highlight",cursor:"-webkit-grabbing",start:function(a,b){h=b.item,g=f=b.item.parent()},stop:function(a,b){},change:function(a,b){b.sender&&(g=b.placeholder.parent())}},{connectWith:"#pro-cards,#close-cards",placeholder:"card-highlight",cursor:"-webkit-grabbing",start:function(a,b){h=b.item,g=f=b.item.parent()},stop:function(a,b){},change:function(a,b){b.sender&&(g=b.placeholder.parent())}},{connectWith:"#post-cards",placeholder:"card-highlight",cursor:"-webkit-grabbing",items:".pipe-card:not(.out-amount)",start:function(a,b){h=b.item,g=f=b.item.parent()},stop:function(a,b){},change:function(a,b){b.sender&&(g=b.placeholder.parent())}}],a.state_abb=["MI","SD","WA","WI","AZ","IL","NH","NC","KS","MO","AR","NV","DC","ID","NE","PA","HI","UT","VT","DE","RI","OK","LA","MT","TN","MD","FL","VA","MN","NJ","OH","CA","ND","ME","IN","TX","OR","WY","AL","IA","MS","KY","NM","GA","CO","MA","CT","NY","SC","AK","WV","AA","AE","AP"],b({method:"GET",url:e.apiEndpoint+"/api/v1/sites",headers:{"Content-type":"application/json"}}).success(function(b){a.recent_sites=b}).error(function(){alert("error")}),b({method:"GET",url:e.apiEndpoint+"/api/v1/sites?stage=Opportunity",headers:{"Content-type":"application/json"}}).success(function(b){a.opportunities=b}).error(function(){alert("error")}),b({method:"GET",url:e.apiEndpoint+"/api/v1/sites?stage=UnderContract",headers:{"Content-type":"application/json"}}).success(function(b){a.contracts=b}).error(function(){alert("error")}),b({method:"GET",url:e.apiEndpoint+"/api/v1/sites?stage=Production",headers:{"Content-type":"application/json"}}).success(function(b){a.productions=b}).error(function(){alert("error")}),b({method:"GET",url:e.apiEndpoint+"/api/v1/sites?stage=Billing",headers:{"Content-type":"application/json"}}).success(function(b){a.billings=b}).error(function(){alert("error")})}]),angular.module("ersApp").run(["$http",function(a){a.defaults.headers.common={"X-Auth-Token":"D2EdWKgbs8cq9PHyLhrA"}}]).controller("NewSiteCtrl",["$scope","$location","$http","ENV","Flash",function(a,b,c,d,e){b.search().customerId&&(a.customer_id=b.search().customerId),a.flag=0,a.siteAddress={},a.billAddress={},a.siteDetail={},a.$watch("billingIsSameAsSite",function(b){b?(a.flag=1,a.billAddress=a.siteAddress):(a.flag=0,a.billAddress=angular.copy(a.billAddress))}),a.state_abb=["MI","SD","WA","WI","AZ","IL","NH","NC","KS","MO","AR","NV","DC","ID","NE","PA","HI","UT","VT","DE","RI","OK","LA","MT","TN","MD","FL","VA","MN","NJ","OH","CA","ND","ME","IN","TX","OR","WY","AL","IA","MS","KY","NM","GA","CO","MA","CT","NY","SC","AK","WV","AA","AE","AP"],a.siteSource=["Qualified Storm Leads","Commercial Call Leads","Self-Generated","Canvasser","Call in Leads","Mailer","Sign","Website","Friend","Neighbor","Truck Sign","Call/Knock","Other","Existing Customer"],a.newSite=function(f,g,h){c({method:"POST",url:d.apiEndpoint+"/api/v1/sites?customer_id="+a.customer_id+"&name="+g.name+"&contact_name="+g.contact_name+"&contact_phone="+g.contact_phone+"&manage_ids[]=1&manage_ids[]=2&source="+g.source+"&source_info="+g.source_info+"&status="+g.status+"&damage="+g.damage+"&address_attributes[address1]="+f.address1+"&address_attributes[address2]="+f.address2+"&address_attributes[city]="+f.address2+"&address_attributes[state_id]="+f.state_id+"&address_attributes[zipcode]="+f.zipcode+"&bill_addr_same_as_addr="+a.flag+"&bill_address_attributes[address1]="+h.address1+"&bill_address_attributes[address2]="+h.address2+"&bill_address_attributes[city]="+h.city+"&bill_address_attributes[state_id]="+h.state_id+"&bill_address_attributes[zipcode]="+h.zipcode,headers:{"Content-type":"application/json"}}).success(function(a){e.create("success","Site created succesfully"),b.path("/sites");var c={siteId:a.site.id};b.path("/overview/project").search(c)}).error(function(b){a.errors=b.errors,e.create("danger","Site was not created")})}}]),angular.module("ersApp").controller("NewCustomerCtrl",["$scope","$http","$location","ENV","Flash",function(a,b,c,d,e){a.user={},a.phone_number={},a.newCustomer=function(f,g){b({method:"POST",url:d.apiEndpoint+"/api/v1/customers?phone_numbers_attributes[0][number]="+g.number+"&phone_numbers_attributes[0][num_type]=1&phone_numbers_attributes[0][primary]=true",params:f,headers:{"Content-type":"application/json"}}).success(function(b){a.customers=b;var d='You have succesfully created a customer. <a href="#" class="alert-link">Click here to create a site </a> for this customer.';e.create("success",d),a.Flash=e,a.custList=b.customers,c.path("/customers/overview")}).error(function(b){a.errors=b.errors,e.create("danger","Customer was not created see errors below")})},a.newCustomerThenSite=function(f,g){b({method:"POST",url:d.apiEndpoint+"/api/v1/customers?phone_numbers_attributes[0][number]="+g.number+"&phone_numbers_attributes[0][num_type]=1&phone_numbers_attributes[0][primary]=true",params:f,headers:{"Content-type":"application/json"}}).success(function(b){a.customers=b;var d="You have succesfully created a customer.";e.create("success",d),a.Flash=e,a.custList=b.customers;var f={customerId:b.customer.id};c.path("/sites/new").search(f)}).error(function(b){a.errors=b.errors,e.create("danger","Customer was not created see errors below")})}}]),angular.module("ersApp").controller("AboutCtrl",["$scope","$http","ENV","Flash",function(a,b,c,d){a.config={itemsPerPage:10},a.selected=1,a.Flash=d,a.isActive=function(b){return a.selected===b},a.gotopage=function(d){a.selected=d,b({method:"GET",url:c.apiEndpoint+"/api/v1/customers?page="+d,headers:{"Content-type":"application/json"}}).success(function(b){a.customers=b,a.custList=b.customers}).error(function(){alert("error")})},b({method:"GET",url:c.apiEndpoint+"/api/v1/customers",headers:{"Content-type":"application/json"}}).success(function(b){a.customers=b,a.custList=b.customers}).error(function(){alert("error")}),a.pagerange=function(a,b,c){c=c||1;for(var d=[],e=a;b>=e;e+=c)d.push(e);return d}}]),angular.module("ersApp").controller("OverviewCtrl",["$scope","$location","$http","ENV",function(a,b,c,d){a.config={itemsPerPage:10},b.search().siteId&&c({method:"GET",url:d.apiEndpoint+"/api/v1/sites/"+b.search().siteId,headers:{"Content-type":"application/json"}}).success(function(b){a.project=b.site,a.project_title=a.project.customer.firstname+" "+a.project.customer.lastname,a.project.customer.bussinessname&&(a.project_title=a.project.customer.bussinessname+" - "+a.project_title)}).error(function(){alert("error")}),a.photoList=[{stage:"contract",thumbnail:"/images/thumb1.png",title:"john doe-roof 1"},{stage:"lead",thumbnail:"/images/thumb3.png",title:"john doe-roof 3"},{stage:"lead",thumbnail:"/images/thumb3.png",title:"john doe-roof 3"},{stage:"lead",thumbnail:"/images/thumb3.png",title:"john doe-roof 3"},{stage:"lead",thumbnail:"/images/thumb3.png",title:"john doe-roof 3"},{stage:"lead",thumbnail:"/images/thumb2.png",title:"john doe-roof 2"},{stage:"lead",thumbnail:"/images/thumb3.png",title:"john doe-roof 3"},{stage:"lead",thumbnail:"/images/thumb3.png",title:"john doe-roof 3"},{stage:"lead",thumbnail:"/images/thumb3.png",title:"john doe-roof 3"},{stage:"lead",thumbnail:"/images/thumb2.png",title:"john doe-roof 2"},{stage:"lead",thumbnail:"/images/thumb3.png",title:"john doe-roof 3"},{stage:"lead",thumbnail:"/images/thumb3.png",title:"john doe-roof 3"},{stage:"lead",thumbnail:"/images/thumb3.png",title:"john doe-roof 3"},{stage:"lead",thumbnail:"/images/thumb2.png",title:"john doe-roof 2"},{stage:"lead",thumbnail:"/images/thumb3.png",title:"john doe-roof 3"},{stage:"lead",thumbnail:"/images/thumb3.png",title:"john doe-roof 3"},{stage:"lead",thumbnail:"/images/thumb3.png",title:"john doe-roof 3"},{stage:"lead",thumbnail:"/images/thumb2.png",title:"john doe-roof 2"},{stage:"lead",thumbnail:"/images/thumb3.png",title:"john doe-roof 3"}],a.docList=[{doc_type:"material list",doc_name:"johndoe_materialist.docx"},{doc_type:"material list",doc_name:"johndoe_materialist.docx"},{doc_type:"material list",doc_name:"johndoe_materialist.docx"},{doc_type:"material list",doc_name:"johndoe_materialist.docx"},{doc_type:"material list",doc_name:"johndoe_materialist.docx"},{doc_type:"material list",doc_name:"johndoe_materialist.docx"},{doc_type:"material list",doc_name:"johndoe_materialist.docx"},{doc_type:"material list",doc_name:"johndoe_materialist.docx"},{doc_type:"material list",doc_name:"johndoe_materialist.docx"},{doc_type:"material list",doc_name:"johndoe_materialist.docx"},{doc_type:"material list",doc_name:"johndoe_materialist.docx"},{doc_type:"material list",doc_name:"johndoe_materialist.docx"},{doc_type:"material list",doc_name:"johndoe_materialist.docx"},{doc_type:"material list",doc_name:"johndoe_materialist.docx"},{doc_type:"material list",doc_name:"johndoe_materialist.docx"},{doc_type:"material list",doc_name:"johndoe_materialist.docx"},{doc_type:"material list",doc_name:"johndoe_materialist.docx"}]}]),angular.module("config",[]).constant("ENV",{name:"development",apiEndpoint:"http://54.68.73.69"});