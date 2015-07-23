angular.module('ersApp').controller('CustomerSearchModalInstanceCtrl', function ($scope, $modalInstance, $http,ENV) {

  $scope.showResults=false;
  

  $scope.selectCustomer = function (customer){
    $modalInstance.close(customer);
  };

  $scope.findCustomers = function (search_by_firstname,search_by_lastname,search_by_bussiness_name,search_by_phonenumber) {
    var query_params=[];
    
    if (!angular.isUndefined(search_by_firstname) && search_by_firstname.trim()!="" )
    {
      query_params.push('q[firstname_cont]=' + search_by_firstname);
    }
    
    if (!angular.isUndefined(search_by_lastname) && search_by_lastname.trim()!="" )
    {
      query_params.push('q[lastname_cont]=' + search_by_lastname);
    }
    
    if (!angular.isUndefined(search_by_bussiness_name) && search_by_bussiness_name.trim()!="" )
    {
      query_params.push('q[business_name_cont]=' + search_by_bussiness_name);
    }
    
    if (!angular.isUndefined(search_by_phonenumber) && search_by_phonenumber.trim()!="" )
    {
      query_params.push('q[phone_numbers_number_cont]=' + search_by_phonenumber);
    }
    
    var query_string=""
    var i=0;
    for (i=0;i<query_params.length;i++)
    {
      if (i>0)
      {
        query_string=query_string + "&";
      }
      query_string+= query_params[i];
    }

    if (query_string!="")
    {
      query_string="?" + query_string;
    }
    
    
    $http({
      method: 'GET',
      url: ENV.apiEndpoint + '/api/v1/customers' + query_string,
      headers: {
        'Content-type': 'application/json'
      }
    })
    .success(function(data){
      $scope.customers = data;
      $scope.custList = data.customers;
      $scope.showResults = true;
    }).error(function(){
      alert("error");
    })

    

  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
