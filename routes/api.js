var express = require('express');
var phimmoi = require('./lib/phimmoi')
var router = express.Router();

var webdriverio = require('webdriverio');
var options = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};

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
       phimmoi.search().then(function (episodes) {
           var item = episodes.slice(id-1, id)[0];
           console.log(item);

           if (item.url) {
               phimmoi.findMedias(item.url).then(function (episode) {
                   res.json({'data': episode});
               });
           }
           else {
               res.json({'data': []});
           }

       });
   }
   else {
       res.json({'data': []});
   }
});

module.exports = router;