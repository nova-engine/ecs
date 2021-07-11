class Entity {
    constructor() {
        this._id = null;
        this._components = {};
        this._listeners = [];
        this._componentClasses = {};
    }
    get id() {
        if (this._id === null) {
            throw new Error("Cannot retrieve an ID when is null.");
        }
        return this._id;
    }
    set id(value) {
        if (value === null || value === undefined) {
            throw new Error(`Must set a non null value when setting an entity id.`);
        }
        if (this._id !== null) {
            throw new Error(`Entity id is already set as "${this._id}".`);
        }
        this._id = value;
    }
    isNew() {
        return this._id === null;
    }
    listComponents() {
        return Object.keys(this._components).map(i => this._components[i]);
    }
    listComponentsWithTypes() {
        return Object.keys(this._components).map(i => ({
            component: this._components[i],
            type: this._componentClasses[i]
        }));
    }
    listComponentsWithTags() {
        return Object.keys(this._components).map(tag => Object.freeze({
            tag,
            component: this._components[tag]
        }));
    }
    hasComponent(componentClass) {
        const tag = componentClass.tag || componentClass.name;
        const component = this._components[tag];
        if (!component)
            return false;
        if (!this.cast(component, componentClass)) {
            throw new Error(`There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`);
        }
        return true;
    }
    getComponent(componentClass) {
        const tag = componentClass.tag || componentClass.name;
        const component = this._components[tag];
        if (!component) {
            throw new Error(`Cannot get component "${tag}" from entity.`);
        }
        if (!this.cast(component, componentClass)) {
            throw new Error(`There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`);
        }
        return component;
    }
    putComponent(componentClass) {
        const tag = componentClass.tag || componentClass.name;
        const component = this._components[tag];
        if (component) {
            if (!this.cast(component, componentClass)) {
                throw new Error(`There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`);
            }
            delete this._components[tag];
            delete this._componentClasses[tag];
        }
        const newComponent = new componentClass();
        this._components[tag] = newComponent;
        this._componentClasses[tag] = componentClass;
        for (let listener of this._listeners) {
            listener.onEntityChanged(this);
        }
        return newComponent;
    }
    removeComponent(componentClass) {
        const tag = componentClass.tag || componentClass.name;
        const component = this._components[tag];
        if (!component) {
            throw new Error(`Component of tag "${tag}".\nDoes not exists.`);
        }
        if (!this.cast(component, componentClass)) {
            throw new Error(`There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`);
        }
        delete this._components[tag];
        for (let listener of this._listeners) {
            listener.onEntityChanged(this);
        }
    }
    cast(component, componentClass) {
        return !!(component && component instanceof componentClass);
    }
    addListener(listener) {
        const index = this._listeners.indexOf(listener);
        if (index === -1) {
            this._listeners.push(listener);
        }
        return this;
    }
    removeListener(listener) {
        const index = this._listeners.indexOf(listener);
        if (index !== -1) {
            this._listeners.splice(index, 1);
        }
        return this;
    }
}
export { Entity };
//# sourceMappingURL=Entity.js.map