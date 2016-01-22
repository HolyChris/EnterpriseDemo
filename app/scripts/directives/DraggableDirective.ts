/// <reference path="References.d.ts" />

module Directives {

    export class DraggableDirective extends DirectiveBase {

        public static Name: string = 'draggable';
        public static ModelDataKey: string = 'draggable-model';

        constructor(scope, element, attributes) {
            super(scope, element, attributes);

            this.element.addClass('draggable-type-' + this.scope.draggableType).draggable({
                revert: 'invalid',
                revertDuration: 200,
                zIndex: 20,
                helper: () => {
                    var helper = this.element.clone();
                    helper.addClass('helper')
                        .width(this.element.width())
                        .data(DraggableDirective.ModelDataKey, this.scope.draggable);
                    return helper;
                },
                start: () => {
                    this.element.addClass('active');
                },
                stop: () => {
                    this.element.removeClass('active');
                }
            });
        }

    }

    angular.module('directives').directive(DraggableDirective.Name, [
        function () {
            return {
                restrict: 'A',
                scope: {
                    draggable: '=',
                    draggableType: '='
                },
                link: (scope, element, attributes) => new DraggableDirective(scope, element, attributes)
            };
        }
    ]);
}