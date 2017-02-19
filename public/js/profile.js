// profile.js
// ========
var User = require('../../models/User');

$('#giveBadge').click(function() {
	console.log("CALLING GIVE BADGE FUNCTION");

	var first_badge = new Badge({ name: 'small', points: 0, points_required: 5, category: 'java' });

	User.findByIdAndUpdate("58a0ac69e030e21d20739a0f", 
		{$push: {badges: first_badge}}, {safe: true, upsert: true},
    	function(err, model) {
        	console.log("giveBadge db error: " + err );
		}
	);

});
