import { expect } from "chai";
import "mocha";

import { System } from "./System";
import { Engine } from "./Engine";
import { Family, FamilyBuilder } from "./Family";

class MySystem extends System {
  public family: Family | null = null;

  onAttach(engine: Engine) {
    super.onAttach(engine);
    this.family = new FamilyBuilder(engine).build();
  }

  onDetach(engine: Engine) {
    super.onDetach(engine);
    this.family = null;
  }

  update(engine: Engine, delta: number) {}
}

describe("Systems works", function() {
  it("Can be extended", function() {
    expect(new MySystem()).to.be.instanceof(System);
    expect(new MySystem()).to.be.instanceof(MySystem);
  });
  it("Attached systems should call the onAttach method", () => {
    const engine = new Engine();
    const system = new MySystem();
    engine.addSystem(system);
    expect(system.family).to.not.be.equals(null);
  });
  it("Detached systems should call the onDetach method", () => {
    const engine = new Engine();
    const system = new MySystem();
    engine.addSystem(system);
    engine.removeSystem(system);
    expect(system.family).to.be.equals(null);
  });
});
