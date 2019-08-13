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
    
### By Type

#### Any
- Editor: none
- Input:
  - Default:
    - Settings: Exclude/include available input types
    - Input: User can select any available inputs
#### Boolean
- Editor: which string values go to true/false, what is the default otherwise
- Input:
  - Checkbox (default): https://vuetifyjs.com/en/components/selection-controls
  - Switch: https://vuetifyjs.com/en/components/selection-controls
  - Radio: https://vuetifyjs.com/en/components/selection-controls
  - Dropdown: https://vuetifyjs.com/en/components/selects
#### Date
- Editor: parse as UTC, validate min, validate max, force min, force max, force start of, force end of
- Input:
  - Picker (default): https://vuetifyjs.com/en/components/date-pickers
  - Textbox: https://vuetifyjs.com/en/components/text-fields
#### Enum
- Editor: Key type (defaults to string), value type (defaults to string), once selected there is a list of key,value pairs you can enter using the default input types
- Input:
  - Dropdown: https://vuetifyjs.com/en/components/selects
  - Autocomplete: https://vuetifyjs.com/en/components/autocompletes
  - Radio: https://vuetifyjs.com/en/components/selection-controls
  - Slider: https://vuetifyjs.com/en/components/sliders#custom-range-slider
#### Function
- Editor: Return type, parameter types (Object editor), and Expression Builder
#### Generic
#### List
- Editor: Item type, min, max
- Input:
  - Item (default): defaults to item type default, has (+) and (-) buttons
  - Checkboxes (enum, date): https://vuetifyjs.com/en/components/selection-controls
  - Autocomplete (enum): https://vuetifyjs.com/en/components/autocompletes
  - Select (enum): https://vuetifyjs.com/en/components/selects
  - Combobox (text): https://vuetifyjs.com/en/components/combobox
#### Many
- Editor: List of types, they have editors, and you select which input to use and it's settings
#### Map
- Editor: Key type (defaults to string), value type (defaults to string), select which input to use for each and it's settings
#### Null
- Editor: Include undefined?
#### Number
- Editor: Min, max, whole
- Input:
  - Textbox: https://vuetifyjs.com/en/components/text-fields
  - Slider: https://vuetifyjs.com/en/components/sliders
  - Autocomplete: https://vuetifyjs.com/en/components/autocompletes
#### Object
- Editor: Add/remove value types
- Input:
  - Two Column (default):
  - One Column:
  - Table:
#### Optional
- Editor: Select type
#### Text
- Editor: Min, max, require upper/lower, force upper/lower, matches
- Input:
  - Textbox: https://vuetifyjs.com/en/components/text-fields
  - Textarea: https://vuetifyjs.com/en/components/textarea
  - Autocomplete: https://vuetifyjs.com/en/components/autocompletes

  

```
interface Visuals {
  types: {
    [id: string]: {
      name: string;
      description: string;
      editor: VueComponent;
      buildable: boolean;
      buildLabel: string;
      modifiable: boolean;
      modifyLabel: string;
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
