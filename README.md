Project
=======

Live Site
---------

[http://csc309-coursescheduler.rhcloud.com/](http://csc309-coursescheduler.rhcloud.com/)

Design
------

#### Parts of the app:

* Login/Register - login/register for the app.
* Profiles - Set up a user profile as either a student or tutor, with a specified
  subject.
* Search - Allows students to search for tutors by subject.
* Calendar - Schedule events with tutors, such as an upcoming chat session.
* Email Notifications: Notify tutors by email that an event has been scheduled.
* Chat - Allows a student to chat with a tutor.

#### Interaction:

The interaction of each of these pieces is described in the following paragraph.

Our application begins at a login page which redirects to a one page
application. Upon creating an account the user is redirected to their profile
page to input information, such as whether they want to be a student or tutor,
and prompted to input a subject that they would like to be associated with.
From there, students can go to the Find Tutor page in the left nav bar, where
they can search for a subject (try "computer science" for instance). The student
would then be presented with a list of tutors who have the search query listed
as their subject. Next, the student can click either "start chat" or
"schedule session". If they click start chat, they can then navigate to the 
"Chats" page from the left nav bar, where, if they click the user they have
messaged, they can chat with them. Their messages can vary from asking if they
are willing to tutor, payment negotiations to even direct tutoring services on 
the chat system.If instead, the user clicks "Schedule Session" they are
redirected to the tutor's calendar, where they can click add event to
schedule a session. The tutor will then be sent a notification email that a
student has set up an event, at which point they can log in and see the event
in their calendar. Additionally, When a tutor logs in, instead of having a
search page they will have an agenda style calendar for the coming week.

#### Notes on Chat System:

The chat messages are all stored in a separate MongoDB database due to the vast 
quantity of data that needs to be stored. For organization in the database, there 
are two collections. One collection is called "participants"  which  keeps track
of who messaged who (i.e it just lists the people involved in a chat). The other
collection is called "messages" which records the actual messages along with a 
“from” and a “to” field. Using the participants collection, the correct messages
can be queried from the database. Any new incoming messages update the user’s
front end to give it a real chat feel. This is done by a polling AJAX function 
which checks constantly if new messages are available in the database. This way, 
if new messages are sent from the other user, the chat box is updated.

Architecture
------------

Our project implements the MVC architecture discussed in class. The project
files are laid out as follows, and are supported by a PostgreSQL backend, as well as
a MongoDB backend for the chat system. The reason we went with two different
database technologies is because we prefer the relational model that PostgreSQL
offers, but also thought MongoDB would be better for the quantity of messages in
the chat system.

* controllers
  * admin.js - Handles the server side logic for the admin page.
  * calendar.js - Handles the server side logic for the calendar and events.
  * email.js - Handles the server side logic for sending notification emails.
  * home.js - Handles the server side logic for the login page.
  * messages.js - Handles server side logic for messaging in the chat room.
  * profile.js - Handles server side logic for view and update profiles.
  * search.js - Handles server side logic for search functionality.
* views
  * HTMLtemplates - The main template for the one page app.
  * admin - Admin content to be appended to the main view.
  * home - The login page.
  * messages - The messaging view.
  * profile - Profile content to be appended to the main view.
  * search - Search content to be appended to the main view.
* public
  * css - Styles for the views above.
  * js - Client side scripts.
  * lib - The fullcalendar.io calendar library.
* mongoUtil.js - Connection to our MongoDB backend.
* routes.js - The routes file.
* server.js - The main server file for our application.

Additional Features
-------------------

In addition to the required functionality of Profiling, User Authentication,
Search, Data, Views, and Admin, we implemented the following extra features:

1. Third party login with both GitHub and Google APIs.
2. Chat system.
3. Calendar/event scheduling system.
4. Email notifications


Proposal Features Not Fully Implemented
---------------------------------------

1. We don't have in-app notifications, instead we email calendar events to the
   user.
2. Chats are only 1 on 1, not group.
3. The calendar events can only be scheduled from student to tutor, and not
   tutor to student. (This was a design choice).
4. Edit profile doesn't include updating passwords.
5. Rating of tutors isn't implemented.
6. Instead of using Google API for calendar, we went with a library called
   fullcalendar: [https://fullcalendar.io](https://fullcalendar.io)

