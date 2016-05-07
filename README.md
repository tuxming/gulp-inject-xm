# gulp-inject-xm 

> inject text to html

## Usage

First, install `gulp-process-ref` as a development dependency:

```shell
npm install --save-dev gulp-inject-xm
```

Then, add it to your `gulpfile.js`:

## Simple Example
### Gulpfile
```javascript
var process = require('gulp-process-xm');

gulp.task('html', function() {
	gulp.src('/**/*.html')
		.pipe(process())
		.pipe(gulp.dest(".tmp/"));
});


```
### html
```html

<!-- build {"type":"css", "ref":"styles/vender.css"} -->
<link rel="stylesheet" href="styles/main.css">
<link rel="stylesheet" href="styles/style.css">
<!-- endbuild -->

<!-- build {"type":"script", "ref":"scripts/vendor.js"} -->
<script src="scripts/public/jquery.js"></script>
<script src="scripts/public/angular.js"></script>
<script src="scripts/public/bootstrap.js"></script>
<!-- endbuild -->

```

### result
```html
	<link rel="stylesheet" href="styles/vender.css">
	
	<script src="scripts/vendor.js"></script>
```


##Expand Example
### Gulpfile
```javascript
var process = require('gulp-process-xm');

var paths = {bowerjs:[
	'./bower_components/jquery/dist/jquery.js',
	'./bower_components/angular/angular.js',
	'./bower_components/bootstrap/dist/js/bootstrap.js'
]}

var processCallback() = function (info, isDebug){
	if(info.type == "tpl"){
		var source = fs.readFileSync(config.app+"/"+info.ref);
		if(source)
			return source.toString();
		else 
			return "";
	}else if(info.type=='bower'){
		var bowerjss;
		if(isDebug){
			bowerjss = paths.bowerjs.map(function(item, i){
				var paths = item.split("/");
				var jsName = paths[paths.length-1];
				return "<script type='text/javascript' src='/scripts/public/"+jsName+"'></script>";
			}).reduce(function(a, b){
				return a+b; 
			});	
		}else{
			bowerjss = "<script type='text/javascript' src='scripts/vender.js' ></script>";
		}
		
		return bowerjss;
		
	}else
		return "";
}

gulp.task('html', function() {
	gulp.src('/**/*.html')
		.pipe(process({
			isDebug : false; //product, true: developer
			callback: processCallback;
		}))
		.pipe(gulp.dest(".tmp/"))
});

```
### html
```html

<head>
	<meta charset="UTF-8">
	
	<!-- build {"type":"css", "ref":"styles/main.css"} -->
    <link rel="stylesheet" href="../styles/main.css">
    <link rel="stylesheet" href="../styles/style.css">
    <!-- endbuild -->
	
</head>
<body>
	<!--build {"type":"tpl", "ref":"template/header.html"}-->
	<!--endbuild-->
	
	<div class="container">
		//content here
	</div>
	
	<!--build {"type":"tpl", "ref":"template/footer.html"}-->
	<!--endbuild-->
	
	<!-- build {"type":"bower" }-->
    <!-- endbuild -->

</body>
</html>

```

```html
	<!--page header-->
	<div class="header">this is page head</div>
```
```html
	<!--page footer-->
	<div class="header">this is page footer</div>
```

### result
```html
<html>
	<head>
		<meta charset="UTF-8">
		
		<!-- build {"type":"css", "ref":"styles/main.css"} -->
		<link rel="stylesheet" href="../styles/main.css">
		<link rel="stylesheet" href="../styles/style.css">
		<!-- endbuild -->
		
	</head>
	<body>
		<!--page header-->
		<div class="header">this is page head</div>
		
		<div class="container">
			//content here
		</div>
		
		<!--page footer-->
		<div class="header">this is page footer</div>
		
		<script type='text/javascript' src='/scripts/public/jquery.js'></script>
		<script type='text/javascript' src='/scripts/public/bootstrap.js'></script>
		<script type='text/javascript' src='/scripts/public/angular.js'></script>

	</body>
</html>
```









