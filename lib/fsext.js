var path = require('path');
var fs = require('fs');
var Q = require('q');
var _ = require('lodash-node');

var fsmodule = {
	filepaths: [],
	filedata: {
		years:[ ]
	},
	getStats: function (files){
		var all = [];
		var promise = null;
		var self = this;
		 _.map(files, function(filepathbuffer){
			var file = filepathbuffer;
			var fileformat = path.extname(file);
			var year;

			 promise = Q.nfcall(fs.stat, file)
				.then(function(stats) {
					if(stats && stats.mtime.getFullYear()){
						year = stats.mtime.getFullYear();
					}
					return Q(self.groupByTypeAndYear({year:year,format:fileformat},self.filedata));
				})
				.fail(function(error){
					return Q.reject('Error while getting file stats');
				})
		})
		all.push(promise);
		return Q.allSettled(all)
			.then(function(promises) {
				return Q(_.map(promises, Q.nearer));
			})
	},
	groupByTypeAndYear: function(paths,filedata){
		var year;
		year = paths.year;
		var format = paths.format;
		var yeardefined = _.find(filedata.years, {year:year});
		if(yeardefined && format){
			_.each(filedata.years,function(filestats, key){
				var findtypes = _.find(filestats.types, {name:format});
				if(findtypes && filestats.year === year){
					_.each(filestats.types,function(item,innerkey){
						if(item.name == format){
							var index = item.count+1;
							var type = { name: format, count: index }
							filedata.years[key].types[innerkey] = type;
						}
					});
				}
				else if(!findtypes && filestats.year === year){
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
		return filedata;
	},
	writeFile: function(stats,writefilepath){
		stats = typeof stats[0] === 'object' ? JSON.stringify(stats) : stats;
		var filename = 'filestats.json';
		var date = new Date().getTime();
		filename = date + '_' + filename;
		writefilepath = path.join(writefilepath, filename);
		console.log('\nstep 3 0f 3: writing results to ' + writefilepath + '\n')
		return Q.nfcall(fs.writeFile, writefilepath, stats);
	},
	spliceBuffer: function(readfilepath,writefilepath){
		var self = this;
		self.paths = [];
		for(var k in readfilepath){
			var path = readfilepath[k];
			var bufferfilepath = new Buffer(path, 'base64').toString('ascii');
			self.paths.push(bufferfilepath);
		}
		if(fsmodule.filepaths.length > 0){
			fsmodule.getStats(self.paths)
				.then(function(data){
					var bufferpath = fsmodule.filepaths.splice(0, 5);
					fsmodule.spliceBuffer(bufferpath,writefilepath);
				})
			return Q;
		}else{
			return fsmodule.writeFile(JSON.stringify(fsmodule.filedata),writefilepath)
				.then(function(){
					console.log('\nresults returned and written successfully');
				})
		}
	}
}

module.exports = function(readfilepath, writefilepath, matchfiles) {

	return function(next) {
		console.log('\nstep 2 0f 3: reading file stats. pleast wait...\n')
        fsmodule.filepaths = readfilepath;
		var bufferpath = fsmodule.filepaths.splice(0, 5);
		return fsmodule.spliceBuffer(bufferpath,writefilepath)
			.fail(function(err) {
				return Q.reject(err);
			})
			.fin(function() {
				next && next();
			});
	}
};