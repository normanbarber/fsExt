# fsExt
Recursively reads the directory and its sub-directories, reading each files extension, incrementing the count each read and grouping the totals by year, which is a value returned from fs.stat last modified data

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
```bat
	> fsext --readpath path/to/your/read/folder --exclude node_modules,local --writepath path/to/your/write/folder --match .html,.css,.py,.js,.json,.as
```

##### Options:
```javascript
	-r, --readpath      a string - folder to read recursively
	-w, --writepath     a string - folder you want to write the json to
	-e, --exclude       an array - folders to exclude in the read.  separate each item with a comma
	-m, --match         an array - matching specific file formats. separate each item with a comma

```
