module.exports = {
	filter: content => {
		let _temp = content.split("\n")
			_temp.shift()
			_temp.pop()

		return _temp
	},

	//	Dig into a object until last structure
	dig: ( content , configList = [] ) => {

		for ( item in content ) {
			if( typeof(content[item]) == 'object' ) {
				module.exports.dig( content[item] , configList )
			} else {
				configList.push({
					'field':item,
					'type':typeof(content[item])
				})
			}
		}
		return configList
	},

	build: ( content , answers ) => {
		
		for ( item in content ) {
			if( typeof(content[item]) == 'object' ) {
				module.exports.build( content[item] , answers )
			} else {
				content[item] = answers[item].answer
			}
		}
		return content
	},

	/**
	 * Filter blacklist files from deploy list 
	 * @param  {string} file 	   filename commited to verify if enter in deploy list
	 * @param  {object} config 	   general deploy configs
	 * @return {boolean}           true => file ok to deploy / false => file must be ignored do deploy
	 */
	blacklistFilter: ( file , config ) => {
		
		let result = true
		
		//	if need a regex to match generic values
		if( !config.blacklist.includes(file) ) {
			config.blacklist.map( item => {
				
				let regexp = {}
				if( !!item.match(/\/\*$/) ) {
				
					regexp = "^" + item.replace(/\*$/, '.*\/\*')
					if (!!file.match(regexp)) {
						result = false
					}
				} else if ( !!item.match(/^\*\./) ) {

					regexp = item.replace(/^\*\./, '.*\\.').replace(/$/,'$')
					if (!!file.match(regexp)) {
						result = false
					}
				}
				
			})

		//	if doesn't need a regex to identify a filename
		} else {
			result = false
		}

		return result
	}
}