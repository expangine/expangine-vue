<template>
  <v-menu
    v-bind="menuProps"
    v-model="menu"
    :disabled="readOnly"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-bind="textProps"
        v-on="on"
        :value="valueAsString"
      ></v-text-field>
    </template>
    <v-date-picker
      v-if="showDate"
      v-bind="dateProps"
      :value="dateValue"
      @input="dateInput"
    >
      <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
      <div class="flex-grow-1"></div>    
      <v-btn color="primary" @click="dateProceed">OK</v-btn>
    </v-date-picker>
    <v-time-picker
      v-if="showTime"
      v-bind="timeProps"
      :value="timeValue"
      @input="timeInput"
    >
      <v-btn icon color="secondary" @click="dateBack">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
      <div class="flex-grow-1"></div>    
      <v-btn color="primary" @click="timeProceed">OK</v-btn>
    </v-time-picker>
  </v-menu>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { DateFormat, currentLocale } from 'expangine-runtime';


export default Vue.extend({
  props: {
    value: {
      type: Date as PropType<Date>,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    withTime: {
      type: Boolean,
      default: false,
    },
    dateProps: {
      type: Object,
      default: () => ({}),
    },
    timeProps: {
      type: Object,
      default: () => ({}),
    },
    menuProps: {
      type: Object,
      default: () => ({
        closeOnContentClick: false,
        nudgeRight: 40,
        transition: 'scale-transition',
        offsetY: true,
        fullWidth: true,
        minWidth: '290px',
      }),
    },
    textProps: {
      type: Object,
      default: () => ({
        readonly: true,
        prependInnerIcon: 'mdi-calendar',
      }),
    },
  },
  data: () => ({
    menu: false,
    showDate: true,
    showTime: false,
    dateValue: '',
    timeValue: '',
  }),
  computed: {
    valueAsString(): string {
      return this.value 
        ? this.withTime  
          ? DateFormat.format('Y-MM-DD HH:mm', [this.value, currentLocale])
          : DateFormat.format('Y-MM-DD', [this.value, currentLocale])
        : '';
    },
  },
  watch: {
    menu: 'reset',
    value: {
      immediate: true,
      handler() {
        this.pullDateTime();
      },
    },
  },
  methods: {
    pullDateTime() {
      if (this.value) {
        this.dateValue = DateFormat.format('Y-MM-DD', [this.value, currentLocale]);
        this.timeValue = DateFormat.format('HH:mm', [this.value, currentLocale]);
      } else {
        this.dateValue = this.timeValue = '';
      }
    },
    reset() {
      this.showDate = true;
      this.showTime = false;
      this.pullDateTime();
    },
    dateInput(value: string) {
      this.dateValue = value;
    },
    dateProceed() {
      if (this.withTime) {
        this.showDate = false;
        this.showTime = true;
      } else {
        this.$emit('input', new Date(this.dateValue + ' 00:00'));
        this.menu = false;
      }
    },
    dateBack() {
      this.showTime = false;
      this.showDate = true;
    },
    timeInput(value: string) {
      this.timeValue = value;
    },
    timeProceed() {
      this.showTime = false;
      this.showDate = true;
      this.$emit('input', new Date(this.dateValue + ' ' + this.timeValue));
      this.menu = false;
    },
  },
});
</script>