/// <reference path="References.d.ts" />
module Directives {

    export class LoadingBarDirective extends DirectiveBase {

        public static Name: string = 'loadingBar';
        public indicator: any;

        constructor(scope, element, attributes) {
            super(scope, element, attributes);
            this.indicator = this.element.find('.loading-bar-indicator');

            this.scope.$watch('loading', (newValue, oldValue) => {
                if(newValue)
                    this.start();
                else if(oldValue)
                    this.stop();
            });
        }

        public start() {
            this.indicator.stop(true).animate({ width: '60%' }, Math.floor(Math.random() * 1500) + 1000, 'easeOutExpo', () => {
                this.indicator.stop(true).animate({ width: '80%' }, Math.floor(Math.random() * 2000) + 2500, 'easeInSine', () => {
                    this.indicator.stop(true).animate({ width: '95%' }, Math.floor(Math.random() * 5000) + 8000, 'easeOutCirc');
                });
            });
        }

        public stop() {
            this.indicator.stop(true).animate({ width: '100%' }, Math.floor(Math.random() * 200) + 400, 'easeOutCirc', () => {
                this.indicator.delay(500).animate({ opacity: 0 }, Math.floor(Math.random() * 200) + 400, 'easeOutCirc');
            });
        }

    }

    angular.module('directives').directive(LoadingBarDirective.Name, [
        function () {
            return {
                restrict: 'E',
                scope: {
                    loading: '='
                },
                templateUrl: '/views/directives/LoadingBarDirective.html',
                link: (scope, element, attributes) => new LoadingBarDirective(scope, element, attributes)
            };
        }
    ]);
}