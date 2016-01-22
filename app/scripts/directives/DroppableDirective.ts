/// <reference path="References.d.ts" />

module Directives {

    export class DroppableDirective extends DirectiveBase {

        public static Name: string = 'droppable';

        constructor(scope, element, attributes) {
            super(scope, element, attributes);

            var accept = '';
            angular.forEach(this.scope.droppableAccepts, (item: string) => {
                if(accept)
                    accept += ', ';
                accept += '.draggable-type-' + item;
            });

            this.element.droppable({
                accept: accept,
                activeClass: 'active',
                hoverClass: 'hover',
                drop: (event, ui) => {
                    var model = ui.helper.data(DraggableDirective.ModelDataKey);
                    ui.helper.remove();
                    this.scope.$parent.$eval(this.attributes[DroppableDirective.Name], { $model: model, $event: event, $ui: ui });
                }
            });
        }

    }

    angular.module('directives').directive(DroppableDirective.Name, [
        function () {
            return {
                restrict: 'A',
                scope: {
                    droppableAccepts: '='
                },
                link: (scope, element, attributes) => new DroppableDirective(scope, element, attributes)
            };
        }
    ]);
}