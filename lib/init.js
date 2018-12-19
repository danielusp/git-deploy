const readline = require('readline')
const utils = require('./utils')
const fileManager = require('./fileManager')

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

module.exports = {
	configFile: async config => {

		return new Promise(( resolve , reject ) => {

			let answers = {}
			let list = utils.dig(config)

			list.reduce( async ( previousPromise , item ) => {
				await previousPromise
				return module.exports.msg( item ).then( input => answers[input.field] = input )
			} , module.exports.msg( list.shift() ).then( input => answers[input.field] = input ) )
			//	Close input terminal
			.then( () => {
				rl.close()
			})
			//	Write config file
			.then( () => {
				fileManager.writeConfig( utils.build( config , answers ) )
				.then( () => {
					resolve()
				})
			})
		})
	},

	//	Show config list message 
	msg: async ( params ) => {
		return new Promise (( resolve , reject ) => {
			rl.question( `Input ${params.field} (${params.type}): `, ( answer ) => {
			  let input = Object.assign({'answer': answer}, params);
			  resolve( input )
			})
		})
	}
}