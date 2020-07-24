import colors from 'vuetify/lib/util/colors';
import { Types } from 'expangine-runtime';


export const Colors: Array<[string, string]> = [
  ['Primary', 'primary'],
  ['Secondary', 'secondary'],
  ['Accent', 'accent'],
  ['Error', 'error'],

  ['Red Lighten 5', colors.red.lighten5],
  ['Red Lighten 4', colors.red.lighten4],
  ['Red Lighten 3', colors.red.lighten3],
  ['Red Lighten 2', colors.red.lighten2],
  ['Red Lighten 1', colors.red.lighten1],
  ['Red', colors.red.base],
  ['Red Darken 1', colors.red.darken1],
  ['Red Darken 2', colors.red.darken2],
  ['Red Darken 3', colors.red.darken3],
  ['Red Darken 4', colors.red.darken4],

  ['Pink Lighten 5', colors.pink.lighten5],
  ['Pink Lighten 4', colors.pink.lighten4],
  ['Pink Lighten 3', colors.pink.lighten3],
  ['Pink Lighten 2', colors.pink.lighten2],
  ['Pink Lighten 1', colors.pink.lighten1],
  ['Pink', colors.pink.base],
  ['Pink Darken 1', colors.pink.darken1],
  ['Pink Darken 2', colors.pink.darken2],
  ['Pink Darken 3', colors.pink.darken3],
  ['Pink Darken 4', colors.pink.darken4],

  ['Purple Lighten 5', colors.purple.lighten5],
  ['Purple Lighten 4', colors.purple.lighten4],
  ['Purple Lighten 3', colors.purple.lighten3],
  ['Purple Lighten 2', colors.purple.lighten2],
  ['Purple Lighten 1', colors.purple.lighten1],
  ['Purple', colors.purple.base],
  ['Purple Darken 1', colors.purple.darken1],
  ['Purple Darken 2', colors.purple.darken2],
  ['Purple Darken 3', colors.purple.darken3],
  ['Purple Darken 4', colors.purple.darken4],

  ['Deep Purple Lighten 5', colors.deepPurple.lighten5],
  ['Deep Purple Lighten 4', colors.deepPurple.lighten4],
  ['Deep Purple Lighten 3', colors.deepPurple.lighten3],
  ['Deep Purple Lighten 2', colors.deepPurple.lighten2],
  ['Deep Purple Lighten 1', colors.deepPurple.lighten1],
  ['Deep Purple', colors.deepPurple.base],
  ['Deep Purple Darken 1', colors.deepPurple.darken1],
  ['Deep Purple Darken 2', colors.deepPurple.darken2],
  ['Deep Purple Darken 3', colors.deepPurple.darken3],
  ['Deep Purple Darken 4', colors.deepPurple.darken4],

  ['Indigo Lighten 5', colors.indigo.lighten5],
  ['Indigo Lighten 4', colors.indigo.lighten4],
  ['Indigo Lighten 3', colors.indigo.lighten3],
  ['Indigo Lighten 2', colors.indigo.lighten2],
  ['Indigo Lighten 1', colors.indigo.lighten1],
  ['Indigo', colors.indigo.base],
  ['Indigo Darken 1', colors.indigo.darken1],
  ['Indigo Darken 2', colors.indigo.darken2],
  ['Indigo Darken 3', colors.indigo.darken3],
  ['Indigo Darken 4', colors.indigo.darken4],

  ['Blue Lighten 5', colors.blue.lighten5],
  ['Blue Lighten 4', colors.blue.lighten4],
  ['Blue Lighten 3', colors.blue.lighten3],
  ['Blue Lighten 2', colors.blue.lighten2],
  ['Blue Lighten 1', colors.blue.lighten1],
  ['Blue', colors.blue.base],
  ['Blue Darken 1', colors.blue.darken1],
  ['Blue Darken 2', colors.blue.darken2],
  ['Blue Darken 3', colors.blue.darken3],
  ['Blue Darken 4', colors.blue.darken4],

  ['Light Blue Lighten 5', colors.lightBlue.lighten5],
  ['Light Blue Lighten 4', colors.lightBlue.lighten4],
  ['Light Blue Lighten 3', colors.lightBlue.lighten3],
  ['Light Blue Lighten 2', colors.lightBlue.lighten2],
  ['Light Blue Lighten 1', colors.lightBlue.lighten1],
  ['Light Blue', colors.lightBlue.base],
  ['Light Blue Darken 1', colors.lightBlue.darken1],
  ['Light Blue Darken 2', colors.lightBlue.darken2],
  ['Light Blue Darken 3', colors.lightBlue.darken3],
  ['Light Blue Darken 4', colors.lightBlue.darken4],

  ['Cyan Lighten 5', colors.cyan.lighten5],
  ['Cyan Lighten 4', colors.cyan.lighten4],
  ['Cyan Lighten 3', colors.cyan.lighten3],
  ['Cyan Lighten 2', colors.cyan.lighten2],
  ['Cyan Lighten 1', colors.cyan.lighten1],
  ['Cyan', colors.cyan.base],
  ['Cyan Darken 1', colors.cyan.darken1],
  ['Cyan Darken 2', colors.cyan.darken2],
  ['Cyan Darken 3', colors.cyan.darken3],
  ['Cyan Darken 4', colors.cyan.darken4],

  ['Teal Lighten 5', colors.teal.lighten5],
  ['Teal Lighten 4', colors.teal.lighten4],
  ['Teal Lighten 3', colors.teal.lighten3],
  ['Teal Lighten 2', colors.teal.lighten2],
  ['Teal Lighten 1', colors.teal.lighten1],
  ['Teal', colors.teal.base],
  ['Teal Darken 1', colors.teal.darken1],
  ['Teal Darken 2', colors.teal.darken2],
  ['Teal Darken 3', colors.teal.darken3],
  ['Teal Darken 4', colors.teal.darken4],

  ['Green Lighten 5', colors.green.lighten5],
  ['Green Lighten 4', colors.green.lighten4],
  ['Green Lighten 3', colors.green.lighten3],
  ['Green Lighten 2', colors.green.lighten2],
  ['Green Lighten 1', colors.green.lighten1],
  ['Green', colors.green.base],
  ['Green Darken 1', colors.green.darken1],
  ['Green Darken 2', colors.green.darken2],
  ['Green Darken 3', colors.green.darken3],
  ['Green Darken 4', colors.green.darken4],

  ['Light Green Lighten 5', colors.lightGreen.lighten5],
  ['Light Green Lighten 4', colors.lightGreen.lighten4],
  ['Light Green Lighten 3', colors.lightGreen.lighten3],
  ['Light Green Lighten 2', colors.lightGreen.lighten2],
  ['Light Green Lighten 1', colors.lightGreen.lighten1],
  ['Light Green', colors.lightGreen.base],
  ['Light Green Darken 1', colors.lightGreen.darken1],
  ['Light Green Darken 2', colors.lightGreen.darken2],
  ['Light Green Darken 3', colors.lightGreen.darken3],
  ['Light Green Darken 4', colors.lightGreen.darken4],

  ['Lime Lighten 5', colors.lime.lighten5],
  ['Lime Lighten 4', colors.lime.lighten4],
  ['Lime Lighten 3', colors.lime.lighten3],
  ['Lime Lighten 2', colors.lime.lighten2],
  ['Lime Lighten 1', colors.lime.lighten1],
  ['Lime', colors.lime.base],
  ['Lime Darken 1', colors.lime.darken1],
  ['Lime Darken 2', colors.lime.darken2],
  ['Lime Darken 3', colors.lime.darken3],
  ['Lime Darken 4', colors.lime.darken4],

  ['Yellow Lighten 5', colors.yellow.lighten5],
  ['Yellow Lighten 4', colors.yellow.lighten4],
  ['Yellow Lighten 3', colors.yellow.lighten3],
  ['Yellow Lighten 2', colors.yellow.lighten2],
  ['Yellow Lighten 1', colors.yellow.lighten1],
  ['Yellow', colors.yellow.base],
  ['Yellow Darken 1', colors.yellow.darken1],
  ['Yellow Darken 2', colors.yellow.darken2],
  ['Yellow Darken 3', colors.yellow.darken3],
  ['Yellow Darken 4', colors.yellow.darken4],

  ['Amber Lighten 5', colors.amber.lighten5],
  ['Amber Lighten 4', colors.amber.lighten4],
  ['Amber Lighten 3', colors.amber.lighten3],
  ['Amber Lighten 2', colors.amber.lighten2],
  ['Amber Lighten 1', colors.amber.lighten1],
  ['Amber', colors.amber.base],
  ['Amber Darken 1', colors.amber.darken1],
  ['Amber Darken 2', colors.amber.darken2],
  ['Amber Darken 3', colors.amber.darken3],
  ['Amber Darken 4', colors.amber.darken4],

  ['Orange Lighten 5', colors.orange.lighten5],
  ['Orange Lighten 4', colors.orange.lighten4],
  ['Orange Lighten 3', colors.orange.lighten3],
  ['Orange Lighten 2', colors.orange.lighten2],
  ['Orange Lighten 1', colors.orange.lighten1],
  ['Orange', colors.orange.base],
  ['Orange Darken 1', colors.orange.darken1],
  ['Orange Darken 2', colors.orange.darken2],
  ['Orange Darken 3', colors.orange.darken3],
  ['Orange Darken 4', colors.orange.darken4],

  ['Deep Orange Lighten 5', colors.deepOrange.lighten5],
  ['Deep Orange Lighten 4', colors.deepOrange.lighten4],
  ['Deep Orange Lighten 3', colors.deepOrange.lighten3],
  ['Deep Orange Lighten 2', colors.deepOrange.lighten2],
  ['Deep Orange Lighten 1', colors.deepOrange.lighten1],
  ['Deep Orange', colors.deepOrange.base],
  ['Deep Orange Darken 1', colors.deepOrange.darken1],
  ['Deep Orange Darken 2', colors.deepOrange.darken2],
  ['Deep Orange Darken 3', colors.deepOrange.darken3],
  ['Deep Orange Darken 4', colors.deepOrange.darken4],

  ['Brown Lighten 5', colors.brown.lighten5],
  ['Brown Lighten 4', colors.brown.lighten4],
  ['Brown Lighten 3', colors.brown.lighten3],
  ['Brown Lighten 2', colors.brown.lighten2],
  ['Brown Lighten 1', colors.brown.lighten1],
  ['Brown', colors.brown.base],
  ['Brown Darken 1', colors.brown.darken1],
  ['Brown Darken 2', colors.brown.darken2],
  ['Brown Darken 3', colors.brown.darken3],
  ['Brown Darken 4', colors.brown.darken4],

  ['Blue Grey Lighten 5', colors.blueGrey.lighten5],
  ['Blue Grey Lighten 4', colors.blueGrey.lighten4],
  ['Blue Grey Lighten 3', colors.blueGrey.lighten3],
  ['Blue Grey Lighten 2', colors.blueGrey.lighten2],
  ['Blue Grey Lighten 1', colors.blueGrey.lighten1],
  ['Blue Grey', colors.blueGrey.base],
  ['Blue Grey Darken 1', colors.blueGrey.darken1],
  ['Blue Grey Darken 2', colors.blueGrey.darken2],
  ['Blue Grey Darken 3', colors.blueGrey.darken3],
  ['Blue Grey Darken 4', colors.blueGrey.darken4],

  ['Grey Lighten 5', colors.grey.lighten5],
  ['Grey Lighten 4', colors.grey.lighten4],
  ['Grey Lighten 3', colors.grey.lighten3],
  ['Grey Lighten 2', colors.grey.lighten2],
  ['Grey Lighten 1', colors.grey.lighten1],
  ['Grey', colors.grey.base],
  ['Grey Darken 1', colors.grey.darken1],
  ['Grey Darken 2', colors.grey.darken2],
  ['Grey Darken 3', colors.grey.darken3],
  ['Grey Darken 4', colors.grey.darken4],

  ['White', colors.shades.white],
  ['Black', colors.shades.black],
  ['Transparent', colors.shades.transparent],
  
];

export const ColorsType = Types.enum(Types.text(), Types.text(), Colors);
