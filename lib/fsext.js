var path = require('path');
var fs = require('fs');
var Q = require('q');
var _ = require('lodash-node');

var fsmodule = {
	filepaths: [],
	filedata: {
		years:[ ]
	},
	groupByTypeAndYear: function(paths){
		var year;
		var self = this;
		year = paths.year;
		var format = paths.format;
		var yeardefined = _.find(self.filedata.years, {year:year});
		if(yeardefined && format){
			_.each(self.filedata.years,function(filestats, key){
				var findtypes = _.find(filestats.types, {name:format});
				if(findtypes && filestats.year === year){
					_.each(filestats.types,function(item,innerkey){
						if(item.name == format){
							var index = item.count+1;
							var type = { name: format, count: index }
							self.filedata.years[key].types[innerkey] = type;
						}
					});
				}
				else if(!findtypes && filestats.year === year){
					var setformat = { name: format, count: 1 }
					self.filedata.years[key].types.push(setformat);
				}
			})
		}else if(format && !yeardefined){
			var setyear = {
				'year': year,
				'types': [{ name: format, count: 1 }]
			}
			self.filedata.years.push(setyear);
		}
		return self.filedata;
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
	getStats: function(writefilepath){
		var all = [];
		var promise = null;
		var self = this;
<<<<<<< HEAD

		var bufferpaths = this.filepaths.splice(0, 5);
		_.each(bufferpaths,function(bufferpath){
			var filepath = new Buffer(bufferpath, 'base64').toString('ascii');
			var fileformat = path.extname(filepath);
			var year;

			promise = Q.nfcall(fs.stat, filepath)
				.then(function(stats) {
					if(stats && stats.mtime.getFullYear()){
						year = stats.mtime.getFullYear();
					}
					self.groupByTypeAndYear({year:year,format:fileformat});
				})
				.fail(function(error){
					return Q.reject(error);
=======
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
>>>>>>> 86915ce61ca6f7a1ad0a1675fd5d84f434e520ee
				})
		})

		all.push(promise);
		return Q.allSettled(all)
			.then(function(promises) {
				return Q(_.map(promises, Q.nearer));
			})
			.fin(function(){
				if(self.filepaths.length > 0){
					return Q(fsmodule.getStats(writefilepath));
				}
			})
	}
}

module.exports = function(readfilepaths, writefilepath, matchfiles) {

	return function(next) {
		console.log('\nstep 2 0f 3: reading file stats. pleast wait...\n')
<<<<<<< HEAD
		fsmodule.filepaths = readfilepaths;

		return fsmodule.getStats(writefilepath)
			.fail(function(error) {
				return Q.reject(error);
=======
        fsmodule.filepaths = readfilepath;
		var bufferpath = fsmodule.filepaths.splice(0, 5);
		return fsmodule.spliceBuffer(bufferpath,writefilepath)
			.fail(function(err) {
				return Q.reject(err);
>>>>>>> 86915ce61ca6f7a1ad0a1675fd5d84f434e520ee
			})
			.fin(function() {
				fsmodule.writeFile(JSON.stringify(fsmodule.filedata),writefilepath)
				next && next();
			});
	}
};