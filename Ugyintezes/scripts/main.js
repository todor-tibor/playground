this.loadTasks();
this.initListeners();
this.loadMessages();
this.loadUsers();
this.loadStatus();

function loadStatus(){
	var statusRef = firebase.database().ref('status');
	statusRef.off();

	var statusSelect = document.getElementById('statusselect');
	var loadStatusFunc = function(data) {
		var val = data.val();
		var option = document.createElement("option");
		option.text = val.name;
		option.id = data.key;
		statusSelect.add(option);
	}.bind(this);

	statusRef.on('child_added', loadStatusFunc);
}
function loadUsers(){
	var usersRef = firebase.database().ref('users');
	usersRef.off();


	var userSelect = document.getElementById('userselect');
	var loadUsersFunc = function(data) {
		var val = data.val();
		var option = document.createElement("option");
		option.text = val.name;
		option.id = data.key;
		userSelect.add(option);
	}.bind(this);

	usersRef.on('child_added', loadUsersFunc);
}

var taskEditId = null;
function loadTasks() {

	var taskRef = firebase.database().ref('tasks');
	taskRef.off();


	var loadTasksFunc = function(data) {
		var val = data.val();
		this.loadTasksToTable(data.key, val.description, val.name, val.status,
				val.user);
	}.bind(this);

	taskRef.on('child_added', loadTasksFunc);
};

function loadMessages(){
	var messagesRef = firebase.database().ref('messages');
	messagesRef.off();
	
	var loadMessagesFunc = function(data) {
		var val = data.val();
		var para = document.createElement("P");                       // Create a <p> element
		var t = document.createTextNode(val.text);       // Create a text node
		para.appendChild(t);                                          // Append the text to <p>
		document.body.appendChild(para);                              // Append <p> to <body>
	}.bind(this);

	messagesRef.on('child_added', loadMessagesFunc);
}

function loadTasksToTable(key, description, name, status, user) {
    var usersRef = firebase.database().ref('users');
    var statusRef = firebase.database().ref('status');

	var taskTable = document.getElementById('table');
	var lenght = table.rows.length;
	var row = table.insertRow(lenght);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);
	var cell6 = row.insertCell(5);

	statusRef.child(status).once('value', function(snapshot) {
		cell2.innerHTML = snapshot.val().name;
	});

	usersRef.child(user).once('value', function(snapshot) {
		cell3.innerHTML = snapshot.val().name;
	});

	cell1.innerHTML = name;
	cell4.innerHTML = description;
	cell5.innerHTML = "<button name=\"edit\" id = \"edit"+key+"\">Edit</button>"
	cell6.innerHTML = "<button name=\"delete\" id = \"delete"+key+"\">Delete</button>"
	document.getElementById('delete' + key).addEventListener('click',
			function() {
				var messagesRef = firebase.database().ref('messages');
				messagesRef.push({
					text: "Task deleted with name: " + name + " and user: " + user
				});
				firebase.database().ref('tasks').child(key).remove();
				location.reload();
			}, false);
	
	document.getElementById('edit' + key).addEventListener('click',
			function() {
				document.getElementById('taskname').value = name;
				document.getElementById('description').value = description;
				taskEditId = key;
			}, false);
}


function initListeners() {
	document.getElementById('newtask').addEventListener("submit", function(e) {
		e.preventDefault();
		var taskname = document.getElementById('taskname').value;
		var description = document.getElementById('description').value;

		var statusSelect = document.getElementById('statusselect');
		var statusId = statusSelect.options[statusSelect.selectedIndex].id;

		var userSelect = document.getElementById('userselect');
		var userId = userSelect.options[userSelect.selectedIndex].id;
		

		if (taskEditId == null) {
			var taskRef = firebase.database().ref('tasks');
			taskRef.push({
				name : taskname,
				description : description,
				status : statusId,
				user : userId
			}).then(function() {
				document.getElementById('taskname').value = '';
				document.getElementById('description').value = '';

				var messagesRef = firebase.database().ref('messages');
				messagesRef.push({
					text: "New task created with name: " + taskname
				});
			});
		}else{
			var taskRef = firebase.database().ref('tasks/' + taskEditId);
			taskRef.set({
				name : taskname,
				description : description,
				status : statusId,
				user : userId
			}).then(function() {
				document.getElementById('taskname').value = '';
				document.getElementById('description').value = '';

				var messagesRef = firebase.database().ref('messages');
				messagesRef.push({
					text: "Task changed with name: " + taskname
				});

				taskEditId = null;
				location.reload();
			});
		}
	}, false);
}