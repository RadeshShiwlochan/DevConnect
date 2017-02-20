var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

// Badge schema
var badgeSchema = new mongoose.Schema({
  name: String,
  points: Number,
  points_required: Number,
  category: String,
  keys: [String]
}, schemaOptions);

var Badge = mongoose.model('Badge', badgeSchema);

module.exports = Badge;

// Create default badges that is to be used for all new users
var front_end_dev_badge = new Badge({ name: 'FrontEnd', points: 4, points_required: 5, category: 'web', 
  keys: ['html', 'css', 'javascript'] });
var java_badge = new Badge({ name: 'JavaDev', points: 2, points_required: 5, category: 'java', 
  keys: ['java'] });
var back_end_dev_badge = new Badge({ name: 'BackEnd', points: 3, points_required: 5, category: 'backend',
  keys: ['java', 'python', 'node', 'system', 'database'] });
var database_badge = new Badge({ name: 'Database', points: 1, points_required: 5, category: 'database', 
  keys: ['mongodb', 'sql', 'mysql', 'mariadb']});
var data_analytics_badge = new Badge({ name: 'DataAnalytics', points: 4, points_required: 5, category: 'dataanalytics' });

var userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true},
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  gender: String,
  location: String,
  website: String,
  picture: String,
  facebook: String,
  twitter: String,
  google: String,
  github: String,
  vk: String,
  badges: {type: [badgeSchema],
      'default': [front_end_dev_badge, java_badge, back_end_dev_badge, database_badge, data_analytics_badge]},
  role: {type: String, 
      'default': "user"}
}, schemaOptions);


userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    cb(err, isMatch);
  });
};

userSchema.virtual('gravatar').get(function() {
  if (!this.get('email')) {
    return 'https://gravatar.com/avatar/?s=200&d=retro';
  }
  var md5 = crypto.createHash('md5').update(this.get('email')).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=200&d=retro';
});

userSchema.options.toJSON = {
  transform: function(doc, ret, options) {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
  }
};

var User = mongoose.model('User', userSchema);

module.exports = User;