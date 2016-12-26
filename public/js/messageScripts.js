var email = "";
var participantId = 1;
var selectedParticipant = "";
var myPollBreak = false;

//------------------------------------------------------------------------------

$(document).ready(function() {
    console.log( "ready!" );
    //start poll
    myPoll();

    /*hide message box at beginning*/
	$('#textarea_message').hide();

	//Get all participant names at the beginning
    $.ajax({
        url: "/getemail",
        type: "GET",
        dataType: "json",
        success: function (data) 
        {
        	console.log("email got back is ", data);
        	email = data;
        }
    });    

    //Get all participant names at the beginning
    $.ajax({
        url: "/participants",
        type: "GET",
        dataType: "json",
        success: function (data) 
        {
        	console.log("data is: ", data);
        	var numParticipants = data.length;
        	var participantIdString = "participant";
        	var i,j;

        	for(i = 0; i < numParticipants; i++)
        	{
        		var participant = document.createElement("div");
        		var participantName;

        		//Get participant name
        		if(data[i].Users[0] == email)
        		{
        			console.log("other participant is " + data[i].Users[1]);
        			participantName = data[i].Users[1];
        		}
        		else
        		{
        			console.log("other participant is " + data[i].Users[0]);
        			participantName = data[i].Users[0];
        		}

        		//<span style="cursor:pointer">pointer</span><br>

        		/*
        		var t = document.createTextNode(participantName);
        		participant.appendChild(t);
        		*/
        		participant.innerHTML = participantName;
        		

        		var id = participantIdString + participantId;
        		participantId = participantId + 1;
        		participant.setAttribute("id", id);
        		participant.style.cursor = "pointer";
        		participant.addEventListener("click", function(){
        			specificMessages(this.id);
        		});


        		var participantList = document.getElementById("participantList");
        		participantList.appendChild(participant);
        	}
        }
    });

//------------------------------------------------------------------------------
	
	//Function to get all messages for specific participant
	//called when user clicks on a participant box
	function specificMessages(id)
	{
		//Set global selectedParticipant var to help in polling
		selectedParticipant = participantName;

		$('#textarea_message').show();
		$('#chat-messages').empty();

		var participantName = document.getElementById(id).innerHTML;
		console.log("userMessages: participantName is " + participantName);

		//Set global selectedParticipant var to help in polling
		selectedParticipant = participantName;

		//Get all messaged between user and specific participant
   		$.ajax({
	        url: "/specificmessages",
	        type: "POST",
	        data: {participantName: participantName},
	        dataType: "json",
	        success: function (data) 
	        {
	        	console.log("Received back: ", data);
	        	if(data.length)
				{
					for(var x = 0;x<data.length;x++)
					{
						var message = document.createElement("div");
						message.setAttribute('class','my_message');
						message.textContent = data[x].From + ": " +data[x].Text;
						var messages =  document.getElementById('chat-messages');
						messages.appendChild(message);
					}
				}
	        }
    	});


	}

//------------------------------------------------------------------------------

	function myPoll()
	{
		var participantName = selectedParticipant;

	   	setTimeout(function(){
	      $.ajax({ 
	      	url: "/specificmessages",
	      	type: "POST",
	      	data: {participantName: participantName},
	      	dataType: "json",
	      	success: function(data){
		        //Update stuff
		        console.log("Received back: ", data);
		        if(data.length)
				{	
					if(participantName == selectedParticipant)
					{
						$('#chat-messages').empty();
						for(var x = 0;x<data.length;x++)
						{
							var message = document.createElement("div");
							message.setAttribute('class','my_message');
							message.textContent = data[x].From + ": " + data[x].Text;
							var messages =  document.getElementById('chat-messages');
							messages.appendChild(message);
						}
					}	
				}

		        //Setup the next poll recursively
		        myPoll();
	      	}
	    });
	  }, 200);
	}


//------------------------------------------------------------------------------

	//Sending user messages written in text section
	var messageTextArea = document.getElementById("textarea_message");
	messageTextArea.addEventListener("keydown", function(event)
	{
		//Only send when user presses enter key with no shift key
		if(event.which === 13 && event.shiftKey === false)
		{	
			//Getting name and message fields
			var name = $( ".chat-name" ).val();
			var message = $( "#textarea_message").val();
			console.log("Sending message:  " + message + " to: " + selectedParticipant);
			$( "#textarea_message").val('');

			//Prevent default behavior of enter button
			event.preventDefault();

			//Ajax call to send message
			$.ajax({
		        url: "/sendmessages",
		        type: "POST",
		        data: {participantName: selectedParticipant, message:  message},
		        dataType: "json",
		        success: function (data) 
		        {
		        	console.log("Success. Data sent back is ", data);
		        }
		    });    
		}
	});



});
