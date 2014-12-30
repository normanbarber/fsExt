# fsExt
Recursively reads the directory and its sub-directories, reading each files extension, incrementing the count each read and grouping the totals by year. The year value is returned using fs.stat last modified data

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
	-r, --readpath      a string for folder to read recursively
	-w, --writepath     a string for folder you want to write the json to
	-e, --exclude       an array for folders to exclude in the read.  separate each item with a comma
	-m, --match         an array for matching specific file formats. separate each item with a comma

```
