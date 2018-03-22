import { Entity } from "./Entity";
import { System } from "./System";

interface EngineEntityListener {
  onEntityAdded(entity: Entity): void;
  onEntityRemoved(entity: Entity): void;
}

/**
 * An engine is the class than combines systems and entities.
 * You may have one Engine in your application, but you can make as many as
 * you want.
 */
class Engine {
  /** Private array containing the current list of added entities. */
  private _entities: Entity[] = [];
  /** Private list of entity listeners */
  private readonly _entityListeners: EngineEntityListener[] = [];
  /** Private list of added systems. */
  private readonly _systems: System[] = [];
  /** Checks if the system needs sorting of some sort */
  private _systemsNeedSorting: boolean = false;
  /**
   * Computes an immutable list of entities added to the engine.
   */
  get entities() {
    return Object.freeze(this._entities.slice(0));
  }
  /**
   * Alerts the engine to sort systems by priority.
   * @param system The system than changed priority
   */
  notifyPriorityChange(system: System) {
    this._systemsNeedSorting = true;
  }

  /**
   * Adds a listener for when entities are added or removed.
   * @param listener The listener waiting to add
   */
  addEntityListener(listener: EngineEntityListener) {
    if (this._entityListeners.indexOf(listener) === -1) {
      this._entityListeners.push(listener);
    }
    return this;
  }

  /**
   * Removes a listener from the entity listener list.
   * @param listener The listener to remove
   */
  removeEntityListener(listener: EngineEntityListener) {
    const index = this._entityListeners.indexOf(listener);
    if (index !== -1) {
      this._entityListeners.splice(index, 1);
    }
    return this;
  }

  /**
   * Add an entity to the engine.
   * The listeners will be notified.
   * @param entity The entity to add
   */
  addEntity(entity: Entity) {
    if (this._entities.indexOf(entity) === -1) {
      this._entities.push(entity);
      for (let listener of this._entityListeners) {
        listener.onEntityAdded(entity);
      }
    }
    return this;
  }

  /**
   * Add a list of entities to the engine.
   * The listeners will be notified once per entity.
   * @param entities The list of entities to add
   */
  addEntities(...entities: Entity[]) {
    for (let entity of entities) {
      this.addEntity(entity);
    }
    return this;
  }

  /**
   * Removes an entity to the engine.
   * The listeners will be notified.
   * @param entity The entity to remove
   */
  removeEntity(entity: Entity) {
    const index = this._entities.indexOf(entity);
    if (index !== -1) {
      this._entities.splice(index, 1);
      for (let listener of this._entityListeners) {
        listener.onEntityRemoved(entity);
      }
    }
  }

  /**
   * Removes a list of entities to the engine.
   * The listeners will be notified once per entity.
   * @param entities The list of entities to remove
   */
  removeEntities(...entities: Entity[]) {
    for (let entity of entities) {
      this.removeEntity(entity);
    }
    return this;
  }

  /**
   * Adds a system to the engine.
   * @param system The system to add.
   */
  addSystem(system: System) {
    const index = this._systems.indexOf(system);
    if (index === -1) {
      this._systems.push(system);
      system.onAttach(this);
      this._systemsNeedSorting = true;
    }
    return this;
  }

  /**
   * Adds a list of systems to the engine.
   * @param systems The list of systems to add.
   */
  addSystems(...systems: System[]) {
    for (let system of systems) {
      this.addSystem(system);
    }
  }

  /**
   * Removes a system to the engine.
   * @param system The system to remove.
   */
  removeSystem(system: System) {
    const index = this._systems.indexOf(system);
    if (index !== -1) {
      this._systems.splice(index, 1);
      system.onDetach(this);
    }
    return this;
  }

  /**
   * Removes a list of systems to the engine.
   * @param systems The list of systems to remove.
   */
  removeSystems(...systems: System[]) {
    for (let system of systems) {
      this.removeSystem(system);
    }
  }

  /**
   * Updates all systems added to the engine.
   * @param delta Time elapsed (in milliseconds) since the last update.
   */
  update(delta: number) {
    if (this._systemsNeedSorting) {
      this._systemsNeedSorting = false;
      this._systems.sort((a, b) => a.priority - b.priority);
    }
    for (let system of this._systems) {
      system.update(this, delta);
    }
  }
}

export { Engine, EngineEntityListener };
