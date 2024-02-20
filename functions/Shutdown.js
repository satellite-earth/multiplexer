
module.exports = () => {

	// TODO should be moved into startup function
	for (let name of Object.keys(apps)) {

		apps[name].stop();
	}

	process.exit(0);
};
