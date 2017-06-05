var express = require("express");
var compression = require("compression");
var app = express();
var path = require("path");
var http = require("http").Server(app);
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

app.use(compression());
app.use(express.static(path.resolve(__dirname, "client")));
app.use(bodyParser.json());
app.use(methodOverride());

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "client", "views"));

var headers = {
  "Host": "utas.external.s2.fut.ea.com",
  "Connection": "keep-alive",
  "Content-Length": 1,
  "Origin": "https://www.easports.com",
  "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
  "Content-Type": "application/json",
  "Accept": "application/json",
  "X-Requested-With": "ShockwaveFlash/25.0.0.171",
  "X-UT-Embed-Error": "true",
  "X-HTTP-Method-Override": "GET",
  "Referer": "https://www.easports.com/iframe/fut17/bundles/futweb/web/flash/FifaUltimateTeam.swf?cl=167807",
  "Accept-Language": "pt-BR,pt;q=0.8,en-US;q=0.6,en;q=0.4",
  "X-UT-PHISHING-TOKEN": "5082112841906872168",
  "X-UT-SID": "c346fb62-edbd-415f-a86b-14e535b5a8fa",
  "Cookie":"__utma=103303007.930730292.1487342360.1487342360.1487342360.1; __utmz=103303007.1487342360.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _nx_mpcid=402e1909-ea16-427b-bfd1-975026b9e1ee; optimizelyEndUserId=oeu1487613430830r0.22876164328833082; utag_main=v_id:015a4c8358be001c8fae45cd082205068018b0600086e$_sn:2$_ss:0$_st:1487615597403$_pn:7%3Bexp-session$ses_id:1487613430169%3Bexp-session; optimizelySegments=%7B%222200840229%22%3A%22gc%22%2C%222207560119%22%3A%22false%22%2C%222209790291%22%3A%22none%22%2C%222215600082%22%3A%22search%22%7D; optimizelyBuckets=%7B%7D; _ga=GA1.2.930730292.1487342360"
};

app.get("/api/player/:id", function(req, res) {
  console.log("/api/player/:id called");
  var http = require("request");
  headers["Content-Length"] = 1;
  headers["X-HTTP-Method-Override"] = "GET";
  http.get({
    uri: "https://www.easports.com/br/fifa/ultimate-team/api/fut/item?jsonParamObject=%7B%22baseid%22:%22" + req.params.id + "%22%7D"
  }, function(error, response, body) {
    if (error) {
      console.log(error);
      res.status(500).json(JSON.parse(error));
    } else {
      res.status(200).json(JSON.parse(body));
    }
  });
})

app.post("/api/bid/:tradeId", function(req, res) {
  console.log("/api/bid called");
  console.log(req.body);
  var http = require("request");
  headers["Content-Length"] = JSON.stringify(req.body).length;
  headers["X-HTTP-Method-Override"] = "PUT";
  http.post({
    uri: "https://utas.external.s2.fut.ea.com/ut/game/fifa17/trade/" + req.params.tradeId + "/bid",
    headers: headers,
    body: JSON.stringify(req.body)
  }, function (error, response, body) {
    if (error) {
      console.log(error);
      res.status(500).json(JSON.parse(error));
    } else {
      console.log(body);
      res.status(200).json(body);
    }
  })
});

app.get("/api/transfermarket", function(req, res) {
  console.log("/api/transfermarket called");
  var http = require("request");
  headers["Content-Length"] = 1;
  headers["X-HTTP-Method-Override"] = "GET";
  http.post({
    uri: "https://utas.external.s2.fut.ea.com/ut/game/fifa17/transfermarket?maxb=" + req.query.maxb + "&start=0&maskedDefId=" + req.query.playerId + "&type=player&macr=" + req.query.maxcr + "&num=16",
    headers: headers
  }, function (error, response, body) {
    if (error) {
      console.log(error);
    } else {
      try {
        res.status(200).json(JSON.parse(body));
      } catch(err) {
        console.log(body);
        console.log(err);
      }
    }
  });
});

app.get("/api/tradepile", function(req, res) {
  console.log("/api/tradepile called");
  var http = require("request");
  headers["Content-Length"] = 1;
  headers["X-HTTP-Method-Override"] = "GET";
  http.post({
    uri: "https://utas.external.s2.fut.ea.com/ut/game/fifa17/tradepile?brokeringSku=FFA17WEB&sku%5Fa=F17",
    headers: headers
  }, function (error, response, body) {
    if (error) {
      console.log(error);
    }
    try {
      res.status(200).json(JSON.parse(body));
    } catch(err) {
      console.log(body);
      console.log(err);
    }
  });
});

app.get("/api/purchased/items", function(req, res) {
  console.log("/api/purchased/items called");
  var http = require("request");
  headers["Content-Length"] = 1;
  headers["X-HTTP-Method-Override"] = "GET";
  http.post({
    uri: "https://utas.external.s2.fut.ea.com/ut/game/fifa17/purchased/items",
    headers: headers
  }, function(error, response, body) {
    if (error) {
      console.log(error);
    }
    try {
      res.status(200).json(JSON.parse(body));
    } catch(err) {
      console.log(body);
      console.log(err);
    }
  });
});

app.post("/api/moveToTradepile", function(req, res) {
  console.log("/api/moveToTradepile called");
  console.log(req.body);
  var http = require("request");
  headers["Content-Length"] = JSON.stringify(req.body).length;
  headers["X-HTTP-Method-Override"] = "PUT";
  http.post({
    uri: "https://utas.external.s2.fut.ea.com/ut/game/fifa17/item",
    headers: headers,
    body: JSON.stringify(req.body) //{"itemData":[{"id":274202550250,"pile":"trade","success":true}]}
  }, function(error, response, body) {
    if (error) {
      console.log(error);
    }
    try {
      res.status(200).json(JSON.parse(body));
    } catch(err) {
      console.log(body);
      console.log(err);
    }
  });
});

app.delete("/api/trade/:id", function(req, res) {
  console.log("/api/trade/:id called");
  var http = require("request");
  headers["Content-Length"] = 1;
  headers["X-HTTP-Method-Override"] = "DELETE";
  http.post({
    uri: "https://utas.external.s2.fut.ea.com/ut/game/fifa17/trade/" + req.params.id,
    headers: headers
  }, function(error, response, body) {
    if (error) {
      console.log(error);
    }
    try {
      res.status(200).json(JSON.parse(body));
    } catch(err) {
      console.log(body);
      console.log(err);
    }
  });
});

app.post("/api/auctionhouse", function(req, res) {
  console.log("/api/auctionhouse called");
  console.log(req.body);
  var http = require("request");
  headers["Content-Length"] = JSON.stringify(req.body).length;
  headers["X-HTTP-Method-Override"] = "POST";
  http.post({
    uri: "https://utas.external.s2.fut.ea.com/ut/game/fifa17/auctionhouse",
    headers: headers,
    body: JSON.stringify(req.body) //{buyNowPrice: 3600, duration: 3600, itemData: {id: 275248704577}, startingBid: 3500}
  }, function(error, response, body) {
    if (error) {
      console.log(error);
    }
    try {
      res.status(200).json(JSON.parse(body));
    } catch(err) {
      console.log(body);
      console.log(err);
    }
  });
});

app.get("/", function(req, res) {
  res.render("index.ejs");
});

app.get("/*", function(req, res) {
  res.render("index.ejs");
});

app.listen(3060, function() {
  console.log("FUT17 Client running on port 3060");
});
