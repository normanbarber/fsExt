var express = require('express');
var bodyParser = require('body-parser');
var walkerohioranger = require('./lib/walkerohioranger.js');
var fsext = require('./lib/fsext.js');
var app = express();

app.set('port', process.env.PORT || 8000);
app.use(bodyParser.json());

var readfilepath = 'path/to/read/folder';
var matchfileformats = []; // array of formats to match ie ['.html','.js','.py']  will only return results for those 3 formats
var writefilepath = 'path/to/write/folder';
var exclude = []; // array of folder or file names to exclude ie ['node_modules','.idea','development','local']

app.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
	walkerohioranger(readfilepath,exclude,matchfileformats,function(files){
		fsext(files, writefilepath, matchfileformats)()
			.fin(function(){
				console.log('\nresults returned and written successfully');
			})
			.fail(function(error){
				console.log(error);
			})
	})

});

