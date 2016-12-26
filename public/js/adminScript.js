/**
 * Populate table with data from database.
 * Add data in editable input boxes for editing.
 */
$(function() {
   $.ajax({
	   url: "\/admin\/users",
	   method: "GET"
   }).done(function(jsondata) {
		var users = jsondata.users;
	   
		var $section = $("#emailList");
		var $table = $("<table>");
		$table.addClass("flat-table flat-table-1").appendTo($section);
		var $headers = $("<tr>").appendTo($table);
		$("<th>").html("Email").appendTo($headers);
		$("<th>").html("Password").appendTo($headers);
		$("<th>").html("First Name").appendTo($headers);
		$("<th>").html("Last Name").appendTo($headers);
		$("<th>").html("Subject").appendTo($headers);
		$("<th>").html("Role").appendTo($headers);
		$("<th>").html("Save Changes").appendTo($headers);
		
		for (let i = 0; i < users.length; i++) {
			var user = users[i];
			var $tr = $("<tr>").appendTo($table);
			$("<td>").html(user.email).appendTo($tr);
			$("<td>").append($("<input>").val(user.password)).appendTo($tr);
			$("<td>").append($("<input>").val(user.firstname)).appendTo($tr);
			$("<td>").append($("<input>").val(user.lastname)).appendTo($tr);
			$("<td>").append($("<input>").val(user.subject)).appendTo($tr);
			$("<td>").append($("<input>").val(user.role)).appendTo($tr);
			
			var $button = $("<button>").html("Save").click(function() {
				var curr = $table.find("tr").eq(i + 1);
				var inputs = curr.find("input");
				editUsers(curr.find("td").eq(0).html(), inputs.eq(0).val(), 
				inputs.eq(1).val(), inputs.eq(2).val(), inputs.eq(3).val(), 
				inputs.eq(4).val());
			});
			
			$("<td>").append($button).appendTo($tr);
		}
   }).fail(function() {
		alert("Unauthorized");
		window.location = "http://csc309-coursescheduler.rhcloud.com/"
   });
});

/**
 * Send request to edit user.
 * 
 * @param {string} email - Email of user to edit.
 * @param {string} password - Password of user.
 * @param {string} firstname - First name of user.
 * @param {string} lastname - Last name of user.
 * @param {string} subject - Subject of user.
 * @param {string} role - Role of user.
 */
function editUsers(email, password, firstname, lastname, subject, role) {
	$.ajax({
		url: "\/admin\/edit",
		method: "POST",
		data: {email, password, firstname, lastname, subject, role}
	}).done(function() {
		alert("Success");
	}).fail(function() {
		alert("Failed");
	});
}