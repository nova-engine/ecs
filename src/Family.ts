import { Component, ComponentClass } from "./Component";
import { Engine, EngineEntityListener } from "./Engine";
import { Entity } from "./Entity";

/**
 * A family is a criteria to separate your entities.
 * You can have families on wich entities must have a component,
 * entities cannot have some components or a mix of both.
 * Families also cache the entities of the engine by default,
 * so you won't have to worry about filtering entities every time.
 */
interface Family {
  /**
   * Computes a list of entities on the family.
   * The list may or may not be cached, depending of implementation.
   */
  readonly entities: ReadonlyArray<Entity>;
  includesEntity(entity: Entity): boolean;
}

/**
 * An abstract family is the base implementation of a family interface.
 * This class is private to this module.
 * @private
 */
abstract class AbstractFamily implements Family {
  private readonly _engine: Engine;
  private readonly _include: ReadonlyArray<ComponentClass<Component>>;
  private readonly _exclude: ReadonlyArray<ComponentClass<Component>>;

  constructor(
    engine: Engine,
    include: ComponentClass<Component>[],
    exclude: ComponentClass<Component>[]
  ) {
    this._engine = engine;
    this._include = Object.freeze(include.slice(0));
    this._exclude = Object.freeze(exclude.slice(0));
  }

  get engine() {
    return this._engine;
  }

  abstract readonly entities: ReadonlyArray<Entity>;

  includesEntity = (entity: Entity) => {
    for (let include of this._include) {
      if (!entity.hasComponent(include)) {
        return false;
      }
    }
    for (let exclude of this._exclude) {
      if (entity.hasComponent(exclude)) {
        return false;
      }
    }
    return true;
  };
}

/**
 * A CachedFamily is a family than caches it's results and alters it only
 * when an entity changes.
 *
 */
class CachedFamily extends AbstractFamily {
  private _needEntityRefresh: boolean;
  private _entities: Entity[];

  constructor(
    engine: Engine,
    include: ComponentClass<Component>[],
    exclude: ComponentClass<Component>[]
  ) {
    super(engine, include, exclude);
    const allEntities = this.engine.entities;
    this._entities = allEntities.filter(this.includesEntity);
    this.engine.addEntityListener(this);
    for (let entity of allEntities) {
      entity.addListener(this.onEntityAdded);
    }
    this._needEntityRefresh = false;
  }

  get entities() {
    if (this._needEntityRefresh) {
      this._needEntityRefresh = false;
      this._entities = this._entities.filter(this.includesEntity);
    }
    return Object.freeze(this._entities.slice(0));
  }

  onEntityAdded(entity: Entity) {
    const index = this._entities.indexOf(entity);
    if (index === -1) {
      this._entities.push(entity);
      this._needEntityRefresh = true;
      entity.addListener(this.onEntityChanged);
    }
  }

  onEntityRemoved(entity: Entity) {
    const index = this._entities.indexOf(entity);
    if (index !== -1) {
      const entity = this._entities[index];
      this._entities.splice(index, 1);
      entity.removeListener(this.onEntityChanged);
    }
  }

  onEntityChanged = (entity: Entity) => {
    const index = this._entities.indexOf(entity);
    if (index === -1) {
      this._entities.push(entity);
      entity.addListener(this.onEntityChanged);
    }
    this._needEntityRefresh = true;
  };
}

/**
 * A NonCacheFamily always computes the members of it.
 * If you find than the performance from cached families is not decent.
 * You can use this instead.
 * @private
 */
class NonCachedFamily extends AbstractFamily {
  get entities() {
    return this.engine.entities.filter(this.includesEntity);
  }
}

/**
 * Utility class to build Families.
 * It's the only way to create the implementations of CachedFamily and NonCachedFamily.
 */
class FamilyBuilder {
  private _engine: Engine | null;
  private _cached: boolean;
  private readonly _include: ComponentClass<Component>[];
  private readonly _exclude: ComponentClass<Component>[];

  constructor(engine?: Engine) {
    this._engine = engine || null;
    this._include = [];
    this._exclude = [];
    this._cached = true;
  }

  /**
   * Indicates than entities than are members of this class MUST
   * HAVE this components.
   * @param classes A list of component classes.
   */
  include(...classes: ComponentClass<Component>[]) {
    this._include.push(...classes);
    return this;
  }
  /**
   * Indicates than entities than are members of this class MUST NOT
   * HAVE this components.
   * @param classes A list of component classes.
   */
  exclude(...classes: ComponentClass<Component>[]) {
    this._exclude.push(...classes);
    return this;
  }

  /**
   * Changes the engine of the builder.
   * Useful to create multiple instances of the same family for different
   * engines.
   * @param engine
   */
  changeEngine(engine: Engine) {
    this._engine = engine;
    return this;
  }

  /**
   * Changes if the family should use cached values or not.
   * @param cached If the family must use or not a cache.
   */
  setCached(cached: boolean) {
    this._cached = cached;
  }

  /**
   * Builds the family, using the information provided.
   * @returns a new family to retrieve the entities.
   */
  build(): Family {
    if (!this._engine) {
      throw new Error("Family should always belong to an engine.");
    }
    if (!this._cached) {
      return new NonCachedFamily(this._engine, this._include, this._exclude);
    }
    return new CachedFamily(this._engine, this._include, this._exclude);
  }
}

export { Family, FamilyBuilder };
