import { Component, ComponentClass } from "./Component";
import { Engine } from "./Engine";
import { Entity } from "./Entity";
interface Family {
    readonly entities: ReadonlyArray<Entity>;
    includesEntity(entity: Entity): boolean;
}
declare class FamilyBuilder {
    private _engine;
    private _cached;
    private readonly _include;
    private readonly _exclude;
    constructor(engine?: Engine);
    include(...classes: ComponentClass<Component>[]): this;
    exclude(...classes: ComponentClass<Component>[]): this;
    changeEngine(engine: Engine): this;
    setCached(cached: boolean): void;
    build(): Family;
}
export { Family, FamilyBuilder };
