(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', foundItemsDirective)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com/menu_items.json");

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var narrowCtrl = this;
  narrowCtrl.menuItem = "";

  narrowCtrl.getMatchedItems = function () {
    narrowCtrl.found = MenuSearchService.getMatchedMenuItems(narrowCtrl.menuItem);
  }

  narrowCtrl.removeItem = function (itemIndex) {
  };
}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http,ApiBasePath) {
  var service = this;


  service.getMatchedMenuItems = function (searchTerm) {
    return $http({
      method: "GET",
      url: ApiBasePath
    }).then(function (result) {
      var foundItems = [];
      for (var i=0; i < result.data.menu_items.length; i++) {
        //debugger;
        if (result.data.menu_items[i].description.indexOf(searchTerm) !== -1) {
          foundItems.push(result.data.menu_items[i]);
        }
      }
      return foundItems;
  })
  };
}

function foundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      found: '<',
      onRemove: '&'
    }
    //controller: foundItemsDirectiveController,
    //controllerAs: 'list',
    //bindToController: true
  };

  return ddo;
}

function foundItemsDirectiveController() {
  var list = this;

  // list.cookiesInList = function () {
  //   for (var i = 0; i < list.items.length; i++) {
  //     var name = list.items[i].name;
  //     if (name.toLowerCase().indexOf("cookie") !== -1) {
  //       return true;
  //     }
  //   }
  //
  //   return false;
  // };
}


})();
