(function() {
  var app = 'persianDatepicker';
  var directive = 'datepicker';
  //noinspection JSUnresolvedFunction,JSUnresolvedVariable
  angular.module(app, [])
    .directive(directive, datepicker);

  /* @ngInject */
  function datepicker($parse, $filter) {
    return {
      restrict: 'A',
      require: 'ngModel',
      replace: true,
      link: function(scope, element, attrs, ctrl) {
        var dateText = undefined;
        var options = {
          changeMonth: true,
          changeYear: true,
          dateFormat: 'yy/mm/dd',
          isRTL: true,
          onSelect: function(dateString, calendar) {
            if(dateText) {
              dateText.assign(scope, dateString);
            }
            ctrl.$setViewValue(dateString);
          }
        };

        if(attrs.dateText) {
          dateText = $parse(attrs.dateText);
        }

        if(attrs.options) {
          var op = $parse(attrs.options);
          delete op['onSelect'];
          options = angular.merge(options, op);
        }

        var datepicker = element.datepicker(options);

        ctrl.$formatters.push(function(modelValue) {
          var dateString = $filter('jalaali')(modelValue, 'jYYYY/jMM/jDD', false);
          if(dateText) {
            dateText.assign(scope, dateString);
          }
          return dateString;
        });

        // ctrl.$render = function() {};

        ctrl.$parsers.push(function(viewValue) {
          var d = new Date();
          var date = element.datepicker('getDate').getGregorianDate();
          date.setHours(d.getHours());
          date.setMinutes(d.getMinutes());
          date.setSeconds(d.getSeconds());
          moment(date).add(d.getTimezoneOffset(), 'm');
          return date;
        });

      }
    };
  }
})();
