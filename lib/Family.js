"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractFamily = (function () {
    function AbstractFamily(engine, include, exclude) {
        var _this = this;
        this.includesEntity = function (entity) {
            for (var _i = 0, _a = _this._include; _i < _a.length; _i++) {
                var include = _a[_i];
                if (!entity.hasComponent(include)) {
                    return false;
                }
            }
            for (var _b = 0, _c = _this._exclude; _b < _c.length; _b++) {
                var exclude = _c[_b];
                if (entity.hasComponent(exclude)) {
                    return false;
                }
            }
            return true;
        };
        this._engine = engine;
        this._include = Object.freeze(include.slice(0));
        this._exclude = Object.freeze(exclude.slice(0));
    }
    Object.defineProperty(AbstractFamily.prototype, "engine", {
        get: function () {
            return this._engine;
        },
        enumerable: true,
        configurable: true
    });
    return AbstractFamily;
}());
var CachedFamily = (function (_super) {
    __extends(CachedFamily, _super);
    function CachedFamily(engine, include, exclude) {
        var _this = _super.call(this, engine, include, exclude) || this;
        _this.onEntityChanged = function (entity) {
            var index = _this._entities.indexOf(entity);
            if (index === -1) {
                _this._entities.push(entity);
                entity.addListener(_this.onEntityChanged.bind(_this));
            }
            _this._needEntityRefresh = true;
        };
        var allEntities = _this.engine.entities;
        _this._entities = allEntities.filter(_this.includesEntity);
        _this.engine.addEntityListener(_this);
        for (var _i = 0, allEntities_1 = allEntities; _i < allEntities_1.length; _i++) {
            var entity = allEntities_1[_i];
            entity.addListener(_this.onEntityAdded);
        }
        _this._needEntityRefresh = false;
        return _this;
    }
    Object.defineProperty(CachedFamily.prototype, "entities", {
        get: function () {
            if (this._needEntityRefresh) {
                this._needEntityRefresh = false;
                this._entities = this._entities.filter(this.includesEntity);
            }
            return Object.freeze(this._entities.slice(0));
        },
        enumerable: true,
        configurable: true
    });
    CachedFamily.prototype.onEntityAdded = function (entity) {
        var index = this._entities.indexOf(entity);
        if (index === -1) {
            this._entities.push(entity);
            this._needEntityRefresh = true;
            entity.addListener(this.onEntityChanged);
        }
    };
    CachedFamily.prototype.onEntityRemoved = function (entity) {
        var index = this._entities.indexOf(entity);
        if (index !== -1) {
            var entity_1 = this._entities[index];
            this._entities.splice(index, 1);
            entity_1.removeListener(this.onEntityChanged);
        }
    };
    return CachedFamily;
}(AbstractFamily));
var NonCachedFamily = (function (_super) {
    __extends(NonCachedFamily, _super);
    function NonCachedFamily() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(NonCachedFamily.prototype, "entities", {
        get: function () {
            return this.engine.entities.filter(this.includesEntity);
        },
        enumerable: true,
        configurable: true
    });
    return NonCachedFamily;
}(AbstractFamily));
var FamilyBuilder = (function () {
    function FamilyBuilder(engine) {
        this._engine = engine || null;
        this._include = [];
        this._exclude = [];
        this._cached = true;
    }
    FamilyBuilder.prototype.include = function () {
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        (_a = this._include).push.apply(_a, classes);
        return this;
        var _a;
    };
    FamilyBuilder.prototype.exclude = function () {
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        (_a = this._exclude).push.apply(_a, classes);
        return this;
        var _a;
    };
    FamilyBuilder.prototype.changeEngine = function (engine) {
        this._engine = engine;
        return this;
    };
    FamilyBuilder.prototype.setCached = function (cached) {
        this._cached = cached;
    };
    FamilyBuilder.prototype.build = function () {
        if (!this._engine) {
            throw new Error("Family should always belong to an engine.");
        }
        if (!this._cached) {
            return new NonCachedFamily(this._engine, this._include, this._exclude);
        }
        return new CachedFamily(this._engine, this._include, this._exclude);
    };
    return FamilyBuilder;
}());
exports.FamilyBuilder = FamilyBuilder;
//# sourceMappingURL=Family.js.map