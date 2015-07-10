var projectService = angular.module('projectService', ['ngResource']);

projectService.factory('Project', function($resource, ENV) {
	var resource=$resource(ENV.apiEndpoint + '/api/v1/sites/:id/project/', {id: '@id'}, {
		    query: {method: "GET", isArray: false},
		    save: {
		      method: "PUT"
		    },
		    create: {
		      method: "POST"
		    }
		  });

	var priorities=
		['High'
		,'Medium'
		,'Low'
		];

	var colors=
		[
		{name: 'Almond', 			id: '1'},
		{name: 'Amber', 			id: '2'},
		{name: 'Antique Ivory', 	id: '3'},
		{name: 'Antique Silver',	id: '4'},
		{name: 'Antique Slate', 	id: '5'},
		{name: 'Autumn brown', 		id: '6'},
		{name: 'Barkwood', 			id: '7'},
		{name: 'Black', 			id: '8'},
		{name: 'Black Oak', 		id: '9'},
		{name: 'Bone White', 		id: '10'},
		{name: 'Brown', 			id: '11'},
		{name: 'Brownwood', 		id: '12'},
		{name: 'Buff', 				id: '13'},
		{name: 'Cedar', 			id: '14'},
		{name: 'Charcoal',	 		id: '15'},
		{name: 'Chateau Green', 	id: '16'},
		{name: 'Chestnut', 			id: '17'},
		{name: 'Classic Green', 	id: '18'},
		{name: 'Colonial Red', 		id: '19'},
		{name: 'Copper Penny', 		id: '20'},
		{name: 'Dark Bronze', 		id: '21'},
		{name: 'Desert Tan', 		id: '22'},
		{name: 'Driftwood', 		id: '23'},
		{name: 'Dusky Gray', 		id: '24'},
		{name: 'Estate Gray', 		id: '25'},
		{name: 'Fox Hollow Gray',	id: '26'},
		{name: 'Galvanized', 		id: '27'},
		{name: 'Gray Slate', 		id: '28'},
		{name: 'Green', 			id: '29'},
		{name: 'Harbor Blue', 		id: '30'},
		{name: 'Hartford Green', 	id: '31'},
		{name: 'Harvest Brown', 	id: '32'},
		{name: 'Heatherblend', 		id: '33'},
		{name: 'Hickory', 			id: '34'},
		{name: 'Hunt Green', 		id: '35'},
		{name: 'Mansard Brown', 	id: '36'},
		{name: 'Med BZ', 			id: '37'},
		{name: 'Medium Bronze', 	id: '38'},
		{name: 'Mesa Brown', 		id: '39'},
		{name: 'Midnight Blush', 	id: '40'},
		{name: 'Mission Brown',	 	id: '41'},
		{name: 'Moss Green', 		id: '42'},
		{name: 'Mystic Slate', 		id: '43'},
		{name: 'Oak', 				id: '44'},
		{name: 'Onyx Black', 		id: '45'},
		{name: 'Patriot Red', 		id: '46'},
		{name: 'Pewter Gray', 		id: '47'},
		{name: 'Pine Green', 		id: '48'},
		{name: 'Quarry Gray', 		id: '49'},
		{name: 'Red', 				id: '50'},
		{name: 'Red Blend', 		id: '51'},
		{name: 'Sedona Sunset', 	id: '52'},
		{name: 'Shake wood', 		id: '53'},
		{name: 'Shakewood', 		id: '54'},
		{name: 'Shasta White', 		id: '55'},
		{name: 'Sierra Gray', 		id: '56'},
		{name: 'Sierra Tan', 		id: '57'},
		{name: 'Slate', 			id: '58'},
		{name: 'Slate Blue', 		id: '59'},
		{name: 'Slate Gray', 		id: '60'},
		{name: 'Stone Wood', 		id: '61'},
		{name: 'Storm Cloud Gray', 	id: '62'},
		{name: 'Tan', 				id: '63'},
		{name: 'Teak', 				id: '64'},
		{name: 'Terra BZ', 			id: '65'},
		{name: 'Terracotta', 		id: '66'},
		{name: 'Weather Wood', 		id: '67'},
		{name: 'Weathered Wood', 	id: '68'},
		{name: 'White', 			id: '69'}
		];

	var manufacturers = [
	    {name:'GAF',id:'1'},
	    {name:'Owens Corning',id:'2'},
	    {name:'Certainteed',id:'3'},
	    {name:'Decra',id:'4'}
	  ];

  	var shingles = [
  	    {title: 'Timberline HD'			,id:'1', manufacturerId: '1'},
		{title: 'ArmourShield 2 IR'		,id:'2', manufacturerId: '1'},
		{title: 'Grand Sequoia IR'		,id:'2', manufacturerId: '1'},
		{title: 'Grand Sequoia'			,id:'3', manufacturerId: '1'},
		{title: 'Grand Canyon'			,id:'4', manufacturerId: '1'},
		{title: 'Camelot 2'				,id:'5', manufacturerId: '1'},
		{title: 'Sienna'				,id:'6', manufacturerId: '1'},
		{title: 'Woodland'				,id:'7', manufacturerId: '1'},
		{title: 'Monaco'				,id:'8', manufacturerId: '1'},
		{title: 'Duration'				,id:'9', manufacturerId: '2'},
		{title: 'Duration Storm IR'		,id:'10', manufacturerId: '2'},
		{title: 'Woodmoor'				,id:'11', manufacturerId: '2'},
		{title: 'Woodcrest'				,id:'12', manufacturerId: '2'},
		{title: 'Presidential Shake'	,id:'13', manufacturerId: '3'},
		{title: 'Presidential Shake IR'	,id:'14', manufacturerId: '3'},
		{title: 'Presidential TL'		,id:'15', manufacturerId: '3'},
		{title: 'Tile'					,id:'16', manufacturerId: '4'},
		{title: 'Villa Tile'			,id:'17', manufacturerId: '4'},
		{title: 'Shake'					,id:'18', manufacturerId: '4'},
		{title: 'Shake XD'				,id:'19', manufacturerId: '4'}
  		];


	var getProjectDetailFromSite=function(siteId,successFunction, errorFunction)
	{
		return resource.get({id:siteId},{},successFunction,errorFunction);
	}

	var updateProjectDetails=function(siteId,projectDetails,successFunction, errorFunction)
	{
		//We could check that none of the other sub objects such as insurance_and_mortgage_info
		//are present here as this function is only meant to update base attributes of project

		return resource.save({id:siteId},projectDetails,successFunction, errorFunction);
	}

	var updateInsuranceAndMortgageInfo=function(siteId,project_id,insurance_and_mortgage_info,successFunction, errorFunction)
	{
		var upd_insurance_and_mortgage_info_attrs={
			id: project_id,
			insurance_and_mortgage_info_attributes: insurance_and_mortgage_info
		}

		return resource.save({id:siteId},upd_insurance_and_mortgage_info_attrs,successFunction, errorFunction);
	}

	var updateJobSubmission=function(siteId,project_id,job_submission,successFunction, errorFunction)
	{
		var upd_job_submission_attrs={
			id: project_id,
			job_submission_attributes: job_submission
		}

		return resource.save({id:siteId},upd_job_submission_attrs,successFunction, errorFunction);
	}


	

	return {
		resource: resource,
		Colors: colors,
		Priorities: priorities,
		Manufacturers: manufacturers,
		Shingles: shingles,
		getProjectDetailFromSite: getProjectDetailFromSite,
		updateProjectDetails: updateProjectDetails,
		updateInsuranceAndMortgageInfo: updateInsuranceAndMortgageInfo,
		updateJobSubmission: updateJobSubmission
	};
	
});
