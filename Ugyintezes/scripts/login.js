/**
 * http://usejsdoc.org/
 */

function login() {
	var user = firebase.auth().currentUser;
	if (!user) {
		var email = document.getElementById('email').value;
		var password = document.getElementById('password').value;

		firebase.auth().signInWithEmailAndPassword(email, password);
		firebase.auth().onAuthStateChanged(function(user) {

			if (user) {
				window.alert("log in siker");
				window.location = '/overview.html';
			} else {
				window.alert("nem tudott belogolni");
			}
		});
	} else {
		window.alert("mar bejelentkezve mint: + " + user.email);
		window.location = '/overview.html';
	}
	return false;
}