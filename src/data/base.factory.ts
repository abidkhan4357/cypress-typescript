import { faker } from '@faker-js/faker';

export abstract class BaseFactory<T> {
  protected abstract createDefault(): T;
  
  create(overrides?: Partial<T>): T {
    const defaultData = this.createDefault();
    return { ...defaultData, ...overrides };
  }

  createMany(count: number, overrides?: Partial<T>): T[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  createWithVariations(variations: Partial<T>[]): T[] {
    return variations.map(variation => this.create(variation));
  }

  protected getRandomFromArray<U>(array: U[]): U {
    return faker.helpers.arrayElement(array);
  }

  protected getRandomNumber(min: number, max: number): number {
    return faker.number.int({ min, max });
  }

  protected getRandomBoolean(): boolean {
    return faker.datatype.boolean();
  }

  protected getRandomDate(from?: Date, to?: Date): Date {
    return faker.date.between({
      from: from || new Date('1950-01-01'),
      to: to || new Date()
    });
  }

  protected getUniqueId(): string {
    return faker.string.uuid();
  }

  protected getTimestamp(): number {
    return Date.now();
  }
}

export interface FactoryOptions {
  locale?: string;
  seed?: number;
}

export class FactoryBuilder<T> {
  private factory: BaseFactory<T>;
  private overrides: Partial<T> = {};

  constructor(factory: BaseFactory<T>) {
    this.factory = factory;
  }

  with<K extends keyof T>(key: K, value: T[K]): FactoryBuilder<T> {
    this.overrides[key] = value;
    return this;
  }

  withMany<K extends keyof T>(data: Partial<Pick<T, K>>): FactoryBuilder<T> {
    Object.assign(this.overrides, data);
    return this;
  }

  build(): T {
    return this.factory.create(this.overrides);
  }

  buildMany(count: number): T[] {
    return this.factory.createMany(count, this.overrides);
  }
}