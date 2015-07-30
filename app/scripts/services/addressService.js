var addressesService = angular.module('addressesService', ['ngResource']);

addressesService.factory('Address', function($resource, ENV) {
	


	var states_array=[
		{abbreviation: 'MI', id:1},
		{abbreviation: 'SD', id:2},
		{abbreviation: 'WA', id:3},
		{abbreviation: 'WI', id:4},
		{abbreviation: 'AZ', id:5},
		{abbreviation: 'IL', id:6},
		{abbreviation: 'NH', id:7},
		{abbreviation: 'NC', id:8},
		{abbreviation: 'KS', id:9},
		{abbreviation: 'MO', id:10},
		{abbreviation: 'AR', id:11},
		{abbreviation: 'NV', id:12},
		{abbreviation: 'DC', id:13},
		{abbreviation: 'ID', id:14},
		{abbreviation: 'NE', id:15},
		{abbreviation: 'PA', id:16},
		{abbreviation: 'HI', id:17},
		{abbreviation: 'UT', id:18},
		{abbreviation: 'VT', id:19},
		{abbreviation: 'DE', id:20},
		{abbreviation: 'RI', id:21},
		{abbreviation: 'OK', id:22},
		{abbreviation: 'LA', id:23},
		{abbreviation: 'MT', id:24},
		{abbreviation: 'TN', id:25},
		{abbreviation: 'MD', id:26},
		{abbreviation: 'FL', id:27},
		{abbreviation: 'VA', id:28},
		{abbreviation: 'MN', id:29},
		{abbreviation: 'NJ', id:30},
		{abbreviation: 'OH', id:31},
		{abbreviation: 'CA', id:32},
		{abbreviation: 'ND', id:33},
		{abbreviation: 'ME', id:34},
		{abbreviation: 'IN', id:35},
		{abbreviation: 'TX', id:36},
		{abbreviation: 'OR', id:37},
		{abbreviation: 'WY', id:38},
		{abbreviation: 'AL', id:39},
		{abbreviation: 'IA', id:40},
		{abbreviation: 'MS', id:41},
		{abbreviation: 'KY', id:42},
		{abbreviation: 'NM', id:43},
		{abbreviation: 'GA', id:44},
		{abbreviation: 'CO', id:45},
		{abbreviation: 'MA', id:46},
		{abbreviation: 'CT', id:47},
		{abbreviation: 'NY', id:48},
		{abbreviation: 'SC', id:49},
		{abbreviation: 'AK', id:50},
		{abbreviation: 'WV', id:51},
		{abbreviation: 'AA', id:52},
		{abbreviation: 'AE', id:53},
		{abbreviation: 'AP', id:54}

	];

	var defaultStateAbbreviation="CO";

	//Singleton defaultStateId
	var defaultStateId;

	var getDefaultStateId=function()
	{
		if (!defaultStateId)
		{
			//Not initialized
			//We better look states up by it's abbreviation as ids could change
			var i=0;
			for (;i<states_array.length;i++)
			{
				if(states_array[i].abbreviation===defaultStateAbbreviation)
				{
					defaultStateId=states_array[i].id;
					break;
				}
			}
		}


		
		return defaultStateId;
	};



	var stateLookupById=function(stateId)
	{

		var stateRet;

		var i=0;

		//Angular forEach does not allow break statement
		for (;i<states_array.length;i++)
		{
			if (states_array[i].id === stateId){
				stateRet=states_array[i];
				break;
			}
		}
		return stateRet;
	};

	return {
		States: states_array,
		stateLookupById: stateLookupById,
		getDefaultStateId: getDefaultStateId
	};
	
});
