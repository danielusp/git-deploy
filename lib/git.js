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
	
	/**
	 * Gets current branch
	 * @param  {string} local_path path to local repo
	 * @return {object}            current branch and all branches
	 */
	gitbranchLocal: async local_path => {
		return new Promise((resolve, reject) => {
			sgit(local_path).branchLocal(( err , result ) => {
				resolve({
					"current":result.current, 
					"all":result.all
				})
			})
		})
	}
}