# expangine-vue
A Vue component library for building types, populating data, and creating expressions

### Features
- Provide JSON which is used to generate a type to describe it.
- At any point, you can Alias a type.

# expangine-vue

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## Expressions

- An expression...
  - Can be the start of the condition/body/value
  - Can be valid for condition/body/value
  - Can be modified to a new expression for a condition/body/value
- Expressions can be removed and the parent expression
- Expressions that set a value are shaded a special color
- Expressions that are not a valid type are a special color
- Expression has an editor
- Expression has a text-based representation
- `ex-expression`
  - `context` = Type for the context
  - `read-only` = The expression can't be changed
  - `registry` = The registry with type and expression information
  - `required-type` = Type given where the type of the expression has to be compatible with the required type
  - `show-complexity` = Color expression based on complexity
  - `mutates` = If the expression mutates 
  - `can-remove` = If the expression can be removed
  - `@remove` = When the expression has been removed
  - `value` = The expression
  - `@input` = Event when expression or sub-expression changes
- `ex-expression-starter`
  - `type` = condition/body/value
- Operation has a text-based representation
- Operation has an editor