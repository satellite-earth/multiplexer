const path = require('path');
const fs = require('fs');

const LoadApp = require('./LoadApp');

const { DEFAULT_CONFIG } = require('../constants');

const loadConfig = (params) => {

	let object;

	try {

		const data = fs.readFileSync(params.path);

		object = JSON.parse(data.toString('utf8'));

	} catch (err) {
		console.log(err);
	}

	if (object) {

		return object;
	}
};

// const saveConfig= (data, params) => {

// 	try {

// 		fs.writeFileSync(
// 			params.path,
// 			Buffer.from(JSON.stringify(data))
// 		);

// 	} catch (err) {
// 		console.log(err);
// 	}

// };

module.exports = () => {

	let config = DEFAULT_CONFIG;

	config.apps = [
		{
			uuid: 'sec',
			auth: '1234',
			name: 'sec'
		}
	];

	try {

		// Load saved config into memory from json
		// TODO make this load from a proper database
		config = JSON.parse(
			fs.readFileSync(path.join(
				process.env.BASE_DATA_PATH,
				'communities.json'
			)).toString('utf8')
		);

	} catch (err) {
		console.log(err);
	}

	for (let item of config.apps) {

		LoadApp(item);
	}
};