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
		{name: 'Adobe Sunset',    id: '1'},
		{name: 'Aged Bark',    id: '2'},
		{name: 'Amalfi Gray',    id: '3'},
		{name: 'Amalfi Sand',    id: '4'},
		{name: 'Amber',    id: '5'},
		{name: 'Antique Chestnut',    id: '6'},
		{name: 'Antique Silver',    id: '7'},
		{name: 'Antique Slate',    id: '8'},
		{name: 'Arctic Blue',    id: '9'},
		{name: 'Autumn Blend',    id: '10'},
		{name: 'Autumn Brown',    id: '11'},
		{name: 'Autumn Maple',    id: '12'},
		{name: 'Barkwood',    id: '13'},
		{name: 'Barkwood Slate',    id: '14'},
		{name: 'Birchwood',    id: '15'},
		{name: 'Black Oak',    id: '16'},
		{name: 'Brownwood',    id: '17'},
		{name: 'Canterbury Black',    id: '18'},
		{name: 'Capri Clay',    id: '19'},
		{name: 'Carbon',    id: '20'},
		{name: 'Castillian Surf',    id: '21'},
		{name: 'Castlewood Gray',    id: '22'},
		{name: 'Cedar',    id: '23'},
		{name: 'Cederwood Abbey',    id: '24'},
		{name: 'Charcoal',    id: '25'},
		{name: 'Charcoal Black',    id: '26'},
		{name: 'Chateau Gray',    id: '27'},
		{name: 'Chateau Green',    id: '28'},
		{name: 'Chestnut',    id: '29'},
		{name: 'Classic Weathered Wood',    id: '30'},
		{name: 'Desert Tan',    id: '31'},
		{name: 'Driftwood',    id: '32'},
		{name: 'Dusky Gray',    id: '33'},
		{name: 'Estate Gray',    id: '34'},
		{name: 'Fox Hollow Gray',    id: '35'},
		{name: 'Garnet',    id: '36'},
		{name: 'Granite',    id: '37'},
		{name: 'Granite Grey',    id: '38'},
		{name: 'Harbor Blue',    id: '39'},
		{name: 'Harbor Mist',    id: '60'},
		{name: 'Heirloom Brown',    id: '40'},
		{name: 'Hickory',    id: '41'},
		{name: 'Hunter Green',    id: '42'},
		{name: 'Juniper',    id: '43'},
		{name: 'Mesa Brown',    id: '44'},
		{name: 'Mesquite',    id: '45'},
		{name: 'Mission Brown',    id: '46'},
		{name: 'Mist Grey',    id: '47'},
		{name: 'Monticello Brown',    id: '48'},
		{name: 'Onyx Black',    id: '49'},
		{name: 'Pewter Gray',    id: '50'},
		{name: 'Pinnacle Grey',    id: '51'},
		{name: 'Pompeii Ash',    id: '52'},
		{name: 'Quarry Gray',    id: '53'},
		{name: 'Rustico Clay',    id: '54'},
		{name: 'Sea Green',    id: '55'},
		{name: 'Sedona Sunset',    id: '56'},
		{name: 'Shadow Gray',    id: '57'},
		{name: 'Shadowood',    id: '58'},
		{name: 'Shakewood',    id: '59'},
		{name: 'Shasta White',    id: '61'},
		{name: 'Slate',    id: '62'},
		{name: 'Spanish Tile',    id: '63'},
		{name: 'Stone Wood',    id: '64'},
		{name: 'Storm Cloud Gray',    id: '65'},
		{name: 'Sycamore',    id: '66'},
		{name: 'Teak',    id: '67'},
		{name: 'Terra Cotta',    id: '68'},
		{name: 'Timber',    id: '69'},
		{name: 'Tuscan Sunset',    id: '70'},
		{name: 'Valencia Sunset',    id: '71'},
		{name: 'Venetian Coral',    id: '72'},
		{name: 'Venetian Gold',    id: '73'},
		{name: 'Weathered Timber',    id: '74'},
		{name: 'Weathered Wood',    id: '75'},
		{name: 'Woodberry Brown',    id: '76'},
		{name: 'White', id: '77'},
		{name: 'Buff', id: '78'},
		{name: 'Heather Blend', id: '79'},
		{name: 'Black', id: '80'},
		{name: 'Red Blend', id: '81'},
		{name: 'Weatherwood', id: '82'},
		{name: 'Oak', id: '83'},
		{name: 'Pine Green', id: '84'}		
		];

	var manufacturers = [
	    {name:'GAF',id:'1'},
	    {name:'Owens Corning',id:'2'},
	    {name:'Certainteed',id:'3'},
	    {name:'Decra',id:'4'},
	    {name:'Mulehide',id:'5'}
	  ];

  	var shingles = [
  	    {title: 'Timberline HD'			,id:'1', manufacturerId: '1'  , colorsId: [50, 42, 15, 59, 46,  75, 35, 41, 25, 14]},
		{title: 'ArmourShield 2 IR'		,id:'2', manufacturerId: '1'  , colorsId: [62, 25, 75, 13]},
		{title: 'Grand Sequoia IR'		,id:'3', manufacturerId: '1'  , colorsId: [75, 1, 25, 33]},
		{title: 'Grand Sequoia'			,id:'4', manufacturerId: '1'  , colorsId: [25, 11, 44, 62, 75, 23]},
		{title: 'Grand Canyon'			,id:'5', manufacturerId: '1'  , colorsId: [46, 64, 16, 65, 56]},
		{title: 'Camelot 2'				,id:'6', manufacturerId: '1'  , colorsId: [25, 13, 75, 8, 59]},
		{title: 'Sienna'				,id:'7', manufacturerId: '1'  , colorsId: [60, 40, 2, 27]},
		{title: 'Woodland'				,id:'8', manufacturerId: '1'  , colorsId: [70, 76, 22, 18, 24]},
		{title: 'Monaco'				,id:'9', manufacturerId: '1'  , colorsId: [3, 21, 71, 72, 48]},
		{title: 'Duration'				,id:'10', manufacturerId: '2' , colorsId: [5, 17, 28, 31, 32, 34, 39, 49, 53, 61, 67, 68]},
		{title: 'Duration Storm IR'		,id:'11', manufacturerId: '2' , colorsId: [7, 17, 31, 32, 34, 49, 67]},
		{title: 'Woodmoor'				,id:'12', manufacturerId: '2' , colorsId: [12, 20, 29, 37, 43, 45, 66, 69]},
		{title: 'Woodcrest'				,id:'13', manufacturerId: '2' , colorsId: [12, 20, 29, 37, 43, 45, 66, 69]},
		{title: 'Presidential Shake'	,id:'14', manufacturerId: '3' , colorsId: [2, 10, 26, 29, 57, 75]},
		{title: 'Presidential Shake IR'	,id:'15', manufacturerId: '3' , colorsId: [10, 30, 75, 57]},
		{title: 'Presidential TL'		,id:'16', manufacturerId: '3' , colorsId: [2, 10, 26, 29, 57, 63, 75]},
		{title: 'Tile'					,id:'17', manufacturerId: '4' , colorsId: [9, 29, 25, 36, 38, 47, 55, 58, 68, 74]},
		{title: 'Villa Tile'			,id:'18', manufacturerId: '4' , colorsId: [19, 52, 54, 73, 4]},
		{title: 'Shake'					,id:'19', manufacturerId: '4' , colorsId: [47, 55, 58, 74, 29, 25, 38 ]},
		{title: 'Shake XD'				,id:'20', manufacturerId: '4' , colorsId: [51, 6]},
		{title: 'Modified Bitumen', id:'21', manufacturerId: '5', colorsId: [29, 77, 78, 79, 80, 81, 82, 83, 84]}
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
