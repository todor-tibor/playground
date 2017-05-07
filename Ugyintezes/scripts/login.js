/**
 * http://usejsdoc.org/
 */

function login() {
	window.alert("login function");

	var user = firebase.auth().currentUser;
	if (!user) {
		var email = document.getElementById('email').value;
		var password = document.getElementById('password').value;

		firebase.auth().signInWithEmailAndPassword(email, password);
		firebase.auth().onAuthStateChanged(function(user) {

			if (user) {
				window.location = '/messages.html';
			} else {
				window.alert("nem tudott belogolni");
			}
		});
	} else {
		window.location = '/messages.html';
	}
	return false;
}