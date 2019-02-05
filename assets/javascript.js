$(function() {
    console.log('running');
  });
  
  $( document ).ready(function() {
    // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDWkBB1LI1t75lWA0zHeBkvsqjUSY83xFI",
    authDomain: "train-scheduler2-57478.firebaseapp.com",
    databaseURL: "https://train-scheduler2-57478.firebaseio.com",
    projectId: "train-scheduler2-57478",
    storageBucket: "train-scheduler2-57478.appspot.com",
    messagingSenderId: "426520418506"
  };
    firebase.initializeApp(config);
    var database = firebase.database();
  
    //initial values
    var trainName = "";
    var destination = "";
    var platform = "";
    var frequency = "";
    var lineStart = "";
  
    //submit button logic
    $("#submit-train").on("click", function(event){
      event.preventDefault();
      //populate variables
      trainName = $("#nameInput").val().trim();
      destination = $("#destinationInput").val().trim();
      platform = $("#platformInput").val().trim();
      frequency = $("#freqInput").val().trim();
      lineStart = $("#startInput").val();
  
      //push train object to database
      var newTrain = {
        name: trainName,
        destination: destination,
        platform: platform,
        frequency: frequency,
        lineStart: lineStart
      };
  
      database.ref("Trains").push(newTrain);
    });
  
    database.ref("Trains").on("child_added", function(childSnapshot) {
      trainName = (childSnapshot.val().name);
      destination = (childSnapshot.val().destination);
      platform = (childSnapshot.val().platform);
      frequency = (childSnapshot.val().frequency);
      lineStart = (childSnapshot.val().lineStart);
  
    // determine next train
    var lineConverted = moment(lineStart, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(lineConverted), "minutes");
    var tRemainder = diffTime % frequency;
    var untilNext = frequency - tRemainder;
    var nextTrain = moment().add(untilNext, "minutes");
    var nextTrainDisp = moment(nextTrain).format("hh:mm a");
  
    // clear input fields
    $("#nameInput").val('');
    $("#destinationInput").val('');
    $("#platformInput").val('');
    $("#freqInput").val('');
    $("#startInput").val('');
  
    // full list of items to the table
    $("#current-trains").append("<tr>" +
      "<td>" + (childSnapshot.val().name) + "</td>" + 
      "<td>" + (childSnapshot.val().destination) + "</td>" + 
      "<td>" + (childSnapshot.val().platform) + "</td>" +
      "<td>" + (childSnapshot.val().frequency) + "</td>" +
      "<td>" + nextTrainDisp + "</td>" + 
      "<td>" + untilNext + "</td></tr>");
  
    // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });
  
    //Hogwarts Express Time
    var meowStart = "1830/09/01 11:00";
    var meowFormat = "YYYY/MM/DD HH:mm";
    var meowConverted = moment(meowStart, meowFormat);
    var meowDiff = moment().diff(moment(meowConverted), "minutes");
    var meowRemainder = meowDiff % 525952.34;
    var mUntilNext = 525952.34 - meowRemainder;
    var nextMeowTrain = moment().add(mUntilNext, "minutes");
    var nextMeowDisp = moment(nextMeowTrain).format("hh:mm a MMM DD, YYYY");
    console.log("Next train to Meow City departs at: " + nextMeowDisp);
    $("#meowTime").html(Math.round(mUntilNext));
  })