"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Entity = (function () {
    function Entity() {
        this._id = null;
        this._components = {};
        this._listeners = [];
        this._componentClasses = {};
    }
    Object.defineProperty(Entity.prototype, "id", {
        get: function () {
            if (this._id === null) {
                throw new Error("Cannot retrieve an ID when is null.");
            }
            return this._id;
        },
        set: function (value) {
            if (value === null || value === undefined) {
                throw new Error("Must set a non null value when setting an entity id.");
            }
            if (this._id !== null) {
                throw new Error("Entity id is already set as \"" + this._id + "\".");
            }
            this._id = value;
        },
        enumerable: true,
        configurable: true
    });
    Entity.prototype.isNew = function () {
        return this._id === null;
    };
    Entity.prototype.listComponents = function () {
        var _this = this;
        return Object.keys(this._components).map(function (i) { return _this._components[i]; });
    };
    Entity.prototype.listComponentsWithTypes = function () {
        var _this = this;
        return Object.keys(this._components).map(function (i) { return ({
            component: _this._components[i],
            type: _this._componentClasses[i]
        }); });
    };
    Entity.prototype.listComponentsWithTags = function () {
        var _this = this;
        return Object.keys(this._components).map(function (tag) {
            return Object.freeze({
                tag: tag,
                component: _this._components[tag]
            });
        });
    };
    Entity.prototype.hasComponent = function (componentClass) {
        var tag = componentClass.tag || componentClass.name;
        var component = this._components[tag];
        if (!component)
            return false;
        if (!this.cast(component, componentClass)) {
            throw new Error("There are multiple classes with the same tag or name \"" + tag + "\".\nAdd a different property \"tag\" to one of them.");
        }
        return true;
    };
    Entity.prototype.getComponent = function (componentClass) {
        var tag = componentClass.tag || componentClass.name;
        var component = this._components[tag];
        if (!component) {
            throw new Error("Cannot get component \"" + tag + "\" from entity.");
        }
        if (!this.cast(component, componentClass)) {
            throw new Error("There are multiple classes with the same tag or name \"" + tag + "\".\nAdd a different property \"tag\" to one of them.");
        }
        return component;
    };
    Entity.prototype.putComponent = function (componentClass) {
        var tag = componentClass.tag || componentClass.name;
        var component = this._components[tag];
        if (component) {
            if (!this.cast(component, componentClass)) {
                throw new Error("There are multiple classes with the same tag or name \"" + tag + "\".\nAdd a different property \"tag\" to one of them.");
            }
            delete this._components[tag];
            delete this._componentClasses[tag];
        }
        var newComponent = new componentClass();
        this._components[tag] = newComponent;
        this._componentClasses[tag] = componentClass;
        for (var _i = 0, _a = this._listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener(this);
        }
        return newComponent;
    };
    Entity.prototype.removeComponent = function (componentClass) {
        var tag = componentClass.tag || componentClass.name;
        var component = this._components[tag];
        if (!component) {
            throw new Error("Component of tag \"" + tag + "\".\nDoes not exists.");
        }
        if (!this.cast(component, componentClass)) {
            throw new Error("There are multiple classes with the same tag or name \"" + tag + "\".\nAdd a different property \"tag\" to one of them.");
        }
        delete this._components[tag];
        for (var _i = 0, _a = this._listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener(this);
        }
    };
    Entity.prototype.cast = function (component, componentClass) {
        return !!(component && component instanceof componentClass);
    };
    Entity.prototype.addListener = function (listener) {
        var index = this._listeners.indexOf(listener);
        if (index === -1) {
            this._listeners.push(listener);
        }
        return this;
    };
    Entity.prototype.removeListener = function (listener) {
        var index = this._listeners.indexOf(listener);
        if (index !== -1) {
            this._listeners.splice(index, 1);
        }
        return this;
    };
    return Entity;
}());
exports.Entity = Entity;
//# sourceMappingURL=Entity.js.map