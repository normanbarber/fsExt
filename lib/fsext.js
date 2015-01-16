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
		var self = this;
		var year = paths.year;
		var format = paths.format;
		var yeardefined = _.find(self.filedata.years, {year:year});
		var yearsIndex = _.findIndex(self.filedata.years, yeardefined);
		if(yeardefined && format){
			var findtypes = _.find(yeardefined.types, {name:format});
			var typesIndex = _.findIndex(yeardefined.types, findtypes);
			if(findtypes && findtypes.name === format){
				self.filedata.years[yearsIndex].types[typesIndex] = { name: format, count: findtypes.count+1 };
			}
			else if(!findtypes){
				self.filedata.years[yearsIndex].types.push({ name: format, count: 1 });
			}
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
		var files = this.filepaths.splice(0, 20);

		_.each(files,function(filepath){
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

module.exports = function(readfilepaths, writefilepath) {

	return function(next) {
		console.log('\nstep 2 0f 3: reading file stats. pleast wait...\n')
		fsmodule.filepaths = readfilepaths;

		return fsmodule.getStats(writefilepath)
			.fail(function(error) {
				return Q.reject(error);
			})
			.fin(function() {
				console.log(fsmodule.filedata.years.length);
				console.log(JSON.stringify(fsmodule.filedata));
				fsmodule.writeFile(JSON.stringify(fsmodule.filedata),writefilepath)
				next && next();
			});
	}
};