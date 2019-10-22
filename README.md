# expangine-vue
A Vue & Vuetify component library for expangine, a visual programming framework. 

You can test out the sandbox [here](https://expangine.github.io/expangine-vue/#/), where you can define the structure of your program input, populate the program input, and develop the program. If you would like to download an example program [here's FizzBuzz](https://expangine.github.io/expangine-vue/examples/FizzBuzz.json). Import it via `File` > `Import`.

## expangine

Expangine is a visual programming framework that allows you to create programs. You design the structure of your data, some test data to work on, and finally a program which processes that data. Expangine is **fully** customizable, so you can add your own data types and operations.

The predefined expangine types:
- `Any` (user can select which type & value they want)
- `Boolean` (true / false)
- `Color` (RGBA)
- `Date`
- `Enum` (has label-value pairs for the user to select from)
- `Function` (has definition (input type), and implementation)
- `List` (ie array)
- `Many` (can be one of many defined types, user chooses which type & value)
- `Map` (key-value pairs)
- `Null`
- `Number`
- `Object` (with defined set of property names & types)
- `Optional` (an optional subtype)
- `Text`
- `Tuple` (an array of fixed size where each element can have it's own type)

[Future Types](https://github.com/expangine/expangine-runtime/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+Complex+Type)

### What can I do with this?

This project is a sandbox to show you what comes with expangine currently. You could use the system to create your own Game maker, CMS, or API management console. For example, if you want to create game maker you would need to:

1. Create new types: Point, Game, Scene, Sprite, Particles, etc
2. Create new operations: Distance between points, create sprite instance, rotate sprite, emit particles, goto scene, etc.
3. Create visuals: Something that allows you to define your game, all the possible scenes, all sprite templates, etc.
4. Program: What happens on your custom events? When the game starts, is paused, when a sprite is clicked on, when a sprite intersects with another, etc.

Once you get to step 3, you now have a tool that can create a game. Step 4 is actually giving your game it's appearance and behavior. What is generated is simple JSON, but could be compiled right down to code that doesn't even require expangine as a dependency.


### Adding your own Type
1. Implement `Type` ([example](https://github.com/expangine/expangine-runtime/blob/master/src/types/Number.ts#L23))
2. Define `operations`  for your type ([example](https://github.com/expangine/expangine-runtime/blob/master/src/ops/NumberOps.ts#L10))
3. Add operation type information for your type ([example](https://github.com/expangine/expangine-runtime/blob/master/src/ops/types/NumberOpsTypes.ts#L19) and [more complex example](https://github.com/expangine/expangine-runtime/blob/master/src/ops/types/ListOpsTypes.ts#L31))
4. Add operation implementation for your runtimes ([example](https://github.com/expangine/expangine-runtime-live/blob/master/src/number.ts#L8))
5. Add your type to the defs (`import { defs } from 'expangine-runtime'; defs.addType(MyType);`)
6. Add your type & operation visuals ([type visuals](https://github.com/expangine/expangine-vue/tree/master/src/runtime/types/number) and [operation visuals](https://github.com/expangine/expangine-vue/blob/master/src/runtime/ops/NumberOpsVisuals.ts#L5))
7. Use your new types in your expangine programs!

### Preview

**Type View**
![Type View](/docs/Type.png)
**Data View**
![Data View](/docs/Data.png)
**Program View**
![Program View](/docs/Program.png)
**Execution**
![Execution](/docs/Execution.png)
**Debugger**
![Debugger](/docs/Debugger.png)
**Function Definition**
![Function Definition](/docs/Function_Input.png)
**Function Implementation**
![Function Implementation](/docs/Function_Program.png)
**Menu > File**
![Menu > File](/docs/Menu_File.png)
**Menu > Edit**
![Menu > Edit](/docs/Menu_Edit.png)
**Menu > Functions**
![Menu > Functions](/docs/Menu_Functions.png)

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
