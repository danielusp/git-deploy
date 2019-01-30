# GIT DEPLOY

Read a local GIT repository and publish the commited files by FTP
(Beta Version)

### Install Git Deploy

Into git-deploy folder, run

```
npm install
```

### Configs

Config git repos and FTPs in **configs.json** file

## Run app

#### Lists all registered repositories

```
node index.js
```
#### pub [repository_name] repository

```
node index.js [repository_name]
```

#### config files to be ignored in blacklist propertie

##### ignore folders
```
"blacklist": [
			"images/*"
		]
```

##### ignore files
```
"blacklist": [
			".gitignore",
			"css/main.log
		]
```

##### ignore file extensions
```
"blacklist": [
			"*.scss"
		]
```