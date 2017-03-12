//using the google service to get the timezone from some city
meeting.factory('timeZoneService', ['$resource', function($resource)
{
  return $resource('https://maps.googleapis.com/maps/api/timezone/json?location=:lat,:lng&timestamp=:time&key=AIzaSyAPbTIwcRFCxFIALB4ayDB96lEA6wpJK-U',
  {lat: '@lat', lng: '@lng', time: '@time'},
  {
    getTimeZone : {method: 'get'}
  });

}]);
