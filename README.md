# expangine-vue
A Vue component library for building types, populating data, and creating expressions


### Visuals

Type Visuals
- Type
- Name
- Description
- Editor Component
  - **v-model** prop
  - **read-only** prop
- Input Visuals
  - Name
  - Description
  - Settings Component
    - **v-model** prop is for settings object
    - **type** is type reference
  - Input Component
    - **v-model** prop is value
    - **settings** is data generated from Settings Component
    - **type** is type reference
    
```
interface Visuals {
  types: {
    [id: string]: {
      name: string;
      description: string;
      editor: VueComponent;
      inputs: {
        [id: string]: {
          name: string;
          description: string;
          settings: VueComponent;
          input: VueComponent;
        }
      }
    }
  }
  expressions: {
    [id: string]: {
      name: string;
      description: string;
      editor: VueComponent;
    }
  }
}

// 
```

### Features
- Provide JSON which is used to generate a type to describe it.
- At any point, you can Alias a type.
- Every type can be required or optional, automatically \[un]wrap it with OptionalType.
- Every type can have "alternative types" which wraps the type with ManyType. When there's one left, it's automatically downgraded.
