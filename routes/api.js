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
            var tmp = episodes.slice(begin, end);
            res.json(tmp);
        }
        else {
            res.json(episodes);
        }
    });
});

router.get('/episode', function (req, res, next) {
    var url = req.query.url;

    if (url) {
        phimmoi.findMedias(url).then(function (episode) {
            res.json(episode);
        });
    }
    else {
        res.json({});
    }
});

module.exports = router;