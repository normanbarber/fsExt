var walk= require('walkdir');
var path = require('path');
var _ = require('lodash-node');
var fs = require('fs');
var Q = require('q');
module.exports = function(readfilepath,exclude,matchfiles,callback) {
	console.log('\nstep 1 of 3: walking folder and sub-folders\n');
	var files=[];
	var emitter = walk(readfilepath, function(file){
		var excluded=null;
		var fileformat = path.extname(file);
		var foundmatch = (matchfiles && matchfiles.length > 0) ? _.contains(matchfiles, fileformat) : true;
		var year;

		if(exclude.length > 0 && fileformat && foundmatch){

			excluded = excludeFiles(file, exclude);
			if(!excluded){
				var filebuffered = new Buffer(file).toString('base64');
				files.push(filebuffered);
			}
		}else if(fileformat && foundmatch){
			var filebuffered = new Buffer(file).toString('base64');
			files.push(filebuffered);
		}
	})
	.on('end', function(){
		return callback(files);
	});
	function excludeFiles(file, excludefiles){
		return (file.indexOf(excludefiles) > -1) ? true : false;
	}

};