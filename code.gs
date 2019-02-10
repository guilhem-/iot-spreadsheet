// INSPIRED BY: Akshaya Niraula // AT: http://www.embedded-lab.com/..... http://embedded-lab.com/blog/post-data-google-sheets-using-esp8266/
//addition : can dynamically support new tags (add new columns on the fly)
 
// Steps are valid as of 2016 November 12th.
// 0) From Google spreadsheet, Tools &gt; Scriipt Editor...
// 1) Write your code
// 2) Save and give a meaningful name
// 3) Run and make sure "doGet" is selected
//    You can set a method from Run menu
// 4) When you run for the first time, it will ask 
//    for the permission. You must allow it.
//    Make sure everything is working as it should.
// 5) From Publish menu &gt; Deploy as Web App...
//    Select a new version everytime it's published
//    Type comments next to the version
//    Execute as: "Me (your email address)"
//    MUST: Select "Anyone, even anonymous" on "Who has access to this script"
//    For the first time it will give you some prompt(s), accept it.
//    You will need the given information (url) later. This doesn't change, ever!
 
// Saving the published URL helps for later.
// https://script.google.com/macros/s/---Your-Script-ID--Goes-Here---/exec?code=yourCode&valueX=5&valueY=5

// This method will be called first or hits first  
function doGet(e){
  Logger.log("--- doGet ---");
 
 var tag = "",
     value = "";
 
  try {
 
    // this helps during debuggin
    if (e == null){e={}; e.parameters = {code:"cko", tag:"test",value:"-1"};}
 
    code = e.parameters.code;
 
if (code != "yourCode") return ContentService.createTextOutput("Wrote:\n incorrect password !");
    delete e.parameters.code;                                     
                                        
    // save the data to spreadsheet
    save_data(e.parameters);
 
    return ContentService.createTextOutput("Wrote:\n   " + JSON.stringify(e.parameters) + "\n ");
 
  } catch(error) { 
    Logger.log(error);    
    return ContentService.createTextOutput("Ooops...." + error.message 
                                            + "\n" + new Date() 
                                            + "\nParams: " + JSON.stringify(e.parameters));
  }  
}
 
// Method to save given data to a sheet
function save_data(assoc){
  Logger.log("--- save_data ---"); 
 
  try {
    var dateTime = new Date();
 
    // Paste the URL of the Google Sheets starting from https thru /edit
    // For e.g.: https://docs.google.com/..../edit 
    var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Z1zi6RZ5MKmf20VnDkYECsZGFY4L0bM8YYKNsvYW7zc/edit");
    var summarySheet = ss.getSheetByName("Summary");
    var dataLoggerSheet = ss.getSheetByName("DataLogger");
 
    var col = dataLoggerSheet.getLastColumn() + 1;
    // Get last edited row from DataLogger sheet
    var row = dataLoggerSheet.getLastRow() + 1;
 
    var header = dataLoggerSheet.getRange(1, 3, 1, col-3); //A1 to O1
    var headerVals = header.getValues()[0];

    dataLoggerSheet.getRange("A" + row).setValue(row -1); // ID
    dataLoggerSheet.getRange("B" + row).setValue(dateTime); // dateTime

    var colval;
    for (colval in assoc)
    {
      var iCol=headerVals.indexOf(colval);
      if (iCol>=0)
      {
        dataLoggerSheet.getRange(row, iCol+3).setValue(assoc[colval]); // ID
      }
      else
      {
        iCol=col;
        col=col+1; 
        headerVals.push(colval);
        dataLoggerSheet.getRange(1, iCol).setValue(colval); // ID        
        dataLoggerSheet.getRange(row, iCol).setValue(assoc[colval]); // value        
      }
    }
        
    // Update summary sheet
    summarySheet.getRange("B1").setValue(dateTime); // Last modified date
    // summarySheet.getRange("B2").setValue(row - 1); // Count 
  }
 
  catch(error) {
    Logger.log(JSON.stringify(error));
  }
 
  Logger.log("--- save_data end---"); 
}
