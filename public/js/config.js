//API SOURCE
window.GLOBALCONFIG = {
    APIHOST:{
        "BASE":"https://192.168.130.16/awstack-user",
        "RESOURCE":"https://192.168.130.16/awstack-resource",
        "WEBSOCKET":"wss://192.168.130.16/awstack-websocket",
    }
};
//global setting
window.SETTING = {
    "pageNum":"10",
    //"SITETITLE":"AWSTACK",//网站标题
    //"COPYRIGHT":"Copyright © 2012-2017 北京海云捷迅科技有限公司 京ICP备14031291号《中华人民共和国增值电信业务经营许可证》编号: 京B2-20140382"//网站版权信息
};

// STATIC URL 
window.STATIC_URL = "/frontend_static/";
var browser=navigator.appName 
var b_version=navigator.appVersion 
var version=b_version.split(";"); 
var trim_Version;
if(version[1]){
    trim_Version=version[1].replace(/[ ]/g,"");
}
if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0"){
    alert("您的浏览器暂不支持云平台，请使用Internet explorer v10.0 及以上版本浏览器")
    document.execCommand("Stop");
}else{
    (function(){
    var config = document.getElementById("page-config");
    if(config){
        var js,css;
        if(config.getAttribute("data-css")){
            css = config.getAttribute("data-css").replace(/^\s+|\s+$/g, "").split(/\s+/).map(function(i){
                return "<link rel=\"stylesheet\" href=\"" + STATIC_URL + i + "\">";
            });
            document.write(css.join(""));
        } 
        if(config.getAttribute("data-js")){
        js = config.getAttribute("data-js").replace(/^\s+|\s+$/g, "").split(/\s+/).map(function(i){
            return "<script src=\"" + STATIC_URL + i + "\"></" + "script>";
            });
            document.write(js.join("")); 
        } 
    }
    })();  
}
