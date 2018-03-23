"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var System = (function () {
    function System() {
        this._priority = 0;
        this._engines = [];
    }
    Object.defineProperty(System.prototype, "priority", {
        get: function () {
            return this._priority;
        },
        set: function (value) {
            this._priority = value;
            for (var _i = 0, _a = this._engines; _i < _a.length; _i++) {
                var engine = _a[_i];
                engine.notifyPriorityChange(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(System.prototype, "engines", {
        get: function () {
            return Object.freeze(this._engines.slice(0));
        },
        enumerable: true,
        configurable: true
    });
    System.prototype.onAttach = function (engine) {
        var index = this._engines.indexOf(engine);
        if (index === -1) {
            this._engines.push(engine);
        }
    };
    System.prototype.onDetach = function (engine) {
        var index = this._engines.indexOf(engine);
        if (index !== -1) {
            this._engines.splice(index, 1);
        }
    };
    return System;
}());
exports.System = System;
//# sourceMappingURL=System.js.map