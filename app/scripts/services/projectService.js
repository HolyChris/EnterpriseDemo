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

	var getProjectDetailFromSite=function(siteId,successFunction, errorFunction)
	{
		return resource.get({id:siteId},{},successFunction,errorFunction);
	}


	return {
		resource: resource,
		colors: colors,
		getProjectDetailFromSite: getProjectDetailFromSite
	};
	
});
