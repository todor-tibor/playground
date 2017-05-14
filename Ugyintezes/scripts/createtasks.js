/**
 * http://usejsdoc.org/
 */

var currentUserId;
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		currentUserId = user.uid;
		loadStatus();
		loadUsers();
	}
});
var idToEmailMap = new Map();

// Hozza adja a kivalasztott felhasznalot a tablazathoz
document.getElementById('adduser').addEventListener('click', function(e) {
	e.preventDefault();
	var userSelect = document.getElementById('userselect');
	var userId = userSelect.options[userSelect.selectedIndex].id;
	var useremail = userSelect.options[userSelect.selectedIndex].text;
	addUserToTable(userId, useremail);

}, false);

var editTaskId = getQueryVariable("taskid");
if (editTaskId != null) {
	editTask(editTaskId);
}else{
	createTask();
}


var usersMap = new Map();
var usersIndex = 0;
function editTask(taskId){	
	var taskRef = firebase.database().ref('Tasks/' + taskId);
	
	taskRef.once('value', function(task) {
		document.getElementById('taskname').value = task.val().TaskTitle;
		document.getElementById('description').value = task.val().TaskDescription;
		var selectedStatus = task.val().TaskStatus;
		var selectedUser = task.val().UserIds;
		for (var i = 0; i < selectedUser.length; i++) {
			var userId = selectedUser[i];
			addUserToTable(userId, idToEmailMap.get(userId));
		}
	});
	
	document.getElementById('newtask').addEventListener("submit", function(e) {
		var taskname = document.getElementById('taskname').value;
		var description = document.getElementById('description').value;

		var statusSelect = document.getElementById('statusselect');
		var statusId = statusSelect.options[statusSelect.selectedIndex].id;
		
		var keyvalue = {};
		for (var [key, value] of usersMap) {
			keyvalue[key]=value;
		}
		console.log(keyvalue);
		
		var currentDate = new Date(Date.now());
		var currentDateString = currentDate.getFullYear() +
		"-" + (currentDate.getMonth()+ 1) + 
		"-" + currentDate.getDate()+ 
		" " + currentDate.getHours()+
		":"+currentDate.getMinutes()+
		":"+currentDate.getSeconds();

		
		taskRef.set({
			TaskTitle : taskname,
			ReporterUserId : currentUserId,
			TaskDate : currentDateString,
			TaskDescription : description,
			TaskStatus : statusId,
			UserIds : keyvalue		
		});
		
		document.getElementById('taskname').value = '';
		document.getElementById('description').value = '';
	
		var messagesRef = firebase.database().ref('Messages');
		messagesRef.push({
			MessageText : "Task updated with name: " + taskname,
			OvnerUserId : currentUserId,
			MessageDate : currentDateString
		});
	});
}

function addUserToTable(userId, useremail){
	var userTable = document.getElementById('usertable');
	
	var lenght = userTable.rows.length;
	var alreadyExist = false;
	
	for (var i = 0; i < lenght; i++) {
		var currentRow = userTable.rows[i];
		if (useremail === currentRow.cells[0].innerHTML) {
			alreadyExist = true;
			break;
		}
	}
	
	if (!alreadyExist) {
		usersMap.set(usersIndex, userId);
		usersIndex++;

		var row = userTable.insertRow(lenght);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);

		cell1.innerHTML = useremail;
		cell2.innerHTML = "<button type=\"button\" id=\"delete"+userId+"\">delete</button>";

		document.getElementById('delete' + userId).addEventListener('click', function() {
			for (var [key, value] of usersMap) {
				if (value === userId) {
					usersMap.delete(key);
				}
			}
			userTable.deleteRow(row.rowIndex);
		}, false);
	}
}
function createTask(){
	// letrehoz egy uj Task-ot az adatbazisba
	document.getElementById('newtask').addEventListener("submit", function(e) {
		e.preventDefault();
		var taskname = document.getElementById('taskname').value;
		var description = document.getElementById('description').value;

		var statusSelect = document.getElementById('statusselect');
		var statusId = statusSelect.options[statusSelect.selectedIndex].id;

		var userSelect = document.getElementById('userselect');
		var userId = userSelect.options[userSelect.selectedIndex].id;
		var newList = userId.slice;

		var currentDate = new Date(Date.now());
		var currentDateString = currentDate.getFullYear() +
		"-" + (currentDate.getMonth()+ 1) + 
		"-" + currentDate.getDate()+ 
		" " + currentDate.getHours()+
		":"+currentDate.getMinutes()+
		":"+currentDate.getSeconds();

			var taskRef = firebase.database().ref('Tasks');

			var keyvalue = {};
			for (var [key, value] of usersMap) {
				keyvalue[key]=value;
			}
			
			taskRef.push({
				ReporterUserId : currentUserId,
				TaskDate : currentDateString,
				TaskTitle : taskname,
				TaskDescription : description,
				TaskStatus : statusId,
				UserIds : keyvalue
			}).then(function(snapshot) {
				document.getElementById('taskname').value = '';
				document.getElementById('description').value = '';
			

				var messagesRef = firebase.database().ref('Messages');
				messagesRef.push({
					MessageText : "New task created with name: " + taskname,
					OvnerUserId : currentUserId,
					MessageDate : currentDateString
				});
			});
	}, false);

}

function loadUsers() {
	var currentUserRef = firebase.database().ref('Users/' + currentUserId);
	currentUserRef.off();

	var idsToAdd = null;
	currentUserRef.once('value', function(user) {
		idsToAdd = user.val().SubordinateUserIds;
	});
	
	var usersRef = firebase.database().ref('Users');
			usersRef.off();
	
	var userSelect = document.getElementById('userselect');
	var loadUsersFunc = function(data) {
		if (idsToAdd != null) {
			var id = data.key;
			if(contains(idsToAdd,id)){
				var option = document.createElement("option");
				option.text = data.val().EMail;
				option.id = id;
				idToEmailMap.set(data.key, data.val().EMail);
				userSelect.add(option);
			}
		}
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

// igazat terit vissza ha a tomb tartalmazza a megadott obj-et
function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}

// vissza teriti a megadott parameter erteket (URL parameter)
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  } 
}
