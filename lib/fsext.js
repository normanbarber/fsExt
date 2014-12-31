var path = require('path');
var fs = require('fs');
var Q = require('q');
var _ = require('lodash-node');

var fsmodule = {
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
					if(yeardefined && format){
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
					}else if(format && !yeardefined){
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
	writeFile: function(stats,writefilepath){

		stats = typeof stats[0] === 'object' ? JSON.stringify(stats) : stats;
		var filename = 'filestats.json';
		var date = new Date().getTime();
		filename = date + '_' + filename;
		writefilepath = path.join(writefilepath, filename);
		console.log('\nstep 3 0f 3: writing results to ' + writefilepath + '\n')
		return Q.nfcall(fs.writeFile, writefilepath, stats);
	}
}

module.exports = function(readfilepath, writefilepath, matchfiles) {

	return function(next) {
		console.log('\nstep 2 0f 3: reading file stats. pleast wait...\n')
		return fsmodule.getStats(readfilepath,matchfiles)
			.then(function(data){
				return fsmodule.writeFile(data[0].value.years,writefilepath)
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