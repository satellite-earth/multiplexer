const path = require('path');

const App = require('../../node/app');


module.exports = (params) => {

	try {

		apps[params.uuid] = new App({
			path: path.join(process.env.BASE_DATA_PATH, params.uuid),
			...params
		});

	} catch (err) {
		console.log(`Failed to create app "${params.name}"`, err);
	}

	if (apps[params.uuid]) {
		
		apps[params.uuid].start();
		console.log('LOADED APP', apps[params.uuid]);
	}
}
