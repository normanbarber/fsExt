var express = require('express');
var walkerohioranger = require('./lib/walkerohioranger.js');
var fsext = require('./lib/fsext.js');
var app = express();

app.set('port', process.env.PORT || 8000);

var readfilepath = 'path/to/read/folder';
var matchfileformats = []; // array of formats to match ie ['.html','.js','.py']  will only return results for those 3 formats
var writefilepath = 'path/to/write/folder';
var exclude = []; // array of folder or file names to exclude ie ['node_modules','.idea','development','local']

var startTime;
var endTime;
app.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
	startTime = new Date();
	walkerohioranger(readfilepath,exclude,matchfileformats,function(files){
		fsext(files, writefilepath)()
			.fin(function(){
				console.log('\nresults returned and written successfully');
				endTime =  new Date();
				var totalTime = endTime - startTime;
				var ms = totalTime;
				var minutes = (ms/1000/60) << 0;
				var seconds = ((ms/1000) % 60) * 100;
				seconds = ~~seconds / 100;
				console.log(minutes + ' minutes : ' + seconds + ' seconds');
			})
			.fail(function(error){
				console.log(error);
			})
	})

});

