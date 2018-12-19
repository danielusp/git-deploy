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
	}
}