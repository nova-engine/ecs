interface Component {}

interface ComponentClass<T extends Component> {
  readonly name: string;
  readonly tag?: string;
  new (): T;
}

export { Component, ComponentClass };
