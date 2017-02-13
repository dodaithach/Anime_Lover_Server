'use strict'

const aes = require('./aes')
const got = require('got')
const cheerio = require('cheerio')
const qs = require('querystring')
const DOMAIN = 'http://www.phimmoi.net'
const provider = 'PM'

const gotOptions = {
  headers: {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2977.0 Safari/537.36',
    'referer': 'http://www.phimmoi.net/',
    'cookie': '_a3rd1478681532=0-9; ADB3rdCookie1478681307=1; ADB3rdCookie1413887770=1; _a3rd1407405582=0-8; ADB3rdCookie1385973822=1; gen_crtg_rta=; __RC=5; __R=3; __UF=-1; __uif=__uid%3A2625795562883732188%7C__ui%3A-1%7C__create%3A1482579556; __tb=0; __IP=2883739208; __utmt=1; __utmt_b=1; __utma=247746630.1273382115.1482841916.1484328884.1484382954.4; __utmb=247746630.3.10.1484382954; __utmc=247746630; __utmz=247746630.1482841916.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _a3rd1426850317=0-5; _a3rd1401790478=0-6'
  },
  timeout: 5000,
  retries: 0
}

exports.search = function() {
  return got(`http://www.phimmoi.net/phim/dao-hai-tac-i2-665/xem-phim.html`, gotOptions)
    .then(response => cheerio.load(response.body))
    .then($ => {
      return $('.list-episode')
        .find('li')
        .map((i, elem) => {
          let url = $(elem).find('a').attr('href')
          let title = $(elem).find('a').attr('data-number')
          // get last elem of arr without modified it
          let raw_id = url.split('-').slice(-1)[0];
          let id = raw_id.substring(0,raw_id.length-5);
          const provider = 'PM';

          var item = {
            provider,
            id,
            title,
            url
          };

          return item;
        })
        .get()
      }
    )
}

exports.findMedias = (url) => {
  return findEpisodeUrl(url)
  .then(episodeUrl => got(
    episodeUrl.replace('javascript', 'json'),
    Object.assign({}, gotOptions, {json: true})
  ))
  .then(response => {
    const body = response.body;
    const password = 'PhimMoi.Net@' + body.episodeId;
    return response.body.medias.map(video => {
        var item = {  url: decodeUrl(video.url, password),
                      type: video.type,
                      width: video.width,
                      height: video.height,
                      resolution: parseFloat(video.resolution),
                      label: video.resolution};

        console.log(item);

        return item;
    })
  })
}

const findEpisodeUrl = (id) => {
  return got(`${DOMAIN}/${id}`, gotOptions)
  .then(response => cheerio.load(response.body))
  .then($ => {
                var test = $('script[onload="checkEpisodeInfoLoaded(this)"]').attr('src');
                console.log("findEpisodeUrl");
                console.log(test);
                return test;
              })
}

// decode url using the password
const decodeUrl = (url, password) => {
  return aes.dec(url, password)
}
