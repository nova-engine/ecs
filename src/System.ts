import { Engine } from "./Engine";

abstract class System {
  private _priority: number;
  private readonly _engines: Engine[];

  constructor() {
    this._priority = 0;
    this._engines = [];
  }

  get priority(): number {
    return this._priority;
  }

  set priority(value: number) {
    this._priority = value;
    for (const engine of this._engines) {
      engine.notifyPriorityChange(this);
    }
  }

  get engines(): readonly Engine[] {
    return Object.freeze(this._engines.slice(0));
  }

  onAttach(engine: Engine): void {
    const index = this._engines.indexOf(engine);
    if (index === -1) {
      this._engines.push(engine);
    }
  }

  onDetach(engine: Engine): void {
    const index = this._engines.indexOf(engine);
    if (index !== -1) {
      this._engines.splice(index, 1);
    }
  }

  abstract update(engine: Engine, delta: number): void;
}

export { System };
