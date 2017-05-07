/**
 * http://usejsdoc.org/
 */
this.loadTasks();

function loadTasks() {

	var taskRef = firebase.database().ref('Tasks');
	taskRef.off();

	var loadTasksFunc = function(data) {
		var val = data.val();
		this.loadTasksToTable(data.key, val.TaskDescription, val.TaskTitle,
				val.TaskStatus, val.UserIds, val.TaskDate);
	}.bind(this);

	taskRef.on('child_added', loadTasksFunc);
};

function loadTasksToTable(key, description, tasktitle, status, users, date) {
	var usersRef = firebase.database().ref('Users');
	var statusRef = firebase.database().ref('Status');

	var taskTable = document.getElementById('table');
	var lenght = table.rows.length;
	var row = table.insertRow(lenght);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);
	var cell6 = row.insertCell(5);

	for (i = 0; i < users.length; i++) {
		usersRef.child(users[i]).once('value', function(snapshot) {
			console.log(snapshot.val().EMail);
			cell3.innerHTML += snapshot.val().EMail + ",";
		});
	}

	statusRef.child(status).once('value', function(snapshot) {
		cell2.innerHTML = snapshot.val();
	});

	cell1.innerHTML = tasktitle;
	cell4.innerHTML = description;
	cell5.innerHTML = "<button name=\"edit\" id = \"edit" + key
			+ "\">Edit</button>"
	cell6.innerHTML = "<button name=\"delete\" id = \"delete" + key
			+ "\">Delete</button>"
	document.getElementById('delete' + key).addEventListener(
			'click',
			function() {
				var messagesRef = firebase.database().ref('Messages');
				messagesRef.push({
					MessageText : "Task deleted with name: " + tasktitle
				});
				firebase.database().ref('Tasks').child(key).remove();
				location.reload();
			}, false);

	// document.getElementById('edit' + key).addEventListener('click',
	// function() {
	// document.getElementById('taskname').value = name;
	// document.getElementById('description').value = description;
	// taskEditId = key;
	// }, false);
}
