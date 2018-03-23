import { Engine } from "./Engine";
declare abstract class System {
    private _priority;
    private readonly _engines;
    constructor();
    priority: number;
    readonly engines: ReadonlyArray<Engine>;
    onAttach(engine: Engine): void;
    onDetach(engine: Engine): void;
    abstract update(engine: Engine, delta: number): void;
}
export { System };
