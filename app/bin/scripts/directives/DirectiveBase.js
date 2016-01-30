/// <reference path="References.d.ts" />
var Directives;
(function (Directives) {
    var DirectiveBase = (function () {
        function DirectiveBase(scope, element, attributes) {
            this.scope = scope;
            this.element = element;
            this.attributes = attributes;
            this.scope['vm'] = this;
        }
        return DirectiveBase;
    })();
    Directives.DirectiveBase = DirectiveBase;
})(Directives || (Directives = {}));
//# sourceMappingURL=DirectiveBase.js.map