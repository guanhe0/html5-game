function loadScript(url,callback){
	var script = document.createElement("script")
	script.type = "text/javascript";
	if(script.readyState){//IE
		script.onreadystatechange = function(){
			if(script.readyState == "loaded" || script.readyState == "complete"){
				script.onreadystatechange = null;
				callback()
			}
		}
	}else{
		script.onload = function(){
			callback();
		}
	}
}
使用方法
loadScript("script1.js",function(){
	loadScript("script2.js",function(){
		loadScript("script3.js",function(){
			alert("All files are loaded");
		})
	})
})