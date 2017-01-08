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
  narrowCtrl.found = [];
  narrowCtrl.nothingFoundFlag = false;

  narrowCtrl.getMatchedItems = function () {
    if (narrowCtrl.menuItem == "") {
       narrowCtrl.nothingFoundFlag = true;
    } else {

    var promise = MenuSearchService.getMatchedMenuItems(narrowCtrl.menuItem);
    promise.then(function (result) {
      narrowCtrl.found = MenuSearchService.getFoundItems(result,narrowCtrl.menuItem);
      if (narrowCtrl.found.length != 0) {
        narrowCtrl.nothingFoundFlag = false;
      } else {
         narrowCtrl.nothingFoundFlag = true;
      }
     }, function (errorResponse) {
       console.log(errorResponse.message);
     });
   }
  }

  narrowCtrl.removeItem = function (itemIndex) {
    narrowCtrl.found.splice(itemIndex, 1);
  };
}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http,ApiBasePath) {
  var service = this;

service.getFoundItems = function (itemsList,searchTerm) {
  var foundItems = [];
      for (var i=0; i < itemsList.data.menu_items.length; i++) {
        if (itemsList.data.menu_items[i].description.indexOf(searchTerm) !== -1) {
          foundItems.push(itemsList.data.menu_items[i]);
        }
      }
      return foundItems;
}
  service.getMatchedMenuItems = function (searchTerm) {
     var jsonItems = $http({
      method: "GET",
      url: ApiBasePath
    });
  return jsonItems;
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
//
// function foundItemsDirectiveController() {
//   var list = this;
//
//   // list.cookiesInList = function () {
//   //   for (var i = 0; i < list.items.length; i++) {
//   //     var name = list.items[i].name;
//   //     if (name.toLowerCase().indexOf("cookie") !== -1) {
//   //       return true;
//   //     }
//   //   }
//   //
//   //   return false;
//   // };
// }
//

})();
