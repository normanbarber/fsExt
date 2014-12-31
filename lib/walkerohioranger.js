var walk= require('walkdir');
var path = require('path');
var _ = require('lodash-node');
module.exports = function(readfilepath,exclude,matchfiles,callback) {
	console.log('\nstep 1 of 3: walking folder and sub-folders\n');
	var files=[];
	walk(readfilepath, function(file){
		var excluded=null;
		var fileformat = path.extname(file);
		var foundmatch = (matchfiles && matchfiles.length > 0) ? _.contains(matchfiles, fileformat) : true;
		if(exclude.length > 0 && fileformat && foundmatch){

			excluded = excludeFiles(file, exclude);
			if(!excluded){
				files.push(file);
			}

		}else if(fileformat && foundmatch)
			files.push(file);


	})
	.on('end', function(){
		return callback(files);
	});
	function excludeFiles(file, excludefiles){
		return (file.indexOf(excludefiles) > -1) ? true : false;
	}
};