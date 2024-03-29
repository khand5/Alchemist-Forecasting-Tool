angular.module('starter.controllers', [])

/*
  The ServerController is used in the Server tab of the client.
*/
.controller('ServerController', function($scope, Alchemist, Grants) {

  // server healthcheck when view is opened
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.ping()
  })

  $scope.ping = function() {
    $scope.pinging = true
    Alchemist.ping()
    .success(function(data, status, headers, config) {
      $scope.connection = true
      $scope.pinging = false
    })
    .error(function(data, status, headers, config) {
      $scope.connection = false
      $scope.pinging = false
    })
  }

  $scope.serverIP = Alchemist.getIP()

  $scope.changeIP = function() {
    Alchemist.setIP($scope.serverIP)
  }

})

/*
  The SearchController is used in the search tab.
*/
.controller('SearchController', function($scope, $state, Alchemist, Grants) {

  // reset on page enter & server health check
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.searching = false
    $scope.isOnline = false

    $scope.ping()
  })

  $scope.ping = function() {
    $scope.pinging = true

    Alchemist.ping()
    .success(function(data, status, headers, config) {
      $scope.pinging = false
      $scope.isOnline = true
    })
    .error(function(data, status, headers, config) {
      $scope.pinging = false
      $scope.isOnline = false
    })

  }

  // hard list of things user can search for
  $scope.searchTypeList = [
    { text: 'Field of Research', value:'f' },
    { text: 'Organization', value:'o' },
    { text: 'Province', value:'p' },
    { text: 'Professor', value:'n' },
    { text: 'Subject', value:'s' },
    { text: 'Year', value:'y' },
    { text: 'Amount', value:'a' },
  ]

  // default search type is "Amount"
  $scope.searchType = 'a'

  $scope.search = function(category, searchFor) {
    $scope.searching = true
    Alchemist.get(category, searchFor)
    .success(function(data, status, headers, config) {
      Grants.set(data, category, searchFor)
      $state.go('tab.search-detail')
    })
    .error(function(data, status, headers, config) {
      console.log("Error requesting data")
      $scope.searching = false
      $scope.ping()
    })
  }
})

/*
  The SearchResultsController is used in the results view.
*/
.controller('SearchResultsController', function($scope, $interval, Grants, highchartsNG) {
  // variable which controls number of grants shown
  var numGrants = 5

  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.numberOfGrants = Grants.getNumberOfGrants()
    $scope.grants = Grants.getSomeGrants(numGrants);
    numGrants += 5
  })

  $scope.moreGrants = function() {
    $scope.grants = Grants.getSomeGrants(numGrants)
    numGrants += 5
  }

  $scope.showSeries = function(id) {
    return Grants.showSeries(id)
  }

  // Updates all the charts on the screen to reflect results
  $interval(function() {
    $scope.Chart1 = Grants.getChart(1)
    $scope.Chart2 = Grants.getChart(2)
    $scope.Chart3 = Grants.getChart(3)
    $scope.Chart4 = Grants.getChart(4)
    $scope.Chart5 = Grants.getChart(5)
    $scope.Chart6 = Grants.getChart(6)
    $scope.Chart7 = Grants.getChart(7)
    $scope.Chart8 = Grants.getChart(8)
    $scope.Map1 = Grants.getChart(0)
  }, 500)
})
