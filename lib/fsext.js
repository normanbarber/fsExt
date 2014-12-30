var path = require('path');
var fs = require('fs');
var Q = require('q');
var _ = require('lodash-node');

var fsmodule = {
	readFiles: function(files, excludefiles){

		var paths = [];

		_.each(files, function(file){
			var excluded = false;
			excludefiles.forEach(function (excludefile) {
				if(file.indexOf(excludefile) > -1)
					excluded = true;
			});

			if(!excluded){
				paths.push(file);
			}

		});
		return Q(paths);
	},
	getStats: function(paths,matchfiles){
		var all = [];
		var promise = null;
		var year;
		var allfileslength=0;
		var filedata = {
			years:[ ]
		};

		_.each(paths, function(filepath){

			promise = Q.nfcall(fs.stat, filepath)
				.then(function(stats) {

					year = stats ? stats.mtime.getFullYear() : 2014;
					var format  = path.extname(filepath);
					var yeardefined = _.find(filedata.years, {year:year});
					var foundmatch = matchfiles.length > 0 ? _.contains(matchfiles, format) : true;
					if(yeardefined && format && foundmatch){
						_.each(filedata.years,function(filestats, key){

							var cont = _.find(filestats.types, {name:format});
							if(cont && filestats.year === year){
								_.each(filestats.types,function(item,innerkey){
									if(item.name == format){
										var index = item.count+1;
										var type = { name: format, count: index }
										filedata.years[key].types[innerkey] = type;
									}
								});
							}
							else if(!cont && filestats.year === year){
								var setformat = { name: format, count: 1 }
								filedata.years[key].types.push(setformat);

							}
						})
					}else if(format && !yeardefined && foundmatch){
						var setyear = {
							'year': year,
							'types': [{ name: format, count: 1 }]
						}
						filedata.years.push(setyear);
					}

					return Q(filedata);
				})
				.fail(function(error){
					return Q.reject('Error while getting file extension and stats');
				})

		})
		all.push(promise);
		return Q.allSettled(all)
			.then(function(promises) {
				return Q(_.map(promises, Q.nearer));
			});
	},
	writeFile: function(stats,savedirectory){
		stats = typeof stats[0] === 'object' ? JSON.stringify(stats) : stats;
		var filename = 'filestats.json';
		var date = new Date().getTime();
		filename = date + '_' + filename;
		savedirectory = path.join(savedirectory, filename);
		return Q.nfcall(fs.writeFile, savedirectory, stats);
	}
}

module.exports = function(readfilepath, savedirectory, excludepaths, matchfiles) {

	return function(next) {
		console.log('\nreading. pleast wait...\n')
		return fsmodule.readFiles(readfilepath, excludepaths)
			.then(function(readpaths) {
				return fsmodule.getStats(readpaths,matchfiles)
			})
			.then(function(data){
				return fsmodule.writeFile(data[0].value.years,savedirectory)
					.then(function(){
						return data;
					})
			})
			.fail(function(err) {
				return Q.reject(err);
			})
			.fin(function() {
				next && next();
			});
	}
};