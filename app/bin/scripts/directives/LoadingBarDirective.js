var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="References.d.ts" />
var Directives;
(function (Directives) {
    var LoadingBarDirective = (function (_super) {
        __extends(LoadingBarDirective, _super);
        function LoadingBarDirective(scope, element, attributes) {
            var _this = this;
            _super.call(this, scope, element, attributes);
            this.indicator = this.element.find('.loading-bar-indicator');
            this.scope.$watch('loading', function (newValue, oldValue) {
                if (newValue)
                    _this.start();
                else if (oldValue)
                    _this.stop();
            });
        }
        LoadingBarDirective.prototype.start = function () {
            var _this = this;
            this.indicator.stop(true).css({ opacity: 1, width: '0%' }).animate({ width: '60%' }, Math.floor(Math.random() * 1500) + 1000, 'easeOutExpo', function () {
                _this.indicator.stop(true).animate({ width: '80%' }, Math.floor(Math.random() * 2000) + 2500, 'easeInSine', function () {
                    _this.indicator.stop(true).animate({ width: '95%' }, Math.floor(Math.random() * 5000) + 8000, 'easeOutCirc');
                });
            });
        };
        LoadingBarDirective.prototype.stop = function () {
            var _this = this;
            this.indicator.stop(true).animate({ width: '100%' }, Math.floor(Math.random() * 200) + 400, 'easeOutCirc', function () {
                _this.indicator.delay(500).animate({ opacity: 0 }, Math.floor(Math.random() * 200) + 400, 'easeOutCirc');
            });
        };
        LoadingBarDirective.Name = 'loadingBar';
        return LoadingBarDirective;
    })(Directives.DirectiveBase);
    Directives.LoadingBarDirective = LoadingBarDirective;
    angular.module('directives').directive(LoadingBarDirective.Name, [
        function () {
            return {
                restrict: 'E',
                scope: {
                    loading: '='
                },
                templateUrl: '/views/directives/LoadingBarDirective.html',
                link: function (scope, element, attributes) { return new LoadingBarDirective(scope, element, attributes); }
            };
        }
    ]);
})(Directives || (Directives = {}));
//# sourceMappingURL=LoadingBarDirective.js.map