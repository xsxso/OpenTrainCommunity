"use strict";!function(){var t=angular.module("RouteExplorer",["ngRoute","ui.bootstrap","ui.bootstrap.buttons","leaflet-directive","highcharts-ng"]);t.constant("env",{baseDir:"/static/ui/RouteExplorer"}),t.config(["$routeProvider","env",function(t,e){var n=function(t){return e.baseDir+"/tpls/"+t+".html"};t.when("/",{pageId:"welcome",templateUrl:n("SelectStops"),controller:"SelectStopsController",resolve:{Layout:"Layout"}}).when("/about",{pageId:"about",templateUrl:n("About")}).when("/:period/select-route/:origin/:destination",{pageId:"routes",templateUrl:n("SelectRoute"),controller:"SelectRouteController",resolve:{Layout:"Layout"},reloadOnSearch:!1}).when("/:period/routes/:routeId",{pageId:"route",templateUrl:n("RouteDetails"),controller:"RouteDetailsController",resolve:{Layout:"Layout"},reloadOnSearch:!1}).when("/heat-map",{pageId:"heatMap",templateUrl:n("HeatMap"),controller:"HeatMapController",reloadOnSearch:!1,resolve:{Layout:"Layout"}}).when("/graphs",{pageId:"graphs",templateUrl:n("Graphs"),controller:"GraphsController",reloadOnSearch:!1,resolve:{Layout:"Layout"}}).when("/routes",{pageId:"routes",templateUrl:n("Routes"),controller:"RoutesController",reloadOnSearch:!1,resolve:{Layout:"Layout"}}).otherwise({redirectTo:"/"})}])}(),String.prototype.repeat||(String.prototype.repeat=function(t){if(null===this)throw new TypeError("can't convert "+this+" to object");var e=""+this;if(t=+t,t!=t&&(t=0),0>t)throw new RangeError("repeat count must be non-negative");if(t==1/0)throw new RangeError("repeat count must be less than infinity");if(t=Math.floor(t),0===e.length||0===t)return"";if(e.length*t>=1<<28)throw new RangeError("repeat count must not overflow maximum string size");for(var n="";1==(1&t)&&(n+=e),t>>>=1,0!==t;)e+=e;return n}),angular.module("RouteExplorer").controller("AppController",["$scope","$location",function(t,e){"ngInject";t.share=function(t){var n=t+encodeURIComponent("http://otrain.org/#"+e.url());window.open(n,"sharePopup","width=600,height=550,top=100,left=100,location=no,scrollbar=no,status=no,menubar=no")},t.$on("$routeChangeSuccess",function(e,n){t.bodyClass=n.pageId?"rex-page-"+n.pageId:null})}]),angular.module("RouteExplorer").constant("daysTable",[{value:0,name:"ראשון"},{value:1,name:"שני"},{value:2,name:"שלישי"},{value:3,name:"רביעי"},{value:4,name:"חמישי"},{value:5,name:"שישי"},{value:6,name:"שבת"}]).constant("monthNames",["dummy","ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"]).constant("hoursList",[{name:"4-7",values:[4,5,6]},{name:"7-9",values:[7,8]},{name:"9-12",values:[9,10,11]},{name:"12-15",values:[12,13,14]},{name:"15-18",values:[15,16,17]},{name:"18-21",values:[18,19,20]},{name:"21-24",values:[21,22,23]},{name:"24-4",values:[0,1,2,3]}]),angular.module("RouteExplorer").controller("GraphsController",["$scope","$http","$q","$timeout","$location","Layout","daysTable","hoursList","monthNames",function(t,e,n,r,o,a,i,u,s){"ngInject";t.wip=!0,t.Layout=a,t.input={graphKind:"perDay"},t.refresh=function(){t.wip=!0,t.startStop=t.input.startStop,t.endStop=t.input.endStop,t.startDate=t.input.startDate.value,t.endDate=t.input.endDate.value,o.search({startStop:t.startStop.id,endStop:t.endStop.id,startDate:t.startDate,endDate:t.endDate}),t.stops=a.getStops(),t.stopsById={},t.stops.forEach(function(e){t.stopsById[e.id]=e});var r=[e.get("/api/v1/stats/from-to-full/",{params:{from_date:t.startDate,to_date:t.endDate,from_stop:t.startStop.id,to_stop:t.endStop.id}}).then(function(e){t.stat=e.data.table}),e.get("/api/v1/stops/from-to/",{params:{from_stop:t.startStop.id,to_stop:t.endStop.id}}).then(function(e){t.fromToStopsIds=e.data,t.fromToStops=t.fromToStopsIds.map(function(e){return t.stopsById[e]})})];n.all(r).then(function(){t.wip=!1,t.updateChart()})},t.getRouteTitle=function(t){return"מ"+t.from+" ל"+t.to+" ("+t.count+" נסיעות)"},t.initData=function(){return t.buildDates()},t.buildDates=function(){return e.get("/api/v1/general/dates-range").then(function(e){var n=e.data,r=[n.first_date.month,n.first_date.year],o=[n.last_date.month,n.last_date.year];t.buildDatesRange(r,o)})},t.buildDatesRange=function(e,n){for(t.startDates=[],t.endDates=[];;){t.startDates.push({name:s[e[0]]+" "+e[1],value:"1-"+e[0]+"-"+e[1]});var r=12==e[0]?[1,e[1]+1]:[e[0]+1,e[1]];if(t.endDates.push({name:s[e[0]]+" "+e[1],value:"1-"+r[0]+"-"+r[1]}),t.startDates.length>100)return void alert("error");if(e[0]==n[0]&&e[1]==n[1])return;e=[r[0],r[1]]}},t.computePerDaySeries=function(){var e={};t.stat.forEach(function(t){var n=t.stop_id+"-"+t.week_day_local;e[n]=e[n]||{num_trips:0,arrival_late_count:0},e[n].num_trips+=t.num_trips,e[n].arrival_late_count+=t.arrival_late_count});var n=[];return i.forEach(function(r){var o=t.fromToStops.map(function(t){var n=e[t.id+"-"+r.value],o={};return n?(o.y=100*n.arrival_late_count/n.num_trips,o.numTrips=n.num_trips):(o.y=0,o.numTrips=0,console.log("no entry for "+t.id+" "+r.value)),o.lineName=r.name,o});n.push({name:r.name,data:o})}),n},t.computePerHoursSeries=function(){var e={},n={};u.forEach(function(t){t.values.forEach(function(e){n[e]=t})}),t.stat.forEach(function(t){var r=n[t.hour_local].name,o=t.stop_id+"-"+r;e[o]=e[o]||{num_trips:0,arrival_late_count:0},e[o].num_trips+=t.num_trips,e[o].arrival_late_count+=t.arrival_late_count});var r=[];return u.forEach(function(n){var o=t.fromToStops.map(function(t){var r=e[t.id+"-"+n.name],o={};return r?(o.y=100*r.arrival_late_count/r.num_trips,o.numTrips=r.num_trips):(console.log("no entry for "+t.id+" "+n.name),o.y=0,o.numTrips=0),o.lineName=n.name,o});r.push({name:n.name,data:o})}),r},t.updateChart=function(){var e=t.fromToStops.map(function(t,e){return t.name+" - "+(e+1)});t.perDaySeries=t.computePerDaySeries(),t.perHoursSeries=t.computePerHoursSeries();var n={formatter:function(){var t=Math.round(100*this.y)/100;return'<span dir="rtl"><b>'+this.x+"</b><br/><span>"+this.point.lineName+"</span><br/><span>רכבות מאחרות:</span>"+t+"%<br/><span>מספר רכבות: </span>"+this.point.numTrips+"</span>"},useHTML:!0};t.chartPerDay={options:{chart:{type:"line"},title:{text:"איחור בחתך יומי"},tooltip:n},xAxis:{reversed:!0,categories:e,useHTML:!0},yAxis:{opposite:!0,useHTML:!0,title:{text:"אחוזי איחור"}},series:t.perDaySeries},t.chartPerHour={options:{chart:{type:"line"},title:{text:"אישור בחתך שעתי"},tooltip:n},yAxis:{useHTML:!0,opposite:!0,title:{text:"אחוזי איחור"}},xAxis:{useHTML:!0,reversed:!0,categories:e},tooltip:{useHTML:!0},series:t.perHoursSeries}},t.findDate=function(t,e){for(var n=0;n<t.length;n++)if(t[n].value==e)return t[n];return null},t.initData().then(function(){var e=o.search();t.input.startDate=t.findDate(t.startDates,e.startDate)||t.startDates[t.startDates.length-1],t.input.endDate=t.findDate(t.endDates,e.endDate)||t.endDates[t.endDates.length-1],t.input.startStop=a.findStop(e.startStop||400),t.input.endStop=a.findStop(e.endStop||3700),t.refresh()})}]),angular.module("RouteExplorer").controller("HeatMapController",["$scope","$http","Layout",function(t,e,n){"ngInject";t.Layout=n;var r=t.Layout.findStop(4600);console.log(r),angular.extend(t,{defaults:{scrollWheelZoom:!1},center:{lat:r.latlon[0],lng:r.latlon[1],zoom:10}}),t.stops=n.getStops(),t.input={stop:t.stops[0]},t.paths=[],e.get("/api/v1/heat-map/").then(function(e){t.heatmapData=e.data,t.heatmapData.forEach(function(e){var n=t.Layout.findStop(e.stop_id).latlon,r=255-Math.floor(255*e.score),o="rgb(255,"+r+",0)",a=t.Layout.findStop(e.stop_id).name+"<br/>"+Math.floor(100*e.score)/100;t.paths.push({color:o,fillColor:o,fillOpacity:1,type:"circleMarker",stroke:!1,radius:10,latlngs:n,message:a,popupOptions:{className:"ot-popup"}})})})}]),angular.module("RouteExplorer").controller("RouteDetailsController",["$scope","$route","$http","$location","LocationBinder","Layout","Locale","TimeParser",function(t,e,n,r,o,a,i,u){"ngInject";function s(t,e){return t=t||"all",e=e||"all",_[t]&&_[t][e]?_[t][e]:null}function l(){var e=s(t.selectedDay,t.selectedTime);return e?e.stops:[]}function p(e){t.times=[];var n={};for(var r in e){var o=e[r],a="all"==o.info.hours?"all":o.info.hours[0]+"-"+o.info.hours[1],i=o.info.week_day;if(_[i]||(_[i]={}),_[i][a]=o,"all"!=a&&!n[a]){var u={id:a,from:c(o.info.hours[0]),to:c(o.info.hours[1])};n[a]=u,t.times.push(u)}}}function c(t){return("0"+t%24).slice(-2)+":00"}function d(t){return i.months[t.getMonth()].name+" "+t.getFullYear()}function f(t,e){var n=new Date(t);return n.setMonth(n.getMonth()+e),n}function m(t,e){var n=12*(t.to.getFullYear()-t.from.getFullYear())+t.to.getMonth()-t.from.getMonth()+1;return{from:f(t.from,n*e),to:f(t.to,n*e),end:f(t.end,n*e)}}var h=e.current.params,g=u.parsePeriod(h.period),v=u.createRequestString(g.from),y=u.createRequestString(g.end),D=h.routeId,S=a.findRoute(D).stops,_={};t.loaded=!1,t.stopIds=S,t.origin=S[0],t.destination=S[S.length-1],t.selectedPeriod=d(g.from),g.to>g.from&&(t.selectedPeriod+=" — "+d(g.to)),t.selectedDay=null,t.days=i.days,t.selectedTime=null,t.times=[],t.selectRouteUrl="#/"+h.period+"/select-route/"+t.origin+"/"+t.destination;var R=m(g,-1),b=m(g,1),x=a.getRoutesDateRange(),T=864e6;t.previousPeriodUrl=x.min.getTime()-T<R.from.getTime()?"#/"+u.formatPeriod(R)+"/routes/"+D:null,t.nextPeriodUrl=x.max>b.to?"#/"+u.formatPeriod(b)+"/routes/"+D:null,n.get("/api/v1/stats/route-info-full",{params:{route_id:D,from_date:v,to_date:y}}).success(function(e){p(e),t.loaded=!0}),o.bind(t,"selectedDay","day",function(t){return t?Number(t):null}),o.bind(t,"selectedTime","time"),t.stopStats=function(t){var e=l();for(var n in e)if(e[n].stop_id==t)return e[n];return null},t.stopName=function(t){var e=a.findStop(t);return e?e.name:null},t.isDayEmpty=function(t){var e=t.id,n=_[e];if(!n)return!0;for(var r in n)if(n[r].info.num_trips>0)return!1;return!0},t.isTimeEmpty=function(e){var n=t.selectedDay||"all",r=e.id,o=_[n]&&_[n][r];return o&&o.info.num_trips>0?!1:!0},t.tripCount=function(t,e){var n=s(t,e);return n?n.info.num_trips:0}}]),angular.module("RouteExplorer").controller("RoutesController",["$scope","$http","$q","$timeout","$location","Layout","daysTable","hoursList","monthNames",function(t,e,n,r,o,a,i,u,s){"ngInject";t.getMonths=function(){return[1,2,3,4,5,6,7,8,9,10,11,12]},t.getYears=function(){for(var t=[],e=(new Date).getFullYear(),n=2015;e>=n;)t.push(n),n++;return console.log(t),t},t.init=function(){t.months=t.getMonths(),t.years=t.getYears()},t.refresh=function(){console.log("refreshing")},t.init()}]),angular.module("RouteExplorer").controller("SelectRouteController",["$scope","$http","$location","$route","Layout","TimeParser",function(t,e,n,r,o,a){"ngInject";function i(e){t.stats=e}function u(t){var e=o.findStop(t);return e?e.name:null}function s(t){function e(t){var e={};for(var n in t){var r=t[n];for(var o in r.stops){var a=r.stops[o];e[a]||(e[a]=0),e[a]++}}return e}function n(t,e){var n={};for(var r in t)t[r]==e&&(n[r]=!0);return n}function r(t,e){var n,r=[];for(var o in t){var a=t[o];o>0&&o<t.length-1&&e[a]?(n||(n=[],r.push(n)),n.push(a)):(n=null,r.push(a))}return r}var o=n(e(t),t.length);delete o[p.id],delete o[c.id];for(var a in t)t[a].stops=r(t[a].stops,o)}t.stops=o.getStops();var l=a.parsePeriod(r.current.params.period),p=o.findStop(r.current.params.origin),c=o.findStop(r.current.params.destination),d=["startStop="+p.id,"endStop="+c.id,"startDate="+a.createRequestString(l.from,"-"),"endDate="+a.createRequestString(l.end,"-")];t.graphsUrl="#/graphs?"+d.join("&"),e.get("/api/v1/stats/path-info-full/",{params:{origin:p.id,destination:c.id,from_date:a.createRequestString(l.from),to_date:a.createRequestString(l.end)}}).success(function(e){i(e),t.loaded=!0});o.findRoutesByPeriod(p.id,c.id,l.from,l.end).then(function(e){e.length>1&&s(e),t.routes=e}),t.isCollapsed=function(t){return angular.isArray(t)},t.isOrigin=function(t){return t==p.id},t.isDestination=function(t){return t==c.id},t.stopText=function(e){return t.isCollapsed(e)?"•".repeat(e.length):u(e)},t.stopTooltip=function(e){return t.isCollapsed(e)?e.map(u).join(", "):null},t.barWidth=function(e){var n=100*e.count/t.routes[0].count;return 1>n?"1px":n+"%"},t.routeUrl=function(t){return"/#/"+r.current.params.period+"/routes/"+t.id}}]),angular.module("RouteExplorer").controller("SelectStopsController",["$scope","$rootScope","$location","Layout","Locale","TimeParser",function(t,e,n,r,o,a){"ngInject";function i(t,e){t.getFullYear()<2013&&(t=new Date(2013,0,1));for(var n=[],r=new Date(t.getFullYear(),t.getMonth(),1);e>r;){var a=new Date(r.getFullYear(),r.getMonth()+1,r.getDate()),i={from:r,to:r,end:a,name:o.months[r.getMonth()].name+" "+r.getFullYear()};i.toName=o.until+i.name,n.push(i),r=a}return n.reverse(),n}t.stops=r.getStops(),t.origin=null,t.destination=null,t.months=o.months;var u=r.getRoutesDateRange();t.periods=i(u.min,u.max),t.startPeriod=t.periods[0],t.endPeriod=t.periods[0],t.formValid=function(){return!!t.origin&&!!t.destination&&t.origin!=t.destination&&t.startPeriod.from<=t.endPeriod.to},t.stopName=function(t){var e=r.findStop(t);return e?e.name:null},t.goToRoutes=function(){t.noRoutes=!1,t.loading=!0;var e={from:t.startPeriod.from,to:t.endPeriod.to,end:t.endPeriod.end},o=e.from,i=e.end,u=a.formatPeriod(e);r.findRoutesByPeriod(t.origin.id,t.destination.id,o,i).then(function(e){0===e.length?t.noRoutes=!0:1==e.length?n.path("/"+u+"/routes/"+e[0].id):n.path("/"+u+"/select-route/"+t.origin.id+"/"+t.destination.id)})["finally"](function(){t.loading=!1})},t.dismissError=function(){t.noRoutes=!1}}]),angular.module("RouteExplorer").controller("TimesDetailsController",["$scope","$route","Locale","LocationBinder","Layout",function(t,e,n,r,o){"ngInject";function a(t){return("0"+t%24).slice(-2)+":00"}function i(){var e=u(t.selectedDay,t.selectedTime);return e?e.stops:[]}function u(t,e){return t=t||"all",e=e||"all",s[t]&&s[t][e]?s[t][e]:null}o.then(function(e){t.layout=e}),t.layout=null;var s={},l=e.current.params;t.stopIds=[parseInt(l.origin),parseInt(l.destination)],r.bind(t,"selectedDay","day",function(t){return t?Number(t):null}),r.bind(t,"selectedTime","time"),t.stopName=function(e){if(t.layout){var n=t.layout.findStop(e);return n?n.name:null}return null},t.selectedDay=null,t.days=n.days,t.selectedTime=null,t.times=[],t.loadStats=function(){var e=t.stats;t.times=[];var n={};for(var r in e){var o=e[r],i="all"==o.info.hours?"all":o.info.hours[0]+"-"+o.info.hours[1],u=o.info.week_day;if(s[u]||(s[u]={}),s[u][i]=o,"all"!=i&&!n[i]){var l={id:i,from:a(o.info.hours[0]),to:a(o.info.hours[1])};n[i]=l,t.times.push(l)}}},t.tripCount=function(t,e){var n=u(t,e);return n?n.info.num_trips:0},t.isTimeEmpty=function(e){var n=t.selectedDay||"all",r=e.id,o=s[n]&&s[n][r];return o&&o.info.num_trips>0?!1:!0},t.stopStats=function(t){var e=i();for(var n in e)if(e[n].stop_id==t)return e[n];return null},t.loadStats()}]),angular.module("RouteExplorer").directive("rexPercentBar",["env",function(t){return{restrict:"E",scope:{value:"=value",type:"=type"},templateUrl:t.baseDir+"/tpls/PercentBar.html"}}]),angular.module("RouteExplorer").directive("timesDetails",["env","Layout",function(t,e){return{restrict:"E",scope:{stats:"="},controller:"TimesDetailsController",templateUrl:t.baseDir+"/tpls/TimesDetails.html"}}]),angular.module("RouteExplorer").filter("duration",function(){return function(t){var e=!1;t=Math.trunc(t),0>t&&(e=!0,t=-t);var n=Math.trunc(t/60);t-=60*n;var r=Math.trunc(n/60);n-=60*r,10>t&&(t="0"+t),10>n&&0!==r&&(n="0"+n);var o=n+":"+t;return 0!==r&&(o=r+":"+o),e&&(o="-"+o),o}}),angular.module("RouteExplorer").factory("Layout",["$http","$q","TimeParser",function(t,e,n){var r=[],o={},a=[],i={},u=e.all([t.get("/api/v1/stops/").then(function(t){r=t.data.map(function(t){return{id:t.stop_id,name:t.heb_stop_names[0],names:t.heb_stop_names,latlon:t.latlon}}),r.forEach(function(t){o[t.id]=t})}),t.get("/api/v1/routes/all/").then(function(t){a=t.data.map(function(t){return{id:t.id,stops:t.stop_ids,count:t.count,minDate:new Date(t.min_date),maxDate:new Date(t.max_date)}}),i=a.reduce(function(t,e){return t[e.id]=e,t},{})})]),s=function(t){return o[t]||null},l=function(t){return s(t).name},p=function(t,e,n){var r={};return t.forEach(function(t){var o=t.stops.indexOf(e),a=t.stops.indexOf(n);if(!(0>o||0>a||o>a)){var i=t.stops,u=t.id;u in r?r[u].count+=t.count:r[u]={id:u,stops:i,count:t.count}}}),r=Object.keys(r).map(function(t){return r[t]}),r.sort(function(t,e){return e.count-t.count}),r},c=function(r,o,i,u){var s=e.defer(),l=p(a,r,o);if(0===l.length)s.resolve([]);else{var c=i,d=u;t.get("/api/v1/routes/all-by-date/",{params:{from_date:n.createRequestString(c),to_date:n.createRequestString(d)}}).then(function(t){var e=t.data.map(function(t){return{id:t.id,stops:t.stop_ids,count:t.count}});s.resolve(p(e,r,o))},function(t){s.reject({msg:"Error fetching routes",response:t})})}return s.promise},d=function(t){return i[t]||null},f=function(){var t=new Date(1900,0,1),e=new Date(2100,0,1);for(var n in a){var r=a[n];0!==r.count&&(r.minDate&&r.minDate<e&&(e=r.minDate),r.maxDate&&r.maxDate>t&&(t=r.maxDate))}return{min:e,max:t}},m={getStops:function(){return r},getRoutes:function(){return a},findRoute:d,findStop:s,findStopName:l,findRoutes:function(t,e){return p(a,t,e)},findRoutesByPeriod:c,getRoutesDateRange:f};return u.then(function(){return m})}]),angular.module("RouteExplorer").constant("Locale",{months:["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"].map(function(t,e){return{id:e+1,name:t}}),days:[{abbr:"א",name:"ראשון",id:1},{abbr:"ב",name:"שני",id:2},{abbr:"ג",name:"שלישי",id:3},{abbr:"ד",name:"רביעי",id:4},{abbr:"ה",name:"חמישי",id:5},{abbr:"ו",name:"שישי",id:6},{abbr:"ש",name:"שבת",id:7}],until:"עד ל"}),angular.module("RouteExplorer").factory("LocationBinder",["$location",function(t){return{bind:function(e,n,r,o,a){e[n]=t.search()[r]||null,e.$watch(n,function(e){a&&(e=a(e)),t.search(r,e)}),e.$watch(function(){return t.search()[r]||null},function(t){o&&(t=o(t)),e[n]=t})}}}]),angular.module("RouteExplorer").factory("TimeParser",[function(){function t(t,e){e=e||"/";var n=t.getDate().toString(),r=(t.getMonth()+1).toString(),o=t.getFullYear().toString();return n+e+r+e+o}function e(t){var e=Number(t.substr(0,4)),n=Number(t.substr(4,2));return new Date(e,n-1,1)}function n(t){var n=t.split("-",2),r=e(n[0]),o=n.length>1?e(n[1]):r,a=new Date(o.getFullYear(),o.getMonth()+1,1);return{from:r,to:o,end:a}}function r(t){return t.getFullYear()+("0"+(t.getMonth()+1)).slice(-2)}function o(t){var e=r(t.from);return t.from<t.to&&(e+="-"+r(t.to)),e}return{createRequestString:t,parseMonth:e,parsePeriod:n,formatMonth:r,formatPeriod:o}}]);
//# sourceMappingURL=app.js.map
