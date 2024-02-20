const path = require('path');

const LoadApp = require('./LoadApp');


module.exports = () => {

	// TODO replace this dummy data with real list of communities
	// TODO a community should be assigned an actual uuid when it
	// is created, perhaps by truncating the pubkey
	const list = [
		{
			uuid: 'uuid_sbowman',
			name: 'sbowman',
			auth: '6a75dea45861580ef8554236c37f481679a792c0'
		},
		{
			uuid: 'uuid_bitcoin',
			name: 'bitcoin',
			auth: '236c37f481679a792c06a75dea45861580ef8554'
		}
	];


	for (let item of list) {

		LoadApp(item);
	}
};
