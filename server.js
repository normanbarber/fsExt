var express = require('express');
var bodyParser = require('body-parser');
var walker = require('./lib/walker.js');
var fsext = require('./lib/fsext.js');
var app = express();

app.set('port', process.env.PORT || 8000);
app.use(bodyParser.json());

var filepath = 'path/to/read/folder';
var matchfileformats = []; // array of formats to match ie ['.html','.js','.py']  will only return results for those 3 formats
var writefilepath = 'path/to/write/folder';
var excludepaths = []; // array of folder or file names to exclude ie ['node_modules','development','local']

app.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
	walker(filepath, function(files){
		fsext(files, writefilepath, excludepaths, matchfileformats)()
			.then(function(){
				console.log('\nresults returned and written to: ' + writefilepath);
			})
	})

});

