var userService = angular.module('usersService', ['ngResource']);

userService.factory('User',function($resource, ENV,$q) {

  var resource = $resource(ENV.apiEndpoint + '/api/v1/users/:userId', {userid: '@id'}, {
	    save: {
	      method: 'PUT'
	    }
	  });

  var meResource = $resource(ENV.apiEndpoint + '/api/v1/users/me', {}, {
	    get: {
	      method: 'GET'
	    }
	  });

  //Current user details is lazy initializiated
  var currentUserDetails;

  function addIsAdminAttributeToUserObject(user){
	if (user)
	{
		user.isAdmin=false;
		if (user.roles_name){
			var i;
			for (i=0;i<user.roles_name.length;i++)
			{
				if (user.roles_name[i]==="admin"){
					user.isAdmin=true;
					break;
				}
			}

		}

	}
  }

  var getCurrentUserDetails=function getCurrentUserDetails(){
	var deferred = $q.defer();
	if (!currentUserDetails)
	{
		currentUserDetails=meResource.get({},{},
			function(data){
				currentUserDetails=data.user;
				//We look into the attributes and set isAdmin flag accordingly
				addIsAdminAttributeToUserObject(currentUserDetails);

				deferred.resolve(currentUserDetails);
			},
			function(error){
				deferred.reject(error);
			});
	}
	else
	{
		deferred.resolve(currentUserDetails);
	}

	return deferred.promise;
  };

  return {
	resource: resource,
	getCurrentUserDetails: getCurrentUserDetails,
	};
});
