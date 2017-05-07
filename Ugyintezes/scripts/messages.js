/**
 * http://usejsdoc.org/
 */

this.loadMessages();

function loadMessages() {
	var messagesRef = firebase.database().ref('Messages');
	messagesRef.off();

	var loadMessagesFunc = function(data) {
		var messageTable = document.getElementById('messagetable');
		var row = messageTable.insertRow(0);

		firebase.database().ref('Users').child(data.val().OvnerUserId).once(
				'value', function(snapshot) {
					var cell0 = row.insertCell(0);
					cell0.innerHTML = snapshot.val().EMail;

					var cell1 = row.insertCell(1);
					cell1.innerHTML = data.val().MessageDate;

					var cell2 = row.insertCell(2);
					cell2.innerHTML = data.val().MessageText;
				});

	}.bind(this);

	messagesRef.on('child_added', loadMessagesFunc);
}