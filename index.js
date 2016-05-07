var vfs = require('vinyl-fs');
var cheerio = require('cheerio');
var through2 = require('through2');
var path = require('path');

module.exports = function(jsFunc, cssFunc){
	
	return through2.obj(function (file, enc, done) {
		
		// 如果文件为空，不做任何操作，转入下一个操作，即下一个 .pipe()
		if (file.isNull()) {
			this.push(file);
			return done();
		}
		
		// 插件不支持对 Stream 对直接操作，跑出异常
		if (file.isStream()) {
			this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
			return cb();
		}
		
		var content = file.contents.toString();
		
		content = processHtmlForString(content, options)
		
		file.contents = new Buffer(content);
		this.push(file);
		done();
	});
}

function processHtmlForString(content, options){
	
	//<!-- build {"type": "script", "ref":"style/main.js"} -->
	//<script src="scripts/app.js"></script>
	//<script src="scripts/controllers/main.js"></script>
	//<!-- endbuild -->
	
	//<!-- build {type: "css", ref:"style/main.js"} -->
	//<link href="styles/main.css"></link>
	//<link href="styles/default/style.css"></link>
	//<!-- endbuild -->
	var jsRegExp = /(<!--\s*build)[\s\S]*?(endbuild\s*-->)/g;

	//<!-- build {"type": "script", "ref":"style/main.js"} -->
	var headerReg = /<!--.*-->/;
	
	//{"type": "script", "ref":"style/main.js"}
	var jsonReg = /\{.*\}/;
	
	var matchElems = content.match(jsRegExp);
	if(matchElems && matchElems.length>0){
		//console.log("1:"+matchElems.length+", "+matchElems);
		for(var i=0; i < matchElems.length; i++){
			
			var head = matchElems[i].match(headerReg);
			//console.log("2:"+head);
			
			if(head && head.length>0){
				//console.log("3:"+head);
				
				var jsonStr = head[0].match(jsonReg);
				
				if(jsonStr && jsonStr.length>0){
					//console.log("4:"+jsonStr, "options.isDebug:"+options.isDebug);
					
					var info = JSON.parse(jsonStr[0]);
					
					if(!options.isDebug){
						var replaceText = "";
						if(info.type){
							if(info.type==='script'){
								replaceText = '<script type="text/script" src="'+info.ref+'"/>';
							}else if(info.type==='css')
								replaceText = '<link type="text/css" href="'+info.ref+'"/>';
							else{
								if(options && options.callback){
									console.log(replaceText);
									replaceText = options.callback(info, options.isDebug)
								}
							}
						}
						content = content.replace(matchElems[i], replaceText);
					}else{
						if(options && options.callback){
							var replaceText = options.callback(info, options.isDebug);
							
							if(replaceText){
								content = content.replace(matchElems[i], replaceText);
							}
						}
					}
					
				}
				
			}
			
		}
	}
	return content;
}
