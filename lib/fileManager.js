const fs = require('fs');

module.exports = {
	
	configs: async params => {
		return new Promise((resolve, reject) => {
			
			fs.readFile( 'configs.json' , 'utf8' , ( err , result ) => {
				
				if ( err ) {
					resolve(false)
				} else {
					const conf = JSON.parse( result )
					let ref = {}

					conf.map( item => {
						ref[item.id] = item
					})
				
					if ( !params.id ) {
						resolve( ref )
					} else {
						fs.readFile( `history/${params.id}.json` , 'utf8' , ( err , content ) => {
							if ( !err ) {
								let obj = {
									id: ref[params.id].id,
									last_hash: JSON.parse( content ).last_hash,
									local_path: ref[params.id].local_path,
									ftp: ref[params.id].ftp,
									blacklist: ref[params.id].blacklist
								}
								resolve( obj )
							} else {
								fs.writeFile( `history/${params.id}.json` , JSON.stringify('{"id":"${params.id}","last_hash":""}') , err => {
									if ( !err ) {
										let obj = {
											id: ref[params.id].id,
											last_hash: "",
											local_path: ref[params.id].local_path,
											ftp: ref[params.id].ftp,
											blacklist: ref[params.id].blacklist
										}
										resolve( obj )
									}
								})
							}
						})
					}
				}
			})
		})
	},

	history: async params => {
		return new Promise((resolve, reject) => {

			let content = {
				id: params.id,
				last_hash: params.last_hash
			}

			fs.writeFile( `history/${content.id}.json` , JSON.stringify(content) , err => {
				if ( !err ) {
					resolve( true )
				} else {
					resolve( false )
				}
			})
		})
	},

	fileExists: async params => {
		return new Promise((resolve, reject) => {
			
			fs.access( params.local_path + params.file , fs.constants.F_OK , ( err ) => {
			  if ( err ) {
			  	resolve({
			  		file: params.file,
			  		local_path: params.local_path,
			  		status: false
			  	})
			  } else {
			  	resolve({
			  		file: params.file,
			  		local_path: params.local_path,
			  		status: true
			  	})
			  }
			})
		})
	},

	readConfigTemp: async () => {
		return new Promise(( resolve , reject ) => {
			
			fs.readFile( 'configs.json.tpl' , 'utf8' , ( err , result ) => {
				if ( !err ) {
					const conf = JSON.parse( result )
					resolve( conf )
				} else {
					console.log( 'Error: There is no configs.json.tpl as a config template :(' )
					resolve(false)
				}
			})
		})
	},

	writeConfig: async content => {
		return new Promise(( resolve , reject ) => {
			
			fs.writeFile( 'configs.json' , JSON.stringify( content , null , 4 ) , err => {
				if ( !err ) {
					resolve( true )
				}
			})
		})
	}
}