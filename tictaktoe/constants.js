var Constants = {
	port : 3000,
	httpPort : 3001,
	rows : 3,
	boxSize : 150,
	events : {
		'userList': 'userList',
		'startGame': 'startGame',
		'stopGame': 'stopGame',
		'gameStatus': 'gameStatus',
		'gameData': 'gameData',
		'logout': 'disconnect',
		'addNumber': 'addNumber',
		'numberList': 'numberList',
		'userInfo': 'userInfo'
	},
	gameStatus: {
		'started': 'started',
		'stopped': 'stopped',
		'won': 'won',
		'failed': 'failed'
	}
};

module.exports = Constants;