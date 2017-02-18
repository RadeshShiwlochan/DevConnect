var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport("SMTP", {
  service: 'Mailgun',
  auth: {
    user: process.env.MAILGUN_USERNAME,
    pass: process.env.MAILGUN_PASSWORD
  }
});

/**
 * GET /contact
 */
exports.contactGet = function(req, res) {
  res.render('contact', {
    title: 'Contact'
  });
};

/**
 * POST /contact
 */
exports.contactPost = function(req, res) {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('message', 'Message cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect('/contact');
  }

  var sender_email = process.env.DEVCONNECT_ADMIN_EMAIL;

  // if( sender_email.includes("yahoo.com") ){
  //   sender_email = process.env.DEVCONNECT_ADMIN_EMAIL;
  // }

  // Set obj with mail options
  var mailOptions = {
    from: req.body.name + ' ' + '<'+ sender_email + '>',
    to: process.env.DEVCONNECT_ADMIN_EMAIL,
    subject: '✔ Contact Form Notification | DevConnect',
    text: 'Message from ' + req.body.name + " at " + req.body.email + ":\n\n" + req.body.message
  };

  // Send email through transporter
  transporter.sendMail(mailOptions, function(err) {
    req.flash('success', { msg: 'Thank you! Your feedback has been submitted. '});
    res.redirect('/about');
  });
};
