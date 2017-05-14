/**
 * http://usejsdoc.org/
 */

function login() {
	var user = firebase.auth().currentUser;
	if (user) {
		firebase.auth().signOut();
	}
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;

	firebase.auth().signInWithEmailAndPassword(email, password);
	firebase.auth().onAuthStateChanged(function(user) {

		if (user) {
			window.location = '/messages.html';
		}
	});
	return false;
}

document.getElementById('registerButton').addEventListener('click',
		function(e) {
			window.location = '/register.html';

		}, false);