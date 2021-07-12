/* eslint-disable */
import "reflect-metadata";

const PRIMED_PROPERTIES_META = Symbol("PRIMED_PROPERTIES_META");
const CLASS_NAME_MAPPING = Symbol("CLASS_NAME_MAPPING");
const CLASS_NAME = Symbol("CLASS_NAME");

export type Constructor<T = any> = { new (...args: any[]): T };
export type Factory = Function | Constructor | string;
export type Indexable = { [key: string]: any };

//https://github.com/krzkaczor/ts-essentials
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>;
};

export type BaseConstructorPayload<T, U = undefined> = DeepPartial<
  U extends undefined ? T : T | U
>;

export interface PropertiesMeta {
  [key: string]: {
    factory: Factory;
    options: PropertyOptions;
  };
}

export interface ClassNameMapping {
  [key: string]: Constructor;
}

export class PropertyOptions {
  required?: boolean = true;
  array?: boolean = false;
}

export function Model(constructor: Constructor): void;
export function Model(name: string): (constructor: Constructor) => void;
export function Model<T extends Constructor>(constructorOrName: string | T) {
  const classNameMappingMetadata =
    Reflect.getMetadata(CLASS_NAME_MAPPING, Base.constructor) || {};

  if (typeof constructorOrName === "string") {
    return (constructor: T) => {
      const _class = class extends constructor {
        constructor(...args: any[]) {
          super();
          this.init(args[0], args[1]);
        }
      };

      classNameMappingMetadata[constructorOrName] = _class;
      Reflect.defineMetadata(
        CLASS_NAME_MAPPING,
        classNameMappingMetadata,
        Base.constructor
      );
      Reflect.defineMetadata(CLASS_NAME, constructorOrName, constructor);
      return _class;
    };
  } else {
    const _class = class extends constructorOrName {
      constructor(...args: any[]) {
        super();
        this.init(args[0], args[1]);
      }
    };

    classNameMappingMetadata[constructorOrName.name] = _class;
    Reflect.defineMetadata(
      CLASS_NAME_MAPPING,
      classNameMappingMetadata,
      Base.constructor
    );
    Reflect.defineMetadata(
      CLASS_NAME,
      constructorOrName.name,
      constructorOrName
    );
    return _class;
  }
}

export function Primed(
  factory: Factory,
  propertyOptions: PropertyOptions = {}
) {
  return (instance: any, propertyKey: string | symbol) => {
    const options = Object.assign(new PropertyOptions(), propertyOptions);
    const metadata =
      Reflect.getMetadata(PRIMED_PROPERTIES_META, instance) || {};
    metadata[propertyKey] = { factory, options };
    Reflect.defineMetadata(PRIMED_PROPERTIES_META, metadata, instance);
  };
}

export class Base<T, U = undefined> {
  // Method purely for typing purposes
  constructor(payload?: BaseConstructorPayload<T, U>) {}

  private init(
    payload: Indexable = {},
    trace: Set<Constructor | string> = new Set()
  ) {
    this.makeEnumerableGetters(this);
    const primedProperties: PropertiesMeta =
      Reflect.getMetadata(PRIMED_PROPERTIES_META, this) || {};
    const updatedTrace = new Set(trace).add(
      trace.size ? (this.constructor as Constructor) : "STUB"
    );
    const notPrimed = Object.keys(payload).reduce(
      (acc, key) => (key in primedProperties ? acc : [...acc, key]),
      [] as string[]
    );

    for (const key of notPrimed) {
      const desc = Object.getOwnPropertyDescriptor(this, key);
      if (
        this.hasOwnProperty(key) &&
        (!desc || desc.writable === true || typeof desc.set === "function")
      ) {
        (this as Indexable)[key] = payload[key];
      }
    }

    for (const key in primedProperties) {
      let { factory, options } = primedProperties[key];
      const classNameMappingMedatada: ClassNameMapping = Reflect.getMetadata(
        CLASS_NAME_MAPPING,
        Base.constructor
      );
      const factoryIsString = typeof factory === "string";
      const factoryExtendsBase =
        !factoryIsString && (factory as Constructor).prototype instanceof Base;
      if (factoryIsString || factoryExtendsBase) {
        const factoryName = factoryIsString
          ? factory
          : Reflect.getMetadata(CLASS_NAME, factory);
        factory = classNameMappingMedatada[factoryName];
        if (!factory) {
          throw Error(`Class ${factoryName} was never added`);
        }
      }

      const value = payload[key];
      if (options.array && payload && payload[key] && !Array.isArray(value)) {
        throw Error(`Array expected for field ${key}`);
      } else if (!options.array && value && Array.isArray(value)) {
        throw Error(`Array not expected for field ${key}`);
      }

      if (value !== undefined && value !== null) {
        const values: any = Array.isArray(value) ? value : [value];
        let instances: any[] = [];
        if ((factory as Constructor).prototype instanceof Base) {
          instances = values.map((val: any) =>
            Reflect.construct(factory as Constructor, [val, updatedTrace])
          );
        } else {
          const getArgs = (value: any) => (value !== undefined ? [value] : []);
          instances = values.map((val: any) =>
            (factory as Function)(...getArgs(val))
          );
        }
        (this as Indexable)[key] = options.array ? instances : instances.pop();
      } else if (options.required) {
        let instance;
        if ((factory as Constructor).prototype instanceof Base) {
          const isCyclic = updatedTrace.has(factory as Constructor);
          if (isCyclic) {
            (this as Indexable)[key] = undefined;
            continue;
          }
          instance = Reflect.construct(factory as Constructor, [
            undefined,
            updatedTrace,
          ]);
        } else {
          instance = (factory as Function)();
        }
        (this as Indexable)[key] = options.array ? [instance] : instance;
      } else if (options.array) {
        (this as Indexable)[key] = [];
      } else {
        (this as Indexable)[key] = null;
      }
    }

    return this;
  }

  private makeEnumerableGetters(instance: any) {
    for (
      let o = instance;
      o != Object.prototype;
      o = Object.getPrototypeOf(o)
    ) {
      for (let name of Object.getOwnPropertyNames(o)) {
        const desc = Object.getOwnPropertyDescriptor(o, name) || {};
        const hasGetter = typeof desc.get === "function";
        if (hasGetter) {
          desc.enumerable = true;
          Object.defineProperty(instance, name, desc);
        }
      }
    }
  }

  clone(): T {
    return Reflect.construct(this.constructor, [this]);
  }
}
