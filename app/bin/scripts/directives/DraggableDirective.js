/// <reference path="References.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Directives;
(function (Directives) {
    var DraggableDirective = (function (_super) {
        __extends(DraggableDirective, _super);
        function DraggableDirective(scope, element, attributes) {
            var _this = this;
            _super.call(this, scope, element, attributes);
            this.element.addClass('draggable-type-' + this.scope.draggableType).draggable({
                revert: 'invalid',
                revertDuration: 200,
                zIndex: 20,
                helper: function () {
                    var helper = _this.element.clone();
                    helper.addClass('helper')
                        .width(_this.element.width())
                        .data(DraggableDirective.ModelDataKey, _this.scope.draggable);
                    return helper;
                },
                start: function () {
                    _this.element.addClass('active');
                },
                stop: function () {
                    _this.element.removeClass('active');
                }
            });
        }
        DraggableDirective.Name = 'draggable';
        DraggableDirective.ModelDataKey = 'draggable-model';
        return DraggableDirective;
    })(Directives.DirectiveBase);
    Directives.DraggableDirective = DraggableDirective;
    angular.module('directives').directive(DraggableDirective.Name, [
        function () {
            return {
                restrict: 'A',
                scope: {
                    draggable: '=',
                    draggableType: '='
                },
                link: function (scope, element, attributes) { return new DraggableDirective(scope, element, attributes); }
            };
        }
    ]);
})(Directives || (Directives = {}));
//# sourceMappingURL=DraggableDirective.js.map