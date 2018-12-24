const ftpMod = require('ftp')

module.exports = params => {
	return new Promise(( resolve , reject ) => {

		let c = new ftpMod()
		
		c.connect({
		  	host: params.conn.host,
		  	user: params.conn.login,
		  	password: params.conn.pass
		})

		c.on( 'ready' , () => {
			
			let instances = []

			params.data.map( item => {

				switch ( item.type ) {
					case 'upload':
						item.files.map( file => {
							let dir_chain = file.to.match(/(.*)\//)
							if (dir_chain) {
								instances.push(
									new Promise(( resolve , reject ) => {
										c.mkdir( dir_chain[1] , true , err => {
											c.put( file.from , file.to , err => {
												
												let status = false
												if ( err ) status = true
												resolve({
													type: 'upload',
													error: status,
													file: file.to
												})
											})
										})
									})
								)
							} else {
								instances.push(
									new Promise(( resolve , reject ) => {
										c.put( file.from , file.to , err => {
											
											let status = false
											if ( err ) status = true
											resolve({
												type: 'upload',
												error: status,
												file: file.to
											})
										})
									})
								)
							}
						})
						break

					case 'del':
						item.files.map( file => {
							instances.push(
								new Promise(( resolve , reject ) => {
									c.delete( file.to , err => {
								    
									   	let status = false
									   	if ( err ) status = true
									   	resolve({
											type: 'del',
											error: status,
											file: file.to
										})
								    })
								})
							)
					    })
						break
				}
			})
			
			Promise.all( instances )
				.then( result => {
					c.end()
					if ( result.length > 0 ) {
						result.map( item => {

							if ( !item.error ) {
								console.log( `${item.type} ${item.file}` )
							} else {
								console.log( `ERROR: ${item.type} ${item.file}` )
							}
							
						})
						resolve(true)
					} else {
						console.log( 'Nothing to publish' )
						resolve(false)
					}
				})
		})

		c.on( 'error' , err => {
			reject( err )
		})

	})

}
