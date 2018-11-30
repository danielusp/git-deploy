const fileManager = require('./lib/fileManager');
const git = require('./lib/git');
const utils = require('./lib/utils');
const deploy = require('./lib/deploy');

(async () => {
		
	//	Configs
	let config = await fileManager.configs({
		id: process.argv[2] || false
	})

	//	Params control
	if ( config.last_hash == undefined ) {
		console.log( "Repo list" , "\n" )

		Object.keys(config).map( item => {
			console.log( `- ${item}` )
		})
		
		process.exit(1)
	}

	//	Pub just master branch
	git.gitbranchLocal({
		local_path: config.local_path
	})
	.then( result => {
		if ( result.current != 'master' ) {
			
			console.log( `${config.id} not in master branch` )
			process.exit(1)
		}
	})

	// Application process
	git.gitLog({
		local_path: config.local_path
	})
	.then( result => {

		let promise_list = {
			git_show: [],
			file_exists: []
		}
		let files_upload = {
			up:[],
			del:[]
		}
		let item = result.all.shift()

		while (
			result.all.length > 0 && 
			item.hash != config.last_hash 
		) {
			promise_list.git_show.push( git.gitShow({
				hash:item.hash,
				local_path:config.local_path
			}))
			item = result.all.shift()
		}

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
					    	latest_hash: result.latest.hash,
					    	files_upload: files_upload,
					    	fileManager: fileManager
					    })
			    	})
			})
			.catch( err => {
				console.log( 'error' , '\n\n' , err )
			})
	})
	.catch( err => {
		console.log( 'gitLog error' , '\n\n' , err )
	})
})()

