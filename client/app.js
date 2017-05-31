var app = angular.module("fut17client", []);

app.controller("homeController", ["$scope", "$http", "$interval", function ($scope, $http, $interval) {
  $scope.httpResponse = {};
  $scope.maxBuyNow = 12000;
  $scope.maxBid = 15000000;
  $scope.comprar = false;

  $scope.buy = function(trade) {
    $http({
      method: "POST",
      url: "/api/bid/" + trade.tradeId,
      data: {bid: trade.buyNowPrice}
    }).then(function (res) {
      $scope.successMessage = "Compradoooo!";
    }).catch(function (res) {
      $scope.errorMessage = res.data;
    })
  };

  $scope.getTrades = function() {
    if ($scope.aumenta) {
      $scope.maxBid += 1000;
    } else {
      $scope.maxBid -= 1000;
    }
    $scope.aumenta = !$scope.aumenta;
    $http({
      method: "GET",
      url: "/api/transfermarket",
      params: {maxb: $scope.maxBuyNow, maxcr: $scope.maxBid}
    }).then(function (res) {
      $scope.httpResponse = res.data;
      if (res.data.code === 401) {
        console.log(res);
      } else {
        if ($scope.httpResponse.auctionInfo) {
          $scope.httpResponse.auctionInfo.sort(function (a, b) {
            return a.buyNowPrice - b.buyNowPrice;
          });

          $http({
            method: "GET",
            url: "/api/player/" + $scope.httpResponse.auctionInfo[0].itemData.resourceId
          }).then(function (res) {
            $scope.jogador = res.data.items[0].firstName + " " + res.data.items[0].lastName;

          }).catch(function (err) {
            $scope.errorMessage = err;
          });

          var minimo1 = $scope.httpResponse.auctionInfo[0].buyNowPrice;
          var minimo2 = $scope.httpResponse.auctionInfo[1].buyNowPrice;

          var venda = (minimo2 - 100) * 0.95;
          $scope.saldo = venda - minimo1;
          $scope.saldoPositivo = ($scope.saldo >= 0);

          if ($scope.saldoPositivo && $scope.comprar) {
            $scope.buy($scope.httpResponse.auctionInfo[0]);
          }
        } else {
          $scope.errorMessage = res.data;
        }

      }

    }).catch(function (res) {
    });
  };

  $interval($scope.getTrades, 3000);

}]);

app.filter('secondsToDateTime', [function() {
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
}]);
