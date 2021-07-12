import { SignatureBuilder } from "./Signature";
import { Engine } from "./Engine";
import { Component } from "./Component";
import { Entity } from "./Entity";

class MyComponent implements Component {}

class MyOtherComponent implements Component {}
describe("Signatures work", function () {
  it("Empty signature returns all entities", function () {
    const engine = new Engine();
    engine.addEntities(new Entity(), new Entity());
    const builder = new SignatureBuilder(engine);
    const signature = builder.build();
    expect(signature.entities.length).toEqual(engine.entities.length);
  });
  it("Signatures must always have an Engine attached", function () {
    const builder = new SignatureBuilder();
    expect(() => builder.build()).toThrow();
  });
  it("Signature includes the corresponding entity for inclusion", function () {
    const engine = new Engine();
    const entity = new Entity();
    entity.putComponent(MyComponent);
    entity.putComponent(MyOtherComponent);
    engine.addEntities(entity, new Entity());
    const builder = new SignatureBuilder(engine);
    builder.include(MyComponent, MyOtherComponent);
    const signature = builder.build();
    expect(signature.entities.indexOf(entity)).not.toEqual(-1);
    expect(signature.entities.length).not.toEqual(engine.entities.length);
    expect(signature.entities.length).not.toEqual(0);
  });
  it("Signature includes the corresponding entity for exclusion", function () {
    const engine = new Engine();
    const entity = new Entity();
    entity.putComponent(MyComponent);
    engine.addEntities(entity, new Entity());
    const builder = new SignatureBuilder(engine);
    builder.exclude(MyComponent);
    const signature = builder.build();
    expect(signature.entities.indexOf(entity)).toEqual(-1);
    expect(signature.entities.length).not.toEqual(engine.entities.length);
    expect(signature.entities.length).not.toEqual(0);
  });
});
