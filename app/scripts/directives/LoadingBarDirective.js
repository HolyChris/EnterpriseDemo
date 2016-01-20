(function() {

    /* Sites service class */
    (function (angular, jQuery) {

        /* Constructor */
        function LoadingBarDirective(scope, element, attributes) {
            this.scope = scope;
            this.element = element;
            this.attributes = attributes;
            this.indicator = this.element.find('.loading-bar-indicator');
            var _this = this;

            this.scope.$watch('loading', function (loading) {
                if(loading)
                    _this.start();
                else
                    _this.stop();
            });
        }

        LoadingBarDirective.prototype.start = function() {
            var _this = this;
            this.indicator.stop(true).animate({ width: '60%' }, Math.floor(Math.random() * 1500) + 1000, 'easeOutExpo', function() {
                _this.indicator.stop(true).animate({ width: '80%' }, Math.floor(Math.random() * 2000) + 2500, 'easeInSine', function() {
                    _this.indicator.stop(true).animate({ width: '95%' }, Math.floor(Math.random() * 5000) + 8000, 'easeOutCirc');
                    });
            });
        };

        LoadingBarDirective.prototype.stop = function() {
            var _this = this;
            this.indicator.stop(true).animate({ width: '100%' }, Math.floor(Math.random() * 200) + 400, 'easeOutCirc', function() {
                _this.indicator.delay(500).animate({ opacity: 0 }, Math.floor(Math.random() * 200) + 400, 'easeOutCirc');
            });
        };

        angular.module('directives').directive('loadingBar', [
            function () {
                return {
                    scope: {
                        loading: '='
                    },
                    templateUrl: '/views/directives/LoadingBarDirective.html',
                    link: function(scope, element, attributes) {
                        var handler = new LoadingBarDirective(scope, element, attributes);
                    }
                };
            }
        ]);

    })(angular, jQuery);

})();