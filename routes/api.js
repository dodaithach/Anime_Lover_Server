var express = require('express');
var phimmoi = require('./lib/phimmoi')
var router = express.Router();
var fs = require('fs');
var path = require('path')

var webdriverio = require('webdriverio');
var options = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};

var DATA = {};

var loadData = function() {
    var filePath = path.join(__dirname, 'data.json');
    var tmp = fs.readFileSync(filePath, 'utf8');
    DATA = JSON.parse(tmp);
};

var storeData = function(episodes) {
    var filePath = path.join(__dirname, 'data.json');
    var tmp = {'data': episodes};
    fs.writeFileSync(filePath, JSON.stringify(tmp));
}

loadData();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/episodes', function (req, res, next) {
    var begin = req.query.begin;
    var end = req.query.end;

    phimmoi.search().then(function (episodes) {
        if (begin && end) {
            var tmp = episodes.slice(begin-1, end);
            res.json({'data': tmp});
        }
        else {
            res.json({'data': episodes});
        }
    });
});

router.get('/episode', function (req, res, next) {
    var url = req.query.url;

    if (url) {
        phimmoi.findMedias(url).then(function (episode) {
            res.json({'data': episode});
        });
    }
    else {
        res.json({'data': []});
    }
});

router.get('/player', function(req, res, next) {
   var id = req.query.id;

   if (id) {
       var item = DATA.data.slice(id-1, id)[0];

       if (item.url) {
           phimmoi.findMedias(item.url).then(function (episode) {
               res.json({'data': episode});
           });
       }
       else {
           res.json({'data': []});
       }
   }
   else {
       res.json({'data': []});
   }
});

router.get('/updateData', function(req, res, next) {
    phimmoi.search().then(function(episodes) {
        storeData(episodes);
        loadData();
        res.json({'data':'data updated'});
    });
});

module.exports = router;