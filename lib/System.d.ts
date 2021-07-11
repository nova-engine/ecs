import { Engine } from "./Engine";
declare abstract class System {
    private _priority;
    private readonly _engines;
    constructor();
    get priority(): number;
    get engines(): readonly Engine[];
    set priority(value: number);
    onAttach(engine: Engine): void;
    onDetach(engine: Engine): void;
    abstract update(engine: Engine, delta: number): void;
}
export { System };
