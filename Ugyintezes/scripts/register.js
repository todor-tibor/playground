/**
 * http://usejsdoc.org/
 */
this.loadRoles();

function loadRoles() {
	var roleRef = firebase.database().ref('Role');
	roleRef.off();

	var roleSelect = document.getElementById('roleselect');
	var loadRoleFunc = function(data) {
		var option = document.createElement("option");
		option.text = data.val();
		option.id = data.key;
		roleSelect.add(option);
	}.bind(this);

	roleRef.on('child_added', loadRoleFunc);
}

function register() {
	// lekeri az adatokat a html page tol
	var roleSelect = document.getElementById('roleselect');
	var email = document.getElementById('email').value;
	var firstName = document.getElementById('firstname').value;
	var lastName = document.getElementById('lastname').value;
	var password = document.getElementById('password').value;
	var roleId = roleSelect.options[roleSelect.selectedIndex].id;

	// registralja a firebase-ben a felhasznalot
	firebase.auth().createUserWithEmailAndPassword(email, password).then(
			function(user) {
				// hozza adjuk az adatbazishoz a
				// felhasznalot
				var usersRef = firebase.database().ref('Users/' + user.uid);
				usersRef.set({
					EMail : email,
					FirstName : firstName,
					LastName : lastName,
					Role : roleId
				})
				window.location = '/overview.html';
			});
	
	return false;
}