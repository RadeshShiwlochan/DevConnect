//var User = require(../models/User);
var Question = require(../models/Question);


exports.index = function(req, res) {
  res.render('forum', {
    title: 'Q & A Forum'
  });
};

var Question = mongoose.model('Question', questionSchema);