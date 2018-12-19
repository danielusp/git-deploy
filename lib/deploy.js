const ftp = require('./ftp');

module.exports = async params => {

	let data = []

	//	Build filelist object
	//	Delete filelist
	if( !!params.files_upload.del.length ) {
		
		let _temp = []
		params.files_upload.del.map( item => {
			_temp.push({
				from: params.config.local_path + item,
				to: item
			})
		})

		data.push({
			type:'del',
			files: _temp
		})
	}

	//	Upload filelist
	if( !!params.files_upload.up.length ) {
		
		let _temp = []
		params.files_upload.up.map( item => {
			_temp.push({
				from: params.config.local_path + item,
				to: item
			})
		})

		data.push({
			type:'upload',
			files: _temp
		})
	}

	// Call FTP API and send files 
	ftp({
		conn: params.config.ftp,
		data: data
	})
	.then( result => {
		if ( result ) {
			
			//	Register into history file
			params.fileManager.history({
				id: params.config.id,
				last_hash:params.latest_hash
			}).then(() => {
				process.exit(1)
			})
		}
	})
}