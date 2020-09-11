// Credit: https://gist.github.com/jezhou/

// Fire off this function in the script editor to enable.

// Fire off this function in the script editor to enable.
function init() {

  var triggers = ScriptApp.getProjectTriggers();
  var form = FormApp.getActiveForm();

  // Delete all triggers before making a brand new one.
  for(var i in triggers) {
    ScriptApp.deleteTrigger(triggers[i]);
  }

  // Set up a new trigger
  ScriptApp.newTrigger('submitToTrello')
           .forForm(form)
           .onFormSubmit()
           .create();

  Logger.log('Successful creation of new submitToTrello trigger.');

}

function submitToTrello(e) {

  var form = FormApp.getActiveForm();
  var latestItemResponses = form.getResponses().pop().getItemResponses();

  if (MailApp.getRemainingDailyQuota() > 0) {

    // Trello email address goes here
    var email = "";

    // Subject line will be the title of the event on Trello card
    var subject = latestItemResponses[0].getResponse();

    // Intial empty body
    var body = "";

    // Loop through recent responses and format them into string
    latestItemResponses.forEach(function (value, index, array) {
      var formatted = Utilities.formatString("**%s**\n %s\n\n", value.getItem().getTitle(), value.getResponse());
      body = body.concat(formatted);
    });

    MailApp.sendEmail(email, subject, body);
  }

}