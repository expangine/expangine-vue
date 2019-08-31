
import { defs } from 'expangine-runtime';

import { Registry } from './Registry';

import { BooleanVisuals, BooleanBuilder } from './types/boolean';
import { TextVisuals, TextBuilder } from './types/text';
import { ObjectVisuals, ObjectBuilder } from './types/object';
import { NumberVisuals, NumberBuilder } from './types/number';
import { DateVisuals, DateBuilder } from './types/date';
import { OptionalVisuals, OptionalModifier } from './types/optional';
import { ManyVisuals, ManyModifier } from './types/many';
import { ListVisuals, ListBuilder } from './types/list';
import { EnumVisuals, EnumBuilder } from './types/enum';
import { MapVisuals, MapBuilder, MapModifierFromObject } from './types/map';

import { ChangeTypeModifier } from './hooks/ChangeTypeModifier';

export default new Registry(defs)
  .addType(BooleanVisuals)
    .addBuilder(BooleanBuilder)
  .addType(TextVisuals)
    .addBuilder(TextBuilder)
  .addType(ObjectVisuals)
    .addBuilder(ObjectBuilder)
  .addType(NumberVisuals)
    .addBuilder(NumberBuilder)
  .addType(DateVisuals)
    .addBuilder(DateBuilder)
  .addType(OptionalVisuals)
    .addModifier(OptionalModifier)
  .addType(ManyVisuals)
    .addModifier(ManyModifier)
  .addType(ListVisuals)
    .addBuilder(ListBuilder)
  .addType(EnumVisuals)
    .addBuilder(EnumBuilder)
  .addType(MapVisuals)
    .addBuilder(MapBuilder)
    .addModifier(MapModifierFromObject)
  .addModifier(ChangeTypeModifier)
;
