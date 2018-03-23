"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Engine = (function () {
    function Engine() {
        this._entities = [];
        this._entityListeners = [];
        this._systems = [];
        this._systemsNeedSorting = false;
    }
    Object.defineProperty(Engine.prototype, "entities", {
        get: function () {
            return Object.freeze(this._entities.slice(0));
        },
        enumerable: true,
        configurable: true
    });
    Engine.prototype.notifyPriorityChange = function (system) {
        this._systemsNeedSorting = true;
    };
    Engine.prototype.addEntityListener = function (listener) {
        if (this._entityListeners.indexOf(listener) === -1) {
            this._entityListeners.push(listener);
        }
        return this;
    };
    Engine.prototype.removeEntityListener = function (listener) {
        var index = this._entityListeners.indexOf(listener);
        if (index !== -1) {
            this._entityListeners.splice(index, 1);
        }
        return this;
    };
    Engine.prototype.addEntity = function (entity) {
        if (this._entities.indexOf(entity) === -1) {
            this._entities.push(entity);
            for (var _i = 0, _a = this._entityListeners; _i < _a.length; _i++) {
                var listener = _a[_i];
                listener.onEntityAdded(entity);
            }
        }
        return this;
    };
    Engine.prototype.addEntities = function () {
        var entities = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            entities[_i] = arguments[_i];
        }
        for (var _a = 0, entities_1 = entities; _a < entities_1.length; _a++) {
            var entity = entities_1[_a];
            this.addEntity(entity);
        }
        return this;
    };
    Engine.prototype.removeEntity = function (entity) {
        var index = this._entities.indexOf(entity);
        if (index !== -1) {
            this._entities.splice(index, 1);
            for (var _i = 0, _a = this._entityListeners; _i < _a.length; _i++) {
                var listener = _a[_i];
                listener.onEntityRemoved(entity);
            }
        }
    };
    Engine.prototype.removeEntities = function () {
        var entities = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            entities[_i] = arguments[_i];
        }
        for (var _a = 0, entities_2 = entities; _a < entities_2.length; _a++) {
            var entity = entities_2[_a];
            this.removeEntity(entity);
        }
        return this;
    };
    Engine.prototype.addSystem = function (system) {
        var index = this._systems.indexOf(system);
        if (index === -1) {
            this._systems.push(system);
            system.onAttach(this);
            this._systemsNeedSorting = true;
        }
        return this;
    };
    Engine.prototype.addSystems = function () {
        var systems = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            systems[_i] = arguments[_i];
        }
        for (var _a = 0, systems_1 = systems; _a < systems_1.length; _a++) {
            var system = systems_1[_a];
            this.addSystem(system);
        }
    };
    Engine.prototype.removeSystem = function (system) {
        var index = this._systems.indexOf(system);
        if (index !== -1) {
            this._systems.splice(index, 1);
            system.onDetach(this);
        }
        return this;
    };
    Engine.prototype.removeSystems = function () {
        var systems = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            systems[_i] = arguments[_i];
        }
        for (var _a = 0, systems_2 = systems; _a < systems_2.length; _a++) {
            var system = systems_2[_a];
            this.removeSystem(system);
        }
    };
    Engine.prototype.update = function (delta) {
        if (this._systemsNeedSorting) {
            this._systemsNeedSorting = false;
            this._systems.sort(function (a, b) { return a.priority - b.priority; });
        }
        for (var _i = 0, _a = this._systems; _i < _a.length; _i++) {
            var system = _a[_i];
            system.update(this, delta);
        }
    };
    return Engine;
}());
exports.Engine = Engine;
//# sourceMappingURL=Engine.js.map