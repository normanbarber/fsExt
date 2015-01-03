# fsExt
Recursively reads the directory and its sub-directories, reading each files extension, incrementing the count each read and grouping the totals by year. The year value is returned using fs.stat last modified data
Stating the obvious or not: I try not to assume what someone does and does not know so I want to note that if the read folder has alot of sub-folders this read operation is not fast. I created this module because I want to get data on the types of files I have worked on throughout my career. Some of the files on the computer I ran this on pre-date 2010 so it is a dinosaur as far as memory is concerned. The hard drive has 4GB of RAM and some of the reads took a long long time. What Im trying to say is if you are running this on an old computer you will either have to be patient of wait for you computer to freeze, whichever comes first.

### example of returned data object
A json file will be written to the folder value entered with the --writepath flag.
```json
{"years":[{"year":2014,"types":[{"name":".js","count":4},{"name":".css","count":7}]},{"year":2013,"types":[{"name":".md","count":12},{"name":".jade","count":17}]}]}
```

### Running from the command line
##### Install and link to run locally
```javascript
	> npm link
```

##### command line example
```javascript
	> fsext --readpath path/to/your/read/folder --exclude node_modules,local --writepath path/to/your/write/folder --match .html,.css,.py,.js,.json,.as
```

##### Options:
```javascript
	-r, --readpath      a string - folder to read recursively
	-w, --writepath     a string - folder you want to write the json to
	-e, --exclude       an array - folders to exclude in the read.  separate each item with a comma
	-m, --match         an array - matching specific file formats. separate each item with a comma

```
