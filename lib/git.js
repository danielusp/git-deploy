const sgit = require('simple-git');

module.exports = {
	/**
	 * Shows commited files based on the hash
	 * @param  {object} params 'params.local_path' and 'params.hash'
	 * @return {object}        hash, result and local_path
	 */
	gitShow: async params => {
		return new Promise((resolve, reject) => {
			sgit(params.local_path).show(['--pretty=oneline','--name-only',params.hash] ,( err , result ) => {
				if ( !err ) {
					resolve({
						"hash": params.hash,
						"result": result,
						"local_path": params.local_path
					})
				} else {
					reject( err )
				}
			})
		})
	},
	
	/**
	 * Return repo log list
	 * @param  {string} local_path path to local repo
	 * @return {object}            log list object
	 */
	gitLog: async local_path => {
		return new Promise((resolve, reject) => {
			sgit(local_path).log(( err , result ) => {
				if ( !err ) {
					resolve( result )
				} else {
					reject( err )
				}
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
				if ( !err ) {
					resolve({
						"current":result.current, 
						"all":result.all
					})
				} else {
					reject( err )
				}
			})
		})
	}
}