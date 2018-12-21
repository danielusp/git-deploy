const fileManager = require('./lib/fileManager');
const git = require('./lib/git');
const utils = require('./lib/utils');
const deploy = require('./lib/deploy');
const init =  require('./lib/init');

(async () => {
		
	//	Configs
	const config = await fileManager.configs({
		id: process.argv[2] || false
	})

	//	Creates a new config.json file based on user entry if there is no config
	if ( !config ) {
		
		console.log( `There is no config file.\nNow we're going to create it.` )

		config = await fileManager.readConfigTemp()
		await init.configFile(config)
		process.exit(1)
	} 

	//	Params control
	if ( config.last_hash == undefined ) {
		console.log( `Repo list\n` )

		Object.keys(config).map( item => {
			console.log( `- ${item}` )
		})

		console.log( `\n\nSelect a repo using the sintax:$ node index.js [repository_name]` )
		process.exit(1)
	}

	//	Pubs just master branch
	await git.gitbranchLocal( config.local_path )
		.then( result => {
			if ( result.current != 'master' ) {
				console.log( `${config.id} not in master branch` )
				process.exit(1)
			}
		})
		.catch( err => {
			console.log( 'Git Repo Error' , '\n\n' , err )
			process.exit(1)
		})
	
	//	Get repo log list with hashes
	const log_result = await git.gitLog( config.local_path )
		.catch( err => {
			console.log( 'gitLog error' , '\n\n' , err )
			process.exit(1)
		})

	// Vars setup
	let promise_list = {
		git_show: [],
		file_exists: []
	}
	let files_upload = {
		up:[],
		del:[]
	}

	//	Get first log item to compare with history
	let item = log_result.all.shift()

	//	Dig into log list looking for the last hash history
	while (
		log_result.all.length > 0 && 
		item.hash != config.last_hash 
	) {
		promise_list.git_show.push( git.gitShow({
			hash:item.hash,
			local_path:config.local_path
		}))
		item = log_result.all.shift()
	}

	//	Runs upload/delete list
	Promise.all( promise_list.git_show )
		.then( r => {
		    r.map( item => {
		       	utils.filter(item.result).map( i => {
		       		promise_list.file_exists.push(
			       		fileManager.fileExists({
			       			file: i,
			       			local_path: config.local_path
			       		})
			       		.then( ret => {
			       			if ( ret.status ) {
			       			
			       				if( !files_upload.up.includes(ret.file) && !ret.file.match(/^\..*/) ) {
					       			files_upload.up.push(ret.file)
					       		}
			       			} else {
			       			
			       				if( !files_upload.del.includes(ret.file) && !ret.file.match(/^\..*/) ) {
					       			files_upload.del.push(ret.file)
					       		}
			       			}
			       		})
		       		)
		      	})
		    })
		})
		.then(() => {
			Promise.all( promise_list.file_exists )
		    	.then(() => {
		    		deploy({
				    	config: config,
				    	latest_hash: log_result.latest.hash,
				    	files_upload: files_upload,
				    	fileManager: fileManager
				    })
		    	})
		})
		.catch( err => {
			console.log( 'Git Show error' , '\n\n' , err )
		})
	
	
})()

