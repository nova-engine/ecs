import * as lib from "./index";

import { Engine } from "./Engine";
import { Entity } from "./Entity";
import { FamilyBuilder } from "./Family";
import { System } from "./System";

describe("Modules are exported", function () {
  it("Engine is exported", function () {
    expect(lib.Engine).toEqual(Engine);
    expect(lib.Engine).not.toBeNull();
    expect(lib.Engine).not.toBeUndefined();
  });
  it("Entity is exported", function () {
    expect(lib.Entity).toEqual(Entity);
    expect(lib.Entity).not.toBeNull();
    expect(lib.Entity).not.toBeUndefined();
  });
  it("FamilyBuilder is exported", function () {
    expect(lib.FamilyBuilder).toEqual(FamilyBuilder);
    expect(lib.FamilyBuilder).not.toBeNull();
    expect(lib.FamilyBuilder).not.toBeUndefined();
  });
  it("System is exported", function () {
    expect(lib.System).toEqual(System);
    expect(lib.System).not.toBeNull();
    expect(lib.System).not.toBeUndefined();
  });
});
