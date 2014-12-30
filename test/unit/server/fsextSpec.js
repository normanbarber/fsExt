var chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sandbox = require('sandboxed-module'),
	Q = require('q');

chai.use(require('sinon-chai'));

describe('Walking and read folder and subfolders', function() {
	process.setMaxListeners(0);	// avoid Q promise library warning

	var env = {};

	beforeEach(function() {
		env.stats = {
			dev: 0,
			mode: 33206,
			nlink: 1,
			uid: 0,
			gid: 0,
			rdev: 0,
			ino: 0,
			size: 6785,
			atime: 'Sun Dec 28 2014',
			mtime: 'Tue Sep 21 2010',
			ctime: 'Sun Dec 28 2014'
		};

		env.fs = {
			stat: sinon.stub(),
			writeFile: sinon.stub()
		};
		env.fs.stat.returns(env.stats);
		env.fs.writeFile.yields(null);

		env.fsext = sandbox.require('../../../lib/fsext', {
			requires: {
				'fs': env.fs
			}
		});
	});

	describe('Testing Main Module', function() {
		beforeEach(function() {
			var filepath = ['path/to/textfile.txt','path/to/another/textfile.txt','path/to/view.jade'];
			var matchfileformats = ['.txt','.jade'];
			var writefilepath = 'path/to/write/folder';
			var excludepaths = [];
			env.fsext(filepath, writefilepath, excludepaths, matchfileformats)();
		});
		describe('testing fsext and fs modules', function() {

			it('should expect fs.stat to be called 3 times', function() {
				expect(env.fs.stat).to.have.been.calledThrice;
			});
			it('should return expected behavior', function() {
				expect(env.fs.stat.defaultBehavior.returnValue).to.equal(env.stats);
			});
		});
	});
});

