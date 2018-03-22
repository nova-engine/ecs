import { expect } from "chai";
import "mocha";

import { FamilyBuilder } from "./Family";
import { Engine } from "./Engine";
import { Component } from "./Component";
import { Entity } from "./Entity";

class MyComponent implements Component {}

class MyOtherComponent implements Component {}

describe("Families work", function() {
  it("Empty family returns all entities", function() {
    const engine = new Engine();
    engine.addEntities(new Entity(), new Entity());
    const builder = new FamilyBuilder(engine);
    const family = builder.build();
    expect(family.entities.length).to.be.equals(engine.entities.length);
  });
  it("Families must always have an Engine attached", function() {
    const builder = new FamilyBuilder();
    expect(() => builder.build()).to.throw();
  });
  it("Family includes the corresponding entity for inclusion", function() {
    const engine = new Engine();
    const entity = new Entity();
    entity.putComponent(MyComponent);
    entity.putComponent(MyOtherComponent);
    engine.addEntities(entity, new Entity());
    const builder = new FamilyBuilder(engine);
    builder.include(MyComponent, MyOtherComponent);
    const family = builder.build();
    expect(family.entities.indexOf(entity)).to.not.be.equals(-1);
    expect(family.entities.length).to.not.be.equals(engine.entities.length);
    expect(family.entities.length).to.not.be.equals(0);
  });
  it("Family includes the corresponding entity for exclusion", function() {
    const engine = new Engine();
    const entity = new Entity();
    entity.putComponent(MyComponent);
    engine.addEntities(entity, new Entity());
    const builder = new FamilyBuilder(engine);
    builder.exclude(MyComponent);
    const family = builder.build();
    expect(family.entities.indexOf(entity)).to.be.equals(-1);
    expect(family.entities.length).to.not.be.equals(engine.entities.length);
    expect(family.entities.length).to.not.be.equals(0);
  });
});
