var querystring = require('querystring');
var path = require('path');
var connect = require('connect');
var urllib = require('urllib');
var genConfig = require('./genConfig');

var URL_ISPI = 'http://www.aliresearch.com/i_ispi_data/api.php';
var URL_tNum = 'http://monitor.taobao.com/monitorportal/main/biztc/monitorAlipayCountLatest.do';

var app = connect();
app.use(connect.static(path.join(__dirname, "../")));
app.use(connect.directory(path.join(__dirname, "../")));
app.use(connect.query());
app.use(connect.router(function (app) {
  app.get('/ispi', function (req, res, next) {
    urllib.request(URL_ISPI, { data: req.query }, function (err, data, response) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-cache');
      var body = data ? data.toString() : '';
      return res.end(body);
    });
  });
}));

app.use(connect.router(function (app) {
  app.get('/alipayCountLatest', function (req, res, next) {
  	var query = req.query || {};
  	var queryStr = querystring.stringify(query, ';', '=');
  	var url = URL_tNum + '?' + queryStr;
    urllib.request(url, {}, function (err, data, response) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      var body = data ? data.toString() : '';
      return res.end(body);
    });
  });
}));

genConfig.write();
app.listen(8010);
console.log("localhost:8010 run...");