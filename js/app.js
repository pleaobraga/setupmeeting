var meeting = angular.module("meeting",['ngRoute','ngResource','ngAria','ngAnimate','ngMessages','ngSanitize','ngMaterial']);

//Formate date dd/mm/yyyy
meeting.config(function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function(date) {
      return moment(date).format('DD/MM/YYYY');
    };

    $mdDateLocaleProvider.parseDate = function(dateString) {
      var m = moment(dateString, 'DD/MM/YYYY', true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };
  });
