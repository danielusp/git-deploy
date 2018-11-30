module.exports = {
	filter: content => {
		let _temp = content.split("\n")
			_temp.shift()
			_temp.pop()

		return _temp
	}
}