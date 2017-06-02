var app = angular.module("fut17client", []);

app.controller("homeController", ["$scope", "$http", "$interval", function ($scope, $http, $interval) {
  $scope.httpResponse = {};
  $scope.maxBuyNow = 4200;
  $scope.maxBid = 15000000;
  $scope.comprar = false;
  $scope.playerId = 186561;

  $scope.playAudio = function() {
    var audio = new Audio('audio/alert.mp3');
    audio.play();
  };

  $scope.bid = function(trade) {
    $scope.stopSearch();
    $http({
      method: "POST",
      url: "/api/bid/" + trade.tradeId,
      data: {bid: trade.currentBid + 100}
    }).then(function (res) {
      $scope.successMessage = "Lance feito!";
      $scope.startSearch();
    }).catch(function (res) {
      $scope.errorMessage = res.data;
      $scope.startSearch();
    })
  };

  $scope.buy = function(trade) {
    $scope.playAudio();
    $scope.stopSearch();
    $http({
      method: "POST",
      url: "/api/bid/" + trade.tradeId,
      data: {bid: trade.buyNowPrice}
    }).then(function (res) {
      $scope.successMessage = "Compradoooo!";
      $scope.startSearch();
    }).catch(function (res) {
      $scope.errorMessage = res.data;
      $scope.startSearch();
    })
  };

  $scope.getTradePile = function() {
    $http({
      method: "GET",
      url: "/api/tradepile"
    }).then(function (res) {
      $scope.tradePile = res.data;
    }).catch(function (res) {

    });
  };

  $scope.getTrades = function() {
    if ($scope.aumenta) {
      $scope.maxBid -= 1000;
    } else {
      $scope.maxBid -= 1000;
    }
    $scope.aumenta = !$scope.aumenta;
    $http({
      method: "GET",
      url: "/api/transfermarket",
      params: {maxb: $scope.maxBuyNow, maxcr: $scope.maxBid, playerId: $scope.playerId}
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
            if (res.data.count > 0) {
              $scope.jogador = res.data.items[0].firstName + " " + res.data.items[0].lastName;
            }

          }).catch(function (err) {
            $scope.errorMessage = err;
          });

          var minimo1 = $scope.httpResponse.auctionInfo[0].buyNowPrice;
          var minimo2 = $scope.httpResponse.auctionInfo[1].buyNowPrice;

          var venda = (minimo2 - 100) * 0.95;
          $scope.saldo = venda - minimo1;
          $scope.saldoPositivo = ($scope.saldo > 0);

          if ($scope.saldoPositivo && $scope.comprar && $scope.saldo >= 100) {
            $scope.buy($scope.httpResponse.auctionInfo[0]);
          }
        } else {
          $scope.errorMessage = res.data;
        }

      }

    }).catch(function (res) {
    });
  };

  $scope.startSearch = function() {
    $scope.getTrades();
    $scope.getTradePile();
    $scope.stop = $interval(function() {$scope.getTrades(); $scope.getTradePile();}, 5000);
  }

  $scope.stopSearch = function() {
    $interval.cancel($scope.stop);
    $scope.stop = undefined;
  }

}]);

app.filter('secondsToDateTime', [function() {
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
}]);
