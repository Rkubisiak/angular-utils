# GenerateClassMock

With this library you can use 
`generateClassMock` method to generate ES6 class mock.

This function returns new class with same attributes as the original one and
 all methods replaced with () => {}.

## Usage

`generateClassMock` takes 2 parameters:
- first, a class which needs to be mocked
- second, options cfg object

## Cfg object

Cfg object can have any of the following attributes:
- `prototypes` If there is a need for a method to be anything else than () => {}
 you can provide it as following:
  ````
  {
    prototypes: {
      methodName: () => 5 (or other value)
    }
  }
  ````
 
- `attributes` If there is a need for a attribute to have custom value,
 you can provide it as following:
  ````
  {
    attributes: {
      attributeName: 5 (or other value)
    }
  }
  ````
  
- `replaceOriginalPrototype` Due to internal mechanisms of `generateClassMock` function
 in case there is a logic in constructor that uses constructor attributes there is a need
 to move all that logic to separate function and add its name to cfg 
 `replaceOriginalPrototype` array.
  ````
  {
    replaceOriginalPrototype: ['fnName']
  }
  ````
  
## replaceOriginalPrototype - usage example
  Instead of:
  ````
  class ClassToMock {
    constructor(private attr1) {
      this.attr1.someFn();
    }
  }
  ````
  
  
  Do:
  ````
  class ClassToMock {
    constructor(private attr1) {
      this.constructorLogic();
    }
    
    private constructorLogic() {
      this.attr1.someFn();
    }
  }
  ````
  
  and mock it with cfg:
  ````
  {
    replaceOriginalPrototype: ['constructorLogic']
  }
  ````
