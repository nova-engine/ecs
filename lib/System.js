class System {
    constructor() {
        this._priority = 0;
        this._engines = [];
    }
    get priority() {
        return this._priority;
    }
    get engines() {
        return Object.freeze(this._engines.slice(0));
    }
    set priority(value) {
        this._priority = value;
        for (let engine of this._engines) {
            engine.notifyPriorityChange(this);
        }
    }
    onAttach(engine) {
        const index = this._engines.indexOf(engine);
        if (index === -1) {
            this._engines.push(engine);
        }
    }
    onDetach(engine) {
        const index = this._engines.indexOf(engine);
        if (index !== -1) {
            this._engines.splice(index, 1);
        }
    }
}
export { System };
//# sourceMappingURL=System.js.map