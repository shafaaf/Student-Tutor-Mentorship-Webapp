function clickSubmit() {
  var firstName = ($('#profile-form').find('input[name=first_name]')).val();
  var lastName = ($('#profile-form').find('input[name=last_name]')).val();
  var subject = ($('#profile-form').find('input[name=subject]')).val();
  var role = ($('#profile-form').find('input[name=role]')).val();

  $.ajax({
    url: '\/editprofile',
    method: 'POST',
    data: {firstName, lastName, subject, role}
  }).done(function() {
    alert("Success");
  }).fail(function() {
    alert("Failed");
  });
}
