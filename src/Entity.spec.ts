import { expect } from "chai";
import "mocha";

import { Component } from "./Component";

import { Entity } from "./Entity";

class MyComponent implements Component {}

class MyBadTagComponent implements Component {
  static readonly tag = "MyComponent";
}

describe("Entities work", function() {
  it("Can only set id once", function() {
    const entity = new Entity();
    expect(() => entity.id).to.throw();
    expect(() => (entity.id = "testing id")).to.not.throw();
    expect(() => (entity.id = "other id")).to.throw();
    expect(entity.id).to.not.be.equals("other id");
  });
  it("Can retrieve id when set for the first time", function() {
    const entity = new Entity();
    expect(() => entity.id).to.throw();
    expect(() => (entity.id = "testing id")).to.not.throw();
    expect(() => entity.id).to.not.throw();
    expect(entity.id).to.be.equals("testing id");
  });
  it("Can add a component.", function() {
    const entity = new Entity();
    expect(entity.putComponent(MyComponent)).to.be.instanceof(MyComponent);
    expect(() => entity.hasComponent(MyComponent)).to.not.throw();
  });
  it("Throw error when bad class tags override component types.", function() {
    const entity = new Entity();
    expect(entity.putComponent(MyComponent)).to.be.instanceof(MyComponent);
    expect(() => entity.putComponent(MyBadTagComponent)).to.throw();
  });
  it("Remove a component.", function() {
    const entity = new Entity();
    expect(entity.putComponent(MyComponent)).to.be.instanceof(MyComponent);
    expect(() => entity.removeComponent(MyComponent)).to.not.throw();
  });
  it("Throw an error when a bad class tag tries to remove a component.", function() {
    const entity = new Entity();
    expect(entity.putComponent(MyComponent)).to.be.instanceof(MyComponent);
    expect(() => entity.removeComponent(MyBadTagComponent)).to.throw();
  });
  it("Throw an error when getting a non added component", function() {
    const entity = new Entity();
    expect(() => entity.getComponent(MyComponent)).to.throw();
  });
  it("Throw an error when removing a non added component", function() {
    const entity = new Entity();
    expect(() => entity.removeComponent(MyComponent)).to.throw();
  });
});
