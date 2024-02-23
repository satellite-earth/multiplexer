
module.exports = (name => {

	console.log('resolving app. . .', name);

	// TODO if app ID is non-numeric, assume it refers to custom subdomain
	// and query to get the appId associated with that subdomain

	const appId = name;

	//const name = /* TODO parse subdomain from host */'uuid_sbowman';

	return apps[name];

});
