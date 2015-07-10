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
		['Almond'
		,'Amber'
		,'Antique Ivory'
		,'Antique Silver'
		,'Antique Slate'
		,'Autumn brown'
		,'Barkwood'
		,'Black'
		,'Black Oak'
		,'Bone White'
		,'Brown'
		,'Brownwood'
		,'Buff'
		,'Cedar'
		,'Charcoal'
		,'Chateau Green'
		,'Chestnut'
		,'Classic Green'
		,'Colonial Red'
		,'Copper Penny'
		,'Dark Bronze'
		,'Desert Tan'
		,'Driftwood'
		,'Dusky Gray'
		,'Estate Gray'
		,'Fox Hollow Gray'
		,'Galvanized'
		,'Gray Slate'
		,'Green'
		,'Harbor Blue'
		,'Hartford Green'
		,'Harvest Brown'
		,'Heatherblend'
		,'Hickory'
		,'Hunt Green'
		,'Mansard Brown'
		,'Med BZ'
		,'Medium Bronze'
		,'Mesa Brown'
		,'Midnight Blush'
		,'Mission Brown'
		,'Moss Green'
		,'Mystic Slate'
		,'Oak'
		,'Onyx Black'
		,'Patriot Red'
		,'Pewter Gray'
		,'Pine Green'
		,'Quarry Gray'
		,'Red'
		,'Red Blend'
		,'Sedona Sunset'
		,'Shake wood'
		,'Shakewood'
		,'Shasta White'
		,'Sierra Gray'
		,'Sierra Tan'
		,'Slate'
		,'Slate Blue'
		,'Slate Gray'
		,'Stone Wood'
		,'Storm Cloud Gray'
		,'Tan'
		,'Teak'
		,'Terra BZ'
		,'Terracotta'
		,'Weather Wood'
		,'Weathered Wood'
		,'White'];

	var manufacturers = [
	    {name:'GAF',id:'1'},
	    {name:'Owens Corning',id:'2'},
	    {name:'Certainteed',id:'3'},
	    {name:'Decra',id:'4'}
	  ];

  	var shingles = [
  	    {title: 'Timberline HD'			,id:'1'},
		{title: 'ArmourShield 2 IR'		,id:'2'},
		{title: 'Grand Sequoia IR'		,id:'2'},
		{title: 'Grand Sequoia'			,id:'3'},
		{title: 'Grand Canyon'			,id:'4'},
		{title: 'Camelot 2'				,id:'5'},
		{title: 'Sienna'				,id:'6'},
		{title: 'Woodland'				,id:'7'},
		{title: 'Monaco'				,id:'8'},
		{title: 'Duration'				,id:'9'},
		{title: 'Duration Storm IR'		,id:'10'},
		{title: 'Woodmoor'				,id:'11'},
		{title: 'Woodcrest'				,id:'12'},
		{title: 'Presidential Shake'	,id:'13'},
		{title: 'Presidential Shake IR'	,id:'14'},
		{title: 'Presidential TL'		,id:'15'},
		{title: 'Tile'					,id:'16'},
		{title: 'Villa Tile'			,id:'17'},
		{title: 'Shake'					,id:'18'},
		{title: 'Shake XD'				,id:'19'}
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
