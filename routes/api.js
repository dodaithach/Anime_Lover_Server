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
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/episodes', function(req, res, next) {
    phimmoi.search().then(function(episodes) {
       console.log(episodes);
       res.json(episodes);
    });
});

router.get('/episode', function(req, res, next) {
    phimmoi.findMedias('phim/dao-hai-tac-i2-665/tap-7-84786.html').then(function(episode) {
        console.log(episode);
        res.json(episode);
    });
});

module.exports = router;