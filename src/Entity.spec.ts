import { Base, Model } from "Reflect";
import { Component } from "./Component";

import { Entity } from "./Entity";

@Model
class MyComponent extends Base<MyComponent> {
  static readonly tag = "MyComponent";

  val1 = "";
  val2 = "";
}

class MyBadTagComponent implements Component {
  static readonly tag = "MyComponent";
}

describe("Entities work", function () {
  it("Can only set id once", function () {
    const entity = new Entity();
    expect(() => entity.id).toThrow();
    expect(() => {
      entity.id = "testing id";
    }).not.toThrow();

    expect(() => (entity.id = "other id")).toThrow();
    expect(entity.id).not.toEqual("other id");
  });
  it("Can retrieve id when set for the first time", function () {
    const entity = new Entity();
    expect(() => entity.id).toThrow();
    expect(() => (entity.id = "testing id")).not.toThrow();
    expect(() => entity.id).not.toThrow();
    expect(entity.id).toEqual("testing id");
  });
  it("Can add a component.", function () {
    const entity = new Entity();
    expect(entity.putComponent(MyComponent)).toBeInstanceOf(MyComponent);
    expect(() => entity.hasComponent(MyComponent)).not.toThrow();
  });
  it("Can add a component with multiple arguments.", function () {
    const entity = new Entity();
    entity.putComponent(MyComponent, { val1: "Value1", val2: "Value2" });
    expect(entity.getComponent(MyComponent)).toBeDefined();
    expect(entity.getComponent(MyComponent).val1).toBe("Value1");
    expect(entity.getComponent(MyComponent).val2).toBe("Value2");
  });
  it("Can create Entity from JSON structure", () => {
    const entity = new Entity({
      components: {
        MyComponent: <MyComponent>{
          val1: "Value1",
          val2: "Value2",
        },
        classes: { MyComponent },
      },
    });

    expect(entity.getComponent(MyComponent)).toBeDefined();
    expect(entity.getComponent(MyComponent).val1).toBe("Value1");
    expect(entity.getComponent(MyComponent).val2).toBe("Value2");
  });
  it("Throw error when bad class tags override component types.", function () {
    const entity = new Entity();
    expect(entity.putComponent(MyComponent)).toBeInstanceOf(MyComponent);
    expect(() => entity.putComponent(MyBadTagComponent)).toThrow();
  });
  it("Remove a component.", function () {
    const entity = new Entity();
    expect(entity.putComponent(MyComponent)).toBeInstanceOf(MyComponent);
    expect(() => entity.removeComponent(MyComponent)).not.toThrow();
  });
  it("Throw an error when a bad class tag tries to remove a component.", function () {
    const entity = new Entity();
    expect(entity.putComponent(MyComponent)).toBeInstanceOf(MyComponent);
    expect(() => entity.removeComponent(MyBadTagComponent)).toThrow();
  });
  it("Throw an error when getting a non added component", function () {
    const entity = new Entity();
    expect(() => entity.getComponent(MyComponent)).toThrow();
  });
  it("Throw an error when removing a non added component", function () {
    const entity = new Entity();
    expect(() => entity.removeComponent(MyComponent)).toThrow();
  });
});
