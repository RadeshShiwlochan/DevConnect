$('.about-scroll').click(function() {
	var height = $('.about-landing').height() + 100;
	$('html, body').animate({scrollTop : height}, 800);
	return false;
});