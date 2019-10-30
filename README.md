# expangine-vue
A Vue & Vuetify component library for expangine, a visual development framework. 

You can test out the sandbox [here](https://expangine.github.io/expangine-vue/#/), where you can define the structure of your program input, populate the input, and develop the program. 

Features of this example:
- Import / Export your structure, data, program, and functions as JSON.
- Use JSON or JS code to detect the data determine its types.
- Load an example program & data.
- Undo / Redo history saved to your localStorage.
- Add / Edit / Remove re-usable functions.
- Save the program as a re-usable function.
- Test your functions outside the program.
- Run your program and see it's output. If your program would update your data see the data before, after, and the diff.
- Debug your program and step through your program in any direction looking at the result of the current expression and the current state of your data.
- Test operations you use in your program.

## expangine

Expangine is a visual programming framework that allows you to create programs. You design the structure of your data, some test data to work on, and finally a program which processes that data. Expangine is **fully** customizable, so you can add your own data types, operations, and expressions.

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

<details><summary>Example</summary>
<p>
  <img src="/docs/Main.png" alt="Main View">
</p>
</details>
<details><summary>Design View</summary>
<p>
  <img src="/docs/Type.png" alt="Type View">
</p>
</details>
<details><summary>Data View</summary>
<p>
  <img src="/docs/Data.png" alt="Data View">
</p>
</details>
<details><summary>Program View</summary>
<p>
  <img src="/docs/Program.png" alt="Program View">
</p>
</details>
<details><summary>Execution</summary>
<p>
  <img src="/docs/Execution.png" alt="Execution">
</p>
</details>
<details><summary>Debugger</summary>
<p>
  <img src="/docs/Debugger.png" alt="Debugger">
</p>
</details>
<details><summary>Detect Types from Data</summary>
<p>
  <img src="/docs/Describe_Input.png" alt="Detect Input">
  <img src="/docs/Describe_Type.png" alt="Detected Type">
  <img src="/docs/Describe_Data.png" alt="Detected Data">
</p>
</details>
<details><summary>Function Definition</summary>
<p>
  <img src="/docs/Function_Input.png" alt="Function Definition">
</p>
</details>
<details><summary>Function Implementation</summary>
<p>
  <img src="/docs/Function_Program.png" alt="Function Implementation">
</p>
</details>
<details><summary>Test Function</summary>
<p>
  <img src="/docs/Test_Function.png" alt="Test Function">
</p>
</details>
<details><summary>Test Operation</summary>
<p>
  <img src="/docs/Test_Operation.png" alt="Test Operation">
</p>
</details>

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
