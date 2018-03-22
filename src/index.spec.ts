import { expect } from "chai";
import "mocha";

import * as lib from "./index";

import { Engine } from "./Engine";
import { Entity } from "./Entity";
import { FamilyBuilder } from "./Family";
import { System } from "./System";

describe("Modules are exported", function() {
  it("Engine is exported", function() {
    expect(lib.Engine).to.equal(Engine);
    expect(lib.Engine).to.not.be.null;
    expect(lib.Engine).to.not.be.undefined;
  });
  it("Entity is exported", function() {
    expect(lib.Entity).to.equal(Entity);
    expect(lib.Entity).to.not.be.null;
    expect(lib.Entity).to.not.be.undefined;
  });
  it("FamilyBuilder is exported", function() {
    expect(lib.FamilyBuilder).to.equal(FamilyBuilder);
    expect(lib.FamilyBuilder).to.not.be.null;
    expect(lib.FamilyBuilder).to.not.be.undefined;
  });
  it("System is exported", function() {
    expect(lib.System).to.equal(System);
    expect(lib.System).to.not.be.null;
    expect(lib.System).to.not.be.undefined;
  });
});
