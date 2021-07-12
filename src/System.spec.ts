import { System } from "./System";
import { Engine } from "./Engine";
import { Signature, SignatureBuilder } from "./Signature";

class MySystem extends System {
  public signature: Signature | null = null;

  onAttach(engine: Engine) {
    super.onAttach(engine);
    this.signature = new SignatureBuilder(engine).build();
  }

  onDetach(engine: Engine) {
    super.onDetach(engine);
    this.signature = null;
  }

  update(_engine: Engine, _delta: number) {}
}

describe("Systems works", function () {
  it("Can be extended", function () {
    expect(new MySystem()).toBeInstanceOf(System);
    expect(new MySystem()).toBeInstanceOf(MySystem);
  });
  it("Attached systems should call the onAttach method", () => {
    const engine = new Engine();
    const system = new MySystem();
    engine.addSystem(system);
    expect(system.signature).not.toEqual(null);
  });
  it("Detached systems should call the onDetach method", () => {
    const engine = new Engine();
    const system = new MySystem();
    engine.addSystem(system);
    engine.removeSystem(system);
    expect(system.signature).toEqual(null);
  });
});
