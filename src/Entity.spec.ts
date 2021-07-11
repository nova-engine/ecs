import { Component } from "./Component";

import { Entity } from "./Entity";

class MyComponent implements Component {}

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
