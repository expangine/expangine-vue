<template>
  <ex-simple-fields
    :value="type.options"
    :fields="optionFields"
    :read-only="readOnly"
    @input="updateType"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { DateType, DateOptions, Unit } from 'expangine-runtime';
import { ListOptions, SimpleFieldSettings } from '../../../common';
import TypeEditorBase from '../TypeEditorBase';


const unitOptions: ListOptions<Unit> = [
  { text: 'Millisecond', value: 'millis' },
  { text: 'Second', value: 'second' },
  { text: 'Minute', value: 'minute' },
  { text: 'Hour', value: 'hour' },
  { text: 'Day', value: 'day' },
  { text: 'Week', value: 'week' },
  { text: 'Month', value: 'month' },
  { text: 'Quarter', value: 'quarter' },
  { text: 'Year', value: 'year' },
];

const fields: SimpleFieldSettings<DateOptions> = [
  { name: 'validateMin', type: 'date', label: 'Validate Min' },
  { name: 'validateMax', type: 'date', label: 'Validate Max' },
  { name: 'forceMin', type: 'date', label: 'Force Min' },
  { name: 'forceMax', type: 'date', label: 'Force Max' },
  { name: 'forceStartOf', type: 'select', label: 'Force Start Of', items: unitOptions },
  { name: 'forceEndOf', type: 'select', label: 'Force End Of', items: unitOptions },
  { name: 'withTime', type: 'boolean', label: 'With Time' },
  { name: 'parseAsUTC', type: 'boolean', label: 'Parse as UTC' },
];

export default TypeEditorBase<DateType, any>().extend({
  name: 'DateOptions',
  computed: {
    optionFields: () => fields,
  },
});
</script>