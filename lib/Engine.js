class Engine {
    constructor() {
        this._entities = [];
        this._entityListeners = [];
        this._systems = [];
        this._systemsNeedSorting = false;
    }
    get entities() {
        return Object.freeze(this._entities.slice(0));
    }
    notifyPriorityChange(system) {
        this._systemsNeedSorting = true;
    }
    addEntityListener(listener) {
        if (this._entityListeners.indexOf(listener) === -1) {
            this._entityListeners.push(listener);
        }
        return this;
    }
    removeEntityListener(listener) {
        const index = this._entityListeners.indexOf(listener);
        if (index !== -1) {
            this._entityListeners.splice(index, 1);
        }
        return this;
    }
    addEntity(entity) {
        if (this._entities.indexOf(entity) === -1) {
            this._entities.push(entity);
            for (let listener of this._entityListeners) {
                listener.onEntityAdded(entity);
            }
        }
        return this;
    }
    addEntities(...entities) {
        for (let entity of entities) {
            this.addEntity(entity);
        }
        return this;
    }
    removeEntity(entity) {
        const index = this._entities.indexOf(entity);
        if (index !== -1) {
            this._entities.splice(index, 1);
            for (let listener of this._entityListeners) {
                listener.onEntityRemoved(entity);
            }
        }
    }
    removeEntities(...entities) {
        for (let entity of entities) {
            this.removeEntity(entity);
        }
        return this;
    }
    addSystem(system) {
        const index = this._systems.indexOf(system);
        if (index === -1) {
            this._systems.push(system);
            system.onAttach(this);
            this._systemsNeedSorting = true;
        }
        return this;
    }
    addSystems(...systems) {
        for (let system of systems) {
            this.addSystem(system);
        }
    }
    removeSystem(system) {
        const index = this._systems.indexOf(system);
        if (index !== -1) {
            this._systems.splice(index, 1);
            system.onDetach(this);
        }
        return this;
    }
    removeSystems(...systems) {
        for (let system of systems) {
            this.removeSystem(system);
        }
    }
    update(delta) {
        if (this._systemsNeedSorting) {
            this._systemsNeedSorting = false;
            this._systems.sort((a, b) => a.priority - b.priority);
        }
        for (let system of this._systems) {
            system.update(this, delta);
        }
    }
}
export { Engine };
//# sourceMappingURL=Engine.js.map