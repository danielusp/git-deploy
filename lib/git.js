const sgit = require('simple-git');

module.exports = {
	gitShow: async params => {
		return new Promise((resolve, reject) => {
			sgit(params.local_path).show(['--pretty=oneline','--name-only',params.hash] ,( err , result ) => {
				
				let obj = {
					hash: params.hash,
					result: result,
					local_path: params.local_path
				}

				resolve( obj )
			})
		})
	},
	
	gitLog: async params => {
		return new Promise((resolve, reject) => {
			sgit(params.local_path).log(( err , result ) => {
				resolve( result )
			})
		})
	},

	gitbranchLocal: async params => {
		return new Promise((resolve, reject) => {
			sgit(params.local_path).branchLocal(( err , result ) => {
				resolve( result )
			})
		})
	}
}