/// <reference path="References.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Directives;
(function (Directives) {
    var DroppableDirective = (function (_super) {
        __extends(DroppableDirective, _super);
        function DroppableDirective(scope, element, attributes) {
            var _this = this;
            _super.call(this, scope, element, attributes);
            var accept = '';
            angular.forEach(this.scope.droppableAccepts, function (item) {
                if (accept)
                    accept += ', ';
                accept += '.draggable-type-' + item;
            });
            this.element.droppable({
                accept: accept,
                activeClass: 'active',
                hoverClass: 'hover',
                drop: function (event, ui) {
                    var model = ui.helper.data(Directives.DraggableDirective.ModelDataKey);
                    ui.helper.remove();
                    _this.scope.$parent.$eval(_this.attributes[DroppableDirective.Name], { $model: model, $event: event, $ui: ui });
                }
            });
        }
        DroppableDirective.Name = 'droppable';
        return DroppableDirective;
    })(Directives.DirectiveBase);
    Directives.DroppableDirective = DroppableDirective;
    angular.module('directives').directive(DroppableDirective.Name, [
        function () {
            return {
                restrict: 'A',
                scope: {
                    droppableAccepts: '='
                },
                link: function (scope, element, attributes) { return new DroppableDirective(scope, element, attributes); }
            };
        }
    ]);
})(Directives || (Directives = {}));
//# sourceMappingURL=DroppableDirective.js.map