/** 
 * Check if user already has session running
 */
$.ajax({
	url: '\/session',
	method: 'GET'
}).done(function(jsondata) {
	if (jsondata) {
		$.ajax({
			url: '/getprofile',
			method: 'GET',
		    success: function(jsondata) {
				email = jsondata.email;
			    firstName = jsondata.firstname;
			    lastName = jsondata.lastname;
			    role = jsondata.role;

			    if (email && firstName && lastName && role) {
			    	window.location = "http://csc309-coursescheduler.rhcloud.com/dashboard";
			    } else {
			    	location = "http://csc309-coursescheduler.rhcloud.com/EditProfileHTML";
			    }
			},
			fail: function() {
				location = "http://csc309-coursescheduler.rhcloud.com/EditProfileHTML";
			}
		});
	}
});

/**
 * Hide signup by default.
 */
$(".email-signup").hide();

/**
 * Toggle between signup and login.
 */
$("#signup-box-link").click(function(){
	$(".email-login").fadeOut(100);
	$(".email-signup").delay(100).fadeIn(100);
	$("#login-box-link").removeClass("active");
	$("#signup-box-link").addClass("active");
});

/**
 * Toggle between login and signup.
 */
$("#login-box-link").click(function(){
	$(".email-login").delay(100).fadeIn(100);;
	$(".email-signup").fadeOut(100);
	$("#login-box-link").addClass("active");
	$("#signup-box-link").removeClass("active");
});

/**
 * Prevent default form submission action.
 */
$("email-login").submit(function(e) {
	e.preventDefault();
});

/**
 * Handle login by username and password.
 */
function clickLogIn() {
	var email = ($('.email-login').find('input[type=email]')).val();
	var password = ($('.email-login').find('input[type=password]')).val();
	
	$.ajax({
		url: '\/login\/signin',
		method: 'POST',
		data: {email, password}
	}).done(function(jsondata) {
		window.location.href = jsondata.redirect;
	}).fail(function() {
		alert("Invalid Login Credentials");
	});
}

/**
 * Sign up a new user.
 */
function clickSignUp() {
	var email = ($('.email-signup').find('input[type=email]')).val();
	var password = (($('.email-signup').find('input[type=password]')).eq(0)).val();
	var confirm = (($('.email-signup').find('input[type=password]')).eq(1)).val();
	
	if (password == confirm) {
		$.ajax({
			url: '\/register',
			method: 'POST',
			data: {email, password}
		}).done(function(jsondata) {
			window.location.href = '/EditProfileHTML';
		}).fail(function (){
			alert("Creation Error");
		});
	}
}

/**
 * Login using Github auth.
 */
function clickGithub() {
	$.ajax({
		url: '\/login\/github',
		method: 'GET'
	}).done(function(jsondata) {
		if (jsondata.redirect) {
			window.location.href = jsondata.redirect;
		}
	});
}

/**
 * Login using Google auth.
 */
function clickGoogle() {
	$.ajax({
		url: '\/login\/google',
		method: 'GET'
	}).done(function(jsondata) {
		if (jsondata.redirect) {
			window.location.href = jsondata.redirect;
		}
	});
}