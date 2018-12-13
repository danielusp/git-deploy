const readline = require('readline')

module.exports = {
	configFile: async config => {

		return new Promise(( resolve , reject ) => {

			const rl = readline.createInterface({
			  input: process.stdin,
			  output: process.stdout
			})

			//console.log(config)
			for ( item in config ) {
				for ( i in config[item] ) {

					rl.question(`${i} `, (answer) => {
			  
					  console.log(`Thank you for your valuable feedback: ${answer}`)
					  rl.close()
					  
					})

				}
			}

			//
			//resolve()

			
		})
	}
}