const fs = require('fs');

module.exports = {
	configs: async params => {
		return new Promise((resolve, reject) => {
			fs.readFile( 'configs.json' , 'utf8' , ( err , result ) => {
				
				const conf = JSON.parse( result )
				
				if ( !params.id ) {
					resolve( conf )
				} else {
					fs.readFile( `history/${params.id}.json` , 'utf8' , ( err , content ) => {
						if ( !err ) {
							let obj = {
								id: conf[params.id].id,
								last_hash: JSON.parse( content ).last_hash,
								local_path: conf[params.id].local_path,
								ftp: conf[params.id].ftp
							}
							resolve( obj )
						} else {
							fs.writeFile( `history/${params.id}.json` , JSON.stringify('{"id":"${params.id}","last_hash":""}') , err => {
								if ( !err ) {
									let obj = {
										id: conf[params.id].id,
										last_hash: "",
										local_path: conf[params.id].local_path,
										ftp: conf[params.id].ftp
									}
									resolve( obj )
								}
							})
						}
					})
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
	}
}