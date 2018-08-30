/* tslint:disable:no-invalid-this */
/* tslint:disable:no-implicit-dependencies */
import { findIndex, forEach, forOwn, get } from 'lodash';

export interface IDictionary<T> {
  [index: string]: T;
}

export interface IConstructable {
  new(...args: any[]): any;
}

export interface IGenerateClassMockOptions {
  prototypes?: IDictionary<any>;
  attributes?: IDictionary<any>;
  replaceOriginalPrototype?: IDictionary<any>;
}

export const generateClassMock = <T extends IConstructable>(a: T, manualToSet: IGenerateClassMockOptions = {}): T => {
  const manualPrototypes: IDictionary<any> = get(manualToSet, 'prototypes', {});
  const manualAttributes: IDictionary<any> = get(manualToSet, 'attributes', {});
  const manualPrototypesOriginal: IDictionary<any> = get(manualToSet, 'replaceOriginalPrototype', []);
  const manualPrototypesOriginalBackups: IDictionary<any> = {};

  forEach(manualPrototypesOriginal, (prototypeKey: string) => {
    manualPrototypesOriginalBackups[prototypeKey] = a.prototype[prototypeKey];
    a.prototype[prototypeKey] = () => {};
  });

  const instance = new a();
  const mock: any = function() {
    const instancePropertyNames: string[] = Object.getOwnPropertyNames(instance);

    instancePropertyNames
      .forEach((prop: string) => {
        this[prop] = get(manualAttributes, prop, instance[prop]);
      });

    forOwn(manualAttributes, (attrValue: any, attrKey: string) => {
      if(findIndex(instancePropertyNames, attrKey) === -1) {
        this[attrKey] = attrValue;
      }
    });
  };

  Object.getOwnPropertyNames(a.prototype)
    .filter((prop: string) => prop !== 'constructor')
    .forEach((prop: string) => {
      mock.prototype[prop] = get(manualPrototypes, prop, () => {});
    });

  Object.getOwnPropertyNames(a)
    .filter((prop: string) => prop !== 'prototype' && Object.getOwnPropertyDescriptor(a, prop).writable)
    .forEach((prop: string) => {
      mock[prop] = get(manualAttributes, prop, a[prop]);
    });

  forEach(manualPrototypesOriginal, (prototypeKey: string) => {
    a.prototype[prototypeKey] = manualPrototypesOriginalBackups[prototypeKey];
  });

  return mock;
};
