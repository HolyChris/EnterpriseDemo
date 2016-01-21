/// <reference path="References.d.ts" />

module Directives {

    export class DirectiveBase {
        public scope: any;
        public element: any;
        public attributes: any;

        constructor(scope: any, element: any, attributes: any) {
            this.scope = scope;
            this.element = element;
            this.attributes = attributes;

            this.scope['vm'] = this;
        }
    }

}