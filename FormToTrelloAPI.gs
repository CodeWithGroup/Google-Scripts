//https://github.com/kmcroft13/submit-googleforms-to-trello/blob/master/GoogleForm-Trello-Integration.js

function onFormSubmit(e) {
    //Call function to create the card
    createTrelloCard(e.range);


    function createTrelloCard(range) {

        //CONFIG VARIABLES TO EDIT
        //Trello app key
        //Go to https://trello.com/1/appKey/generate to generate key
        var TrelloKey = ""; //Key to Trello app - SPECIFIC TO YOUR ACCOUNT

        //Trello app token
        //Go to https://trello.com/1/connect?key=[Key]&name=Google+Form+to+Trello+Feedback+Collection+App&response_type=token&scope=read,write to generate token
        var TrelloToken = ""; //Token for authorization - SPECIFIC TO YOUR ACCOUNT

        //ObjectID for Trello List that you want cards to be added to
        var TrelloList = "";

        //ObjectIDs for Trello labels in JS variables
        var eventbrite = '';
        var socialMedia = '';

        var mentors = '';

        var approval = '';

        //ADD ADDITIONAL LABELS HERE IF NECESSARY
        //END

        //Get last submitted values from the responses Sheet
        var values = range.getValues();
        var column = values[0];

        //Put values from the Sheet into JS variables
        var timestamp = column[0];
        var TitleOfEvent = column[1];
        var DescriptionOfEvent = column[2];
        var TypeOfEvent = column[3];
        var DateOfEvent = column[4];
        var MaxCapacity = column[5];
        var Name = column[6];
                var Email = column[11];

        var SlackHandle = column[12];
        var SupportOptions = column[8];
        var StartTime = column[9];
        var FinishTime = column[10];
        var Dependencies = column[13];

        //ADD MORE VARIABLES HERE FOR EACH COLUMN ON THE SHEET
        //KEEP IN MIND THAT COLUMNS ARE ZERO-INDEXED


        //Build and format data that will be pused for card Name and Description
        //cardName and cardDesc variables should be a String
        //Trello markdown can be put directly into the strings for formatting in the cardDesc

        var cardName = TitleOfEvent
        var cardDesc = TypeOfEvent + "\n" + "----------" + "\n**Maximum Capacity:**\n"+MaxCapacity+"\n**Description of event**\n" + DescriptionOfEvent + "\n **Prerequisites** " + Dependencies +"\n";
        
        //Organiser Details
        var organiser = "\n**Organiser details** \n**Organiser:** "+Name+"\n**Slack handle:** " + SlackHandle+"\n**Email:** "+Email+"\n";
      
        //support
        var support = "\n**Support Required**\n"+SupportOptions + "\n\n";
      var supportArray = SupportOptions.split(",");
        //Dates
      
       var dates = "**Date of event**\n " + date_clean_up(DateOfEvent) + "\n";

        //Times
      
        var times = "\n\n**Times**\n"+hours_with_leading_zeros(StartTime)+":"+minutes_with_leading_zeros(StartTime)+" - " + hours_with_leading_zeros(FinishTime)+":"+minutes_with_leading_zeros(FinishTime)
            
        //Add a footer to the bottom of all submissions
        var footer = "\n\n" + "**Submitted on: **" + timestamp;
        cardDesc = cardDesc +organiser+support+ dates + times + footer;
      
     

        //Build labels depending on data from the form. This will be sent in payload (below)
        var labels = []; //Other Label ObjectIDs from Trello can be added with config variables above
      

        labels.push(eventbrite)
        labels.push(socialMedia)
        if (supportArray.includes("Mentors")){
                    labels.push(mentors)

            }
        labels.push(approval)
    

        //Send POST payload data via Trello API
        //POST [/1/cards], Required permissions: write
        var payload = {
            "name": cardName,
            "desc": cardDesc,
            "pos": "bottom",
            "due": "", //(required) A date, or null
            "idList": TrelloList, //(required) id of the list that the card should be added to
            "idLabels": labels.toString(),
        };

        //Because payload is a JavaScript object, it will be interpreted as an HTML form
        var url = "https://api.trello.com/1/cards?key=" + TrelloKey + "&token=" + TrelloToken + "";
        var options = {
            "method": "post",
            "payload": payload
        };

        UrlFetchApp.fetch(url, options);

    }
}

function minutes_with_leading_zeros(dt) 
{ 
  return (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes();
}

function hours_with_leading_zeros(dt) 
{ 
  return (dt.getHours() < 10 ? '0' : '') + dt.getHours();
}

function date_clean_up(dt){
var dd = dt.getDate(); 
        var mm = dt.getMonth() + 1; 
  
        var yyyy = dt.getFullYear(); 
        if (dd < 10) { 
            dd = '0' + dd; 
        } 
        if (mm < 10) { 
            mm = '0' + mm; 
        } 
        return dd + '/' + mm + '/' + yyyy; 
}