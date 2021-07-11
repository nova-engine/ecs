import { ComponentClass, Component } from "./Component";
interface EntityChangeListener {
    onEntityChanged(entity: Entity): void;
}
declare class Entity {
    private _id;
    private readonly _components;
    private readonly _listeners;
    private readonly _componentClasses;
    get id(): string | number;
    set id(value: string | number);
    isNew(): boolean;
    listComponents(): Component[];
    listComponentsWithTypes(): {
        component: Component;
        type: ComponentClass<Component>;
    }[];
    listComponentsWithTags(): Readonly<{
        tag: string;
        component: Component;
    }>[];
    hasComponent<T extends Component>(componentClass: ComponentClass<T>): boolean;
    getComponent<T extends Component>(componentClass: ComponentClass<T>): T;
    putComponent<T extends Component>(componentClass: ComponentClass<T>): T;
    removeComponent<T extends Component>(componentClass: ComponentClass<T>): void;
    cast<T extends Component>(component: Component | undefined | null, componentClass: ComponentClass<T>): component is T;
    addListener(listener: EntityChangeListener): this;
    removeListener(listener: EntityChangeListener): this;
}
export { Entity, EntityChangeListener };
