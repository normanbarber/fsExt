#!/usr/bin/env node
var walker = require('../lib/walker.js');
var fsext = require('../lib/fsext.js');
var commander = require('commander');

function matchformat(format, matches) {
	matches = format.split(',') || format.split(' ');
	return matches;
}
function excludefiles(files, excludes) {
	excludes = files.split(',') || files.split(' ');
	return excludes;
}

commander
	.version('0.0.1')
	.option('-r, --readpath [string]', 'a string for folder you want to read recursively')
	.option('-w, --writepath [string]', 'a string for folder you want to write the json to')
	.option('-e, --exclude [array]', 'an array for folders to exclude in the read separating each item with a comma', excludefiles, [])
	.option('-m, --match [array]', 'an array for matching specific file formats. separate each item with a comma', matchformat, [])
	.parse(process.argv);

commander.parse(process.argv);

if (!commander.readpath) {
	throw new Error('you must enter a path to read ie --readpath "path/to/your/folder"');
}

function readFolders(){
	var filepath = commander.readpath
	var excludepaths = commander.exclude;
	var writefilepath = commander.writepath ? commander.writepath : commander.readpath;;
	var matchfileformats = commander.match;

	walker(filepath, function(files){
		fsext(files, writefilepath, excludepaths,matchfileformats)()
			.then(function(){
				console.log('\nresults returned and written to: ' + writefilepath);
			})
	})
}
readFolders();

