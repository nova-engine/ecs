import { ComponentClass, Component } from "./Component";

type EntityChangeListener = (entity: Entity) => any;

/**
 * An Entity is every object you may have on your system.
 * A character, a weapon, an skill, a map.
 * Everything is an Entity.
 * Entities are bag of Components, and Components describe how the data exists on
 * the entities.
 * Entities have an id field that can only be set once and
 * will throw when you try to get one when no id is set.
 * This set can be used to persist the entity on a database.
 */
class Entity {
  private _id: string | number | null = null;
  private readonly _components: { [tag: string]: Component } = {};
  private readonly _listeners: EntityChangeListener[] = [];
  private readonly _componentClasses: {
    [tag: string]: ComponentClass<Component>;
  } = {};

  /**
   * Gets the id of the entity.
   * @throws when the id is null.
   */
  get id(): string | number {
    if (this._id === null) {
      throw new Error("Cannot retrieve an ID when is null.");
    }
    return this._id;
  }

  /**
   * Sets the id of the entity to a new value.
   * @throws when the new value is null or undefined or the id is already set.
   */
  set id(value: string | number) {
    if (value === null || value === undefined) {
      throw new Error(`Must set a non null value when setting an entity id.`);
    }
    if (this._id !== null) {
      throw new Error(`Entity id is already set as "${this._id}".`);
    }
    this._id = value;
  }

  /**
   * Checks if the entity is newly created.
   * An entity is considered new when the id is null.
   */
  isNew() {
    return this._id === null;
  }

  /**
   * Generates a read only list of components of the entity.
   * @returns a list of all components of the entity.
   */
  listComponents() {
    return Object.keys(this._components).map(i => this._components[i]);
  }

  /**
   * Generates a read only list of components of the entity
   * with it's corresponding types.
   * @returns a list of all components with types of the entity.
   */

  listComponentsWithTypes() {
    return Object.keys(this._components).map(i => ({
      component: this._components[i],
      type: this._componentClasses[i]
    }));
  }

  /**
   * Generates a read only list of components of the entity with it's corresponding tags.
   * @returns a list of all components with tags of the entity.
   */
  listComponentsWithTags() {
    return Object.keys(this._components).map(tag =>
      Object.freeze({
        tag,
        component: this._components[tag]
      })
    );
  }

  /**
   * Checks if the entity has a component of the specified class.
   * @throws if the class than exists on the entity with that tag is different than the asked one.
   * @param componentClass The class of the component.
   */
  hasComponent<T extends Component>(componentClass: ComponentClass<T>) {
    const tag = componentClass.tag || componentClass.name;
    const component = this._components[tag];
    if (!component) return false;
    if (!this.cast(component, componentClass)) {
      throw new Error(
        `There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`
      );
    }
    return true;
  }

  /**
   * Returns the component of the specified class.
   * @throws if the class than exists on the entity with that tag is different than the asked one.
   * @throws if the component is not on the entity.
   * @param componentClass The class of the component.
   */
  getComponent<T extends Component>(componentClass: ComponentClass<T>): T {
    const tag = componentClass.tag || componentClass.name;
    const component = this._components[tag];
    if (!component) {
      throw new Error(`Cannot get component "${tag}" from entity.`);
    }
    if (!this.cast(component, componentClass)) {
      throw new Error(
        `There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`
      );
    }
    return component;
  }

  /**
   * Creates a component of the specified class and adds it to the entity.
   * @throws if the class than exists on the entity with that tag is different than the asked one.
   * @param componentClass The class of the component.
   * @returns The newly created component.
   */
  putComponent<T extends Component>(componentClass: ComponentClass<T>): T {
    const tag = componentClass.tag || componentClass.name;
    const component = this._components[tag];
    if (component) {
      if (!this.cast(component, componentClass)) {
        throw new Error(
          `There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`
        );
      }
      delete this._components[tag];
      delete this._componentClasses[tag];
    }
    const newComponent = new componentClass();
    this._components[tag] = newComponent;
    this._componentClasses[tag] = componentClass;
    for (let listener of this._listeners) {
      listener(this);
    }
    return newComponent;
  }

  /**
   * Removes a component from the entity.
   * @throws If the component of that class don't exists on the entity.
   * @throws if the class than exists on the entity with that tag is different than the asked one.
   * @param componentClass The class of the component.
   */
  removeComponent<T extends Component>(componentClass: ComponentClass<T>) {
    const tag = componentClass.tag || componentClass.name;
    const component = this._components[tag];
    if (!component) {
      throw new Error(`Component of tag "${tag}".\nDoes not exists.`);
    }
    if (!this.cast(component, componentClass)) {
      throw new Error(
        `There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`
      );
    }
    delete this._components[tag];
    for (let listener of this._listeners) {
      listener(this);
    }
  }

  /**
   * Checks if the component is an instance of the class
   * @param component The component to check
   * @param componentClass The class to cast into
   */
  cast<T extends Component>(
    component: Component | undefined | null,
    componentClass: ComponentClass<T>
  ): component is T {
    return !!(component && component instanceof componentClass);
  }

  /**
   * Adds a listener to the entity when components are added or removed.
   * @param listener The listener to add
   */
  addListener(listener: EntityChangeListener) {
    const index = this._listeners.indexOf(listener);
    if (index === -1) {
      this._listeners.push(listener);
    }
    return this;
  }

  /**
   * Removes a listener from the entity.
   * @param listener The listener to remove.
   */
  removeListener(listener: EntityChangeListener) {
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
    return this;
  }
}

export { Entity, EntityChangeListener };
