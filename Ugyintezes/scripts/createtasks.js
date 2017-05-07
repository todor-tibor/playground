/**
 * http://usejsdoc.org/
 */
this.loadStatus();
this.loadUsers();

var currentUserId;

firebase.auth().onAuthStateChanged(function(user) {
	console.log(user);
	if (user) {
		currentUser = user.uid;
	}
});

function loadUsers() {
	var usersRef = firebase.database().ref('Users');
	usersRef.off();

	var userSelect = document.getElementById('userselect');
	var loadUsersFunc = function(data) {
		var option = document.createElement("option");
		option.text = data.val().EMail;
		option.id = data.key;
		userSelect.add(option);
	}.bind(this);

	usersRef.on('child_added', loadUsersFunc);
}

function loadStatus() {
	var statusRef = firebase.database().ref('Status');
	statusRef.off();

	var statusSelect = document.getElementById('statusselect');
	var loadStatusFunc = function(data) {
		var option = document.createElement("option");
		option.text = data.val();
		option.id = data.key;
		statusSelect.add(option);
	}.bind(this);

	statusRef.on('child_added', loadStatusFunc);
}

var taskEditId = null;
document.getElementById('newtask').addEventListener("submit", function(e) {
	e.preventDefault();
	var taskname = document.getElementById('taskname').value;
	var description = document.getElementById('description').value;

	var statusSelect = document.getElementById('statusselect');
	var statusId = statusSelect.options[statusSelect.selectedIndex].id;

	var userSelect = document.getElementById('userselect');
	var userId = userSelect.options[userSelect.selectedIndex].id;

	if (taskEditId == null) {
		var taskRef = firebase.database().ref('Tasks');
		taskRef.push({
			ReporterUserId : currentUserId,
			TaskDate : Date.now(),
			TaskTitle : taskname,
			TaskDescription : description,
			TaskStatus : statusId,
		}).then(function() {
			document.getElementById('taskname').value = '';
			document.getElementById('description').value = '';

			var messagesRef = firebase.database().ref('Messages');
			messagesRef.push({
				text : "New task created with name: " + taskname
			});
		});
	} else {
		var taskRef = firebase.database().ref('Tasks/' + taskEditId);
		taskRef.set({
			name : taskname,
			description : description,
			status : statusId,
			user : userId
		}).then(function() {
			document.getElementById('taskname').value = '';
			document.getElementById('description').value = '';

			var messagesRef = firebase.database().ref('Messages');
			messagesRef.push({
				text : "Task changed with name: " + taskname
			});

			taskEditId = null;
			location.reload();
		});
	}
}, false);