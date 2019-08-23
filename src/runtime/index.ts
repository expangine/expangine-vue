import { Registry } from './Registry';

import BooleanVisuals from './types/boolean';
import TextVisuals from './types/text';
import ObjectVisuals from './types/object';
import NumberVisuals from './types/number';
import DateVisuals from './types/date';
import OptionalVisuals from './types/optional';
import ManyVisuals from './types/many';


export default new Registry()
  .addType(BooleanVisuals)
  .addType(TextVisuals)
  .addType(ObjectVisuals)
  .addType(NumberVisuals)
  .addType(DateVisuals)
  .addType(OptionalVisuals)
  .addType(ManyVisuals)
;
