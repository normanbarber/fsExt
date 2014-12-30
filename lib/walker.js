var walk= require('walkdir');
module.exports = function(readfilepath,callback) {
	var filesarray=[];

	walk(readfilepath, function(files){
		filesarray.push(files);
	})
	.on('end', function(){
		return callback(filesarray);
	});
};