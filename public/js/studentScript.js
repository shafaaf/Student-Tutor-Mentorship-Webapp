'use strict';
var sideNavBar;
var middle;
var email;
var firstName;
var lastName;
var role;
var chat = 0;

$(document).ready(function () {
  // Check if user is logged in. If user is not logged in, redirect to home page
  $.ajax({
    url: '\/getprofile',
    method: 'GET',
  }).success(function(jsondata) {
    email = jsondata.email;
    firstName = jsondata.firstname;
    lastName = jsondata.lastname;
    role = jsondata.role;
    setUpPage();
  }).fail(function () {
    window.location = "http://csc309-coursescheduler.rhcloud.com/";
  });
});

// Set up the initial view
function setUpPage() {
  // Set up view according to role of user
  if (role === 'tutor') {
    $('.side .active').text("Upcoming Events");
    displayUpcomingEventsPage();
  } else {
    $('.side .active').text("Find Tutor");
    displayTutorPage();
  }
  // Update user name and role in top right corner
  $('.user').text("Logged in as " + firstCapital(firstName) + " " + firstCapital(lastName) + " (" + firstCapital(role) + ")");
  sideNavBar = $(".side-navigation-bar").contents();
  middle = $(".middle").contents();
  ClickTopNavigation();
  clickSideNavigation();
}

// Set up the functions for clicks on the the top navigation items
function ClickTopNavigation() {
  $('.left li a').click(function(e) {
          $('.left li a').removeClass('active');

          if (!$(this).hasClass('active')) {
              $(this).addClass('active');
          }
          var page = $(this)[0].innerHTML;

          if (page === "About")
            displayAboutPage();
          if (page === "Contact Us")
            displayContactPage();
          if (page === "Home")
            displayHomePage();
          e.preventDefault();
      });
}

// Set up the functions for clicks on the side navigation items
function clickSideNavigation() {
  $('.side li a').click(function(e) {
          $('.side li a').removeClass('active');

          if (!$(this).hasClass('active')) {
              $(this).addClass('active');
          }
          var page = $(this)[0].innerHTML;

          if (page === "Find Tutor")
            displayTutorPage();
          if (page === "Profile")
            displayProfilePage();
          if (page === "Chats")
            displayChatPage();
          if (page === "Calendar")
            displayCalendarPage();
          if (page === "Upcoming Events")
            displayUpcomingEventsPage();
          e.preventDefault();
      });
}

// Display about page
function displayAboutPage() {
  chat = 0;
  clearMiddle();
  $(".middle").append("<h1>Group 6ix</h1>");
}

// Display contact page
function displayContactPage() {
  chat = 0;
  clearMiddle();
  $(".middle").append("<h1>Please Don't</h1>");
}

// Display the home page
function displayHomePage() {
  chat = 0;
  clearMiddle();
  $(".side-navigation-bar").append(sideNavBar);
  $('.side li a').removeClass('active');
  $('.side li a').first().addClass('active');
  clickSideNavigation();
  addSearchButton();
}

// Display the find tutors page
function displayTutorPage() {
  chat = 0;
  $(".middle").empty();
  addSearchButton();
}

// Display the user profile page
function displayProfilePage() {
  chat = 0;
  $(".middle").empty();
  buildProfilePage();
}

// Display the chat page
function displayChatPage() {
  chat = 1;
  $(".middle").empty();
  $(".middle").append('<div class="col-sm-offset-0 col-sm-6" id = "participantList" style = "float: left; text-align: center;">' +
        '<h1>Users messaged</h1>' +
        '</div>' +
      '<div style = "float: left;">' +
        '<h1  style = "text-align:center;">Messages</h1>' +
        '<div class = "chat">' +
          '<div class = "chat-messages" id = "chat-messages">' +
            '<!--overall chat in here' +
            '<div class = "my_message">' +
           ' </div>-->' +
          '</div>' +
          '<textarea id = "textarea_message" placeholder = "Type your message:"></textarea>' +
        '</div>' +
      '</div>');
  $('#chat-messages').empty();
  loadChatFunctionality();
}

// Load chat functionality
function loadChatFunctionality() {
  $('#chat-messages').empty();
  var selectedParticipant;
  var participantId;
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
          var numParticipants = data.length;
          var participantIdString = "participant";
          var i;

          for(i = 0; i < numParticipants; i++)
          {
            var participant = document.createElement("div");
            var participantName;

            //Get participant name
            if(data[i].Users[0] == email)
            {
              participantName = data[i].Users[1];
            }
            else
            {
              participantName = data[i].Users[0];
            }

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
            if (chat == 1)
              myPoll();
            return;
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
      var message = $( "#textarea_message").val();
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
            }
        });
    }
  });
}

// Display the calendar page
function displayCalendarPage() {
  chat = 0;
  $(".middle").empty();
  $(".middle").append('<div>' +
                        '<h1 style = "text-align:center;">Your Calendar</h1>' +
                        '<div id=\'calendar\'></div>' +
                        '<button onclick=addEvent()>Add Event</button>' +
                        '<button onclick=deleteEvent()>Delete Event</button>' +
                       '</div>');
  displayCalendar();
}

// Display upcoming events page
function displayUpcomingEventsPage() {
  chat = 0;
  $(".middle").empty();
  $(".middle").append('<div>' +
                        '<h1 style = "text-align:center;">Your Calendar</h1>' +
                        '<div id=\'calendar\'></div>' +
                        '</div>');

  displayCalendar();
  $("#calendar").fullCalendar('changeView', 'agendaWeek');
}

// Display the profile information of the student
function buildProfilePage() {
  $.ajax({
    url: '\/getprofile',
    method: 'GET',
    }).done(function(jsondata) {
    $(".middle").append('<div class="container">\
        <h1>Profile</h1>\
        <table>\
          <tr><td>Email:</td><td id="email">' + jsondata.email + '</td></tr>' +
          '<tr><td>First Name:</td><td id="first_name">' + firstCapital(jsondata.firstname) + '</td></tr>' +
          '<tr><td>Last Name:</td><td id="last_name">' + firstCapital(jsondata.lastname) + '</td></tr>' +
          '<tr><td>Role:</td><td id="role">' + firstCapital(jsondata.role) + '</td></tr>' +
          '<tr><td>Subjects:</td><td id="subjects">' + firstCapital(jsondata.subject) + '</td></tr>' +
        '</table>' +
        '<button onclick="editProfile()">Edit Profile</button>' +
      '</div>');
    });
}

// Display the form to edit user info
function editProfile() {
  $(".middle").empty();
  $.ajax({
    url: '\/EditProfileHTML',
    method: 'GET'
  }).done(function(htmlData) {
    $(".middle").append(htmlData);
  });
}

// Add the search input and functionality
function addSearchButton() {
  $(".middle").empty();
  $.ajax({
    url: '\/searchPage',
    method: 'GET'
  }).done(function(htmlData) {
    $(".middle").append(htmlData);
    $("#search_box").on("keypress", function(event) { // On clicking enter
      if(event.keyCode === 13) {
        searchSubmit();
      }
    });
  });
}

// Set up the search button functionality
function searchSubmit() {
  var searchQuery = document.getElementById("search_box").value;
  $.ajax({
    url:'\/search',
    method: 'POST',
    data: {searchQuery}
  }).done(function(jsondata) {
    displaySearchResults(jsondata);
  });
}

// Display the search of the users
function displaySearchResults(searchResults) {
  var $searchResultDiv = $(".search_results");
  if (searchResults.length === 0) {
    $searchResultDiv.append("<h3>No Results</h3>");
  }
  var i;
  for (i = 0; i < searchResults.length; i++) {
    var $result = buildUserProfileSearch(searchResults[i]);
    $searchResultDiv.append($result);
  }
}

// Build and display search results
function buildUserProfileSearch(user) {
  var $result = $("<div>");
  $result.addClass("individual-tutor");

  var $firstname = $("<p>");
  var $lastname = $("<p>");
  var $email = $("<p>");
  var $subject = $("<p>");
  var $button = $("<button>");
  var $scheduleButton = $("<button>");

  $firstname.text(user.firstname);
  $lastname.text(user.lastname);
  $email.text(user.email);
  $subject.text(user.subject);

  $button.text("Start Chat");
  $button.on("click", function () {
    handleChatClick(this.parentElement);
  });
  $scheduleButton.text("Schedule Session");
  $scheduleButton.on("click", function () {
    handleScheduleClick(this.parentElement);
  });

  $result.append($firstname);
  $result.append($lastname);
  $result.append($email);
  $result.append($subject);
  $result.append($button);
  $result.append($scheduleButton);

  return $result;
}

// Handle clicking schedule session button
function handleScheduleClick (tutorDiv) {
  var $div = $(tutorDiv);
  var children = $div.children();
  var email = children[2].innerHTML;
  displayTutorCalendar(email);
}

// Display the tutors calendar
function displayTutorCalendar (email) {
  $(".middle").empty();
  var $addTutorEvent = $("<button>");
  $(".middle").append('<div>' +
                        '<h1 style = "text-align:center;">Tutor Calendar</h1>' +
                        '<div id=\'calendar\'></div>' +
                       '</div>');
  $addTutorEvent.on("click", function() {
    addTutorEvent(email);
  });
  $addTutorEvent.text("Add Event");
  $("#calendar").append($addTutorEvent);
  displayCalendar(email);
}

// Set up adding event to tutors calendar
function addTutorEvent(email) {
  $(".middle").append('<div id="dialog" title="Add Event">' +
                          '<p class="validateTips">All fields are required"</p>' +
                          '<form>' +
                            '<fieldset>' +
                              '<label for="title">Title</label>' +
                              '<input type="text" name="name" id="title" class="text ui-widget-content ui-corner-all">' +
                              '<label for="date">Date</label>' +
                              '<input type="date" name="date" id="date" class="text ui-widget-content ui-corner-all">' +
                              '<label for="timeStart">Start Time</label>' +
                              '<input type="time" name="timeStart" id="timeStart" class="text ui-widget-content ui-corner-all">' +
                              '<label for="timeEnd">End Time</label>' +
                              '<input type="time" name="timeEnd" id="timeEnd" class="text ui-widget-content ui-corner-all">' +
                            '</fieldset>' +
                          '</form>' +
                       '</div>');
  $( "#dialog" ).dialog({
      height: 400,
      width: 350,
      modal: true,
      buttons: {
        "Create Event": function() {addToTutorCalendar(email);},
      },
        close: function() {
          $(this).remove();
      }
  });
}

// Add event to users and tutors calendar
function addToTutorCalendar(email) {
  //Will add event to Users calendar
  addToCalendar("");
  addToCalendar(email);
}

// Handle event on clicking add chat button
function handleChatClick (tutorDiv) {
  var $div = $(tutorDiv);
  var children = $div.children();
  var email = children[2].innerHTML;

  var fullUrl = "/addparticipant?participantEmail="+email;
  //ajax call to add in this participant to participants list
  $.ajax({
    url: fullUrl,
    type: "GET",
    dataType: "json",
    success: function (data) {
      alert("Chat started. Check messages");
    }
  });
}

// Display the calendar with events
function displayCalendar(email) {
  if (!email) {
    email = "";
  }
  $('#calendar').fullCalendar({
        // put your options and callbacks here
        events: function(start, end, timezoone, callback) {
          $.ajax({
            url: '\/getEvents?email=' + email,
            method: 'GET',
          }).success( function(jsondata) {
            // Display the events inside the calendar
            var dataArray = JSON.parse(jsondata)["events"];
            var events = [];
            for (var i = 0; i < dataArray.length; i++) {
              events.push({
                title: dataArray[i].title,
                start: dataArray[i].start,
                end: dataArray[i].end
              });
            }
            callback(events);
          }).fail(function( jqXHR, textStatus, errorThrown ) {
            console.log(errorThrown);
          });
        },
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        height: 450
  });
}



// Handle click on add event button
function addEvent() {
  $(".middle").append('<div id="dialog" title="Add Event">' +
                          '<p class="validateTips">All fields are required"</p>' +
                          '<form>' +
                            '<fieldset>' +
                              '<label for="title">Title</label>' +
                              '<input type="text" name="name" id="title" class="text ui-widget-content ui-corner-all">' +
                              '<label for="date">Date</label>' +
                              '<input type="date" name="date" id="date" class="text ui-widget-content ui-corner-all">' +
                              '<label for="timeStart">Start Time</label>' +
                              '<input type="time" name="timeStart" id="timeStart" class="text ui-widget-content ui-corner-all">' +
                              '<label for="timeEnd">End Time</label>' +
                              '<input type="time" name="timeEnd" id="timeEnd" class="text ui-widget-content ui-corner-all">' +
                            '</fieldset>' +
                          '</form>' +
                       '</div>');
  $( "#dialog" ).dialog({
      height: 400,
      width: 350,
      modal: true,
      buttons: {
        "Create Event": function() {
          addToCalendar("");
        },
      },
      close: function() {
        $(this).remove();
      }
  });
}

// Add event to calendar
function addToCalendar(email) {

  var title = $("#title")[0].value;
  var date = $("#date")[0].value;
  var timeStart = $("#timeStart")[0].value;
  var timeEnd = $("#timeEnd")[0].value;

  if (title === ""){
    alert("Please enter a title!");
    return;
  } else if (date === "") {
    alert("Please enter a date!");
    return;
  } else if (timeStart === "") {
    alert("Please enter a start time!");
    return;
  } else if (timeEnd === "") {
    alert ("Please enter an end time!");
    return;
  }

  var start = date + "T" + $("#timeStart")[0].value;
  var end = date + "T" + $("#timeEnd")[0].value;

  if (email) {
    $.ajax({
      url: '\/email',
      method: 'POST',
      data: {email, title, start, end}
    }).done(function(){})
    .fail(function(){});
  }

  $.ajax({
    url: '\/getEvents?email=' + email,
    method: 'GET'
  }).success( function(jsondata) {
      var dataArray = JSON.parse(jsondata);
      dataArray["events"].push({"title": title, "start" : start, "end" : end});
      dataArray["events"].sort(function(a, b) {
        return moment(a.start).diff(moment(b.start));
      });
      $.ajax({
        url: '\/addEvent',
        method: 'POST',
        data: {dataArray, email}
      }).done(function() {
        $("form")[ 0 ].reset();
        $('#dialog').dialog('close');
        $("#calendar").fullCalendar('refetchEvents');
      }).fail(function() {
        // alert("Failed");
    });
  });
}

// Handle click on delete event button
function deleteEvent() {
  $(".middle").append('<div id="delete_dialog" title="Delete Event">' +
                          '<p class="validateTips">Select which event you would like to delete</p>' +
                       '</div>');

  $("#delete_dialog").dialog({
      height: 400,
      width: 350,
      modal: true,
      overflow: "scroll",
      open: $.ajax({
              url: '\/getEvents',
              method: 'GET',
            }).success( function(jsondata) {
              var dataArray = JSON.parse(jsondata)["events"];
              displayEvents(dataArray);
              }),
      close: function() {
        $(this).remove();
      }

    });
}

// Display options of events to delete
function displayEvents(events) {
  var dialog = $("#delete_dialog");
  for (var i = 0; i < events.length; i++) {
    var title = events[i].title;
    var startDate = events[i].start.split("T")[0];
    var startTime = events[i].start.split("T")[1];
    var myString = title + " on " + startDate + " at " + startTime;
    dialog.append("<p class='event' id='" + i + "'onclick=confirmDelete(this)>" + myString + "</p>");
  }
}

// Confirm delete of clicked event
function confirmDelete(event) {
  $('<div></div>').appendTo('body')
    .html('<div><h6>Are you sure?</h6></div>')
    .dialog({
        modal: true,
        title: 'Are you sure you want to delete ' + event.innerHTML + '?',
        zIndex: 10000,
        autoOpen: true,
        width: 'auto',
        resizable: false,
        buttons: {
            Yes: function () {
                event.remove();
                deleteCalendarEvent(event.id);

                $(this).dialog("close");
                $("#delete_dialog").remove();

            },
            No: function () {
                $(this).dialog("close");
            }
        },
        close: function (event, ui) {
            $(this).remove();
        }
    });
}

// Delete event from calendar
function deleteCalendarEvent(id) {
  $.ajax({
    url: '\/getEvents',
    method: 'GET',
  }).success( function(jsondata) {
    var dataArray = JSON.parse(jsondata);

    dataArray["events"].splice(id, 1);

    $.ajax({
      url:'\/deleteEvent',
      method:'POST',
      data: {dataArray}
    }).done(function() {
      $("#calendar").fullCalendar('refetchEvents');
    });
  });
}

// Handle click on log out button
function logOut() {
  $.ajax({
    url: '\/deleteSession',
    method: 'POST',
  }).done(function() {
    window.location = "http://csc309-coursescheduler.rhcloud.com/";
  });
}

// Clear all itmes from the middle
function clearMiddle() {
  $(".middle").empty();
  $(".side-navigation-bar").empty();
}

// Capitilize first word of string
function firstCapital(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}