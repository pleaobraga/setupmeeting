meeting.controller("meetingCtrl", ['$scope', 'timeZoneService', '$mdMedia', '$rootScope', function($scope, timeZoneService, $mdMedia, $rootScope){

  //inject $mdMedia in view
  $rootScope.$mdMedia = $mdMedia;

  //define teh date as today
  $scope.dateMeeting = new Date();

  //initialize the array cities
  $scope.cities = [{name: '', lat: '', lng: '', timeZone: ''},{name: '', lat: '', lng: '', timeZone: ''}];


  //select the iputs to add autocomplete by google api
  var input = document.getElementById('yourCity');
  var input2 = document.getElementById('theirCity')

  //insert into inputs google api autocomplete
  var autocomplete1 = new google.maps.places.Autocomplete(input, { types: ['(cities)']});
  var autocomplete2 = new google.maps.places.Autocomplete(input2, { types: ['(cities)']});

  //pickin up the informations by yourCity
  google.maps.event.addListener(autocomplete1, 'place_changed', function ()
  {
    var place =  autocomplete1.getPlace()
     $scope.cities[0].lat = place.geometry.location.lat();
     $scope.cities[0].lng = place.geometry.location.lng();
     $scope.cities[0].name = place.formatted_address;
     $scope.getTimeZone($scope.cities[0]);
  });

  //pickin up the informations by theirCity
  google.maps.event.addListener(autocomplete2, 'place_changed', function ()
  {
    var place =  autocomplete2.getPlace()
     $scope.cities[1].lat = place.geometry.location.lat();
     $scope.cities[1].lng = place.geometry.location.lng();
     $scope.cities[1].name = place.formatted_address;
     $scope.getTimeZone($scope.cities[1]);
  });

  //this function is acted when the two timezones were setted up and the calculations begin
  $scope.$watch('cities',
    function()
    {
      if($scope.cities[0].timeZone != '' &&  $scope.cities[1].timeZone != '')
      {
        //create a new variable to not subscribe the $scope.cities
        $scope.citiesSorted = angular.copy($scope.cities);

        //sort the vector by timezone
        $scope.citiesSorted.sort(function(a,b){return a.timeZone-b.timeZone});

        //verify if the diferences between timezones is into the comercial hour
        if($scope.citiesSorted[1].timeZone - $scope.citiesSorted[0].timeZone <= 8)
        {
          //set the hour as 9:00 AM to smaller timezone
          $scope.citiesSorted[0].hour = '9:00 AM';

          //verify if the bigger timezone is positive and smaller is negative
          if($scope.citiesSorted[1].timeZone > 0 && $scope.citiesSorted[0].timeZone < 0)
          {
              //set the bigest timezone as  9h + diferences between the timezones ajusting -1 hour in that case
              $scope.citiesSorted[1].hour = 9 + $scope.citiesSorted[1].timeZone - $scope.citiesSorted[0].timeZone - 1;
          }
          else
          {
            //set the bigest timezone as  9h + diferences between the timezones
            $scope.citiesSorted[1].hour = 9 + $scope.citiesSorted[1].timeZone - $scope.citiesSorted[0].timeZone;
          }

          //ajust the formate date if it was bigger than 11h
          if($scope.citiesSorted[1].hour > 12)
          {
            $scope.citiesSorted[1].hour = ($scope.citiesSorted[1].hour - 12) + ':00 PM';

          }
          //add the formate date
          else if($scope.citiesSorted[1].hour == 12)
          {
            $scope.citiesSorted[1].hour += ':00 PM'

          }
          else
          {
            $scope.citiesSorted[1].hour += ':00 AM';

          }
          //show the answer
          $scope.meeting = true;

          return;
        }
        //show the message error
        $scope.meeting  = 'timeExceeded';
      }
    },  true);

  // this function return the diferece between a city time to utc time
  $scope.getTimeZone = function(city)
  {

    //getting the date informations
    var year =  $scope.dateMeeting.getFullYear();
    var day = $scope.dateMeeting.getDate();
    var month =  $scope.dateMeeting.getMonth() + 1;

    //create a date with hour like 9:00
    var time = Math.floor(new Date(year,month,day,9,0).getTime()/1000);

    //get the timezone
    timeZoneService.getTimeZone({lat:city.lat, lng: city.lng, time: time},
    function(response)
    {
      //convert the answer to seconds
      city.timeZone = (response.dstOffset + response.rawOffset)/3600;

      console.log(response);

    },
    function(response)
    {
      city.timeZone = '';

      console.log(response);

    });
  };
}]);
