const config = require('../config');

exports.index = function(req, res) {
  res.render('rooms', {
    host: config.host
  });
};