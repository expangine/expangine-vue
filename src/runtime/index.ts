
import { defs } from 'expangine-runtime';

import { Registry } from './Registry';

import { BooleanVisuals, BooleanBuilder } from './types/boolean';
import { TextVisuals, TextBuilder } from './types/text';
import { ObjectVisuals, ObjectBuilder, ObjectModifierToObject } from './types/object';
import { NumberVisuals, NumberBuilder } from './types/number';
import { DateVisuals, DateBuilder } from './types/date';
import { OptionalVisuals, OptionalModifier, OptionalModifierRequire } from './types/optional';
import { ManyVisuals, ManyModifier } from './types/many';
import { ListVisuals, ListBuilder } from './types/list';
import { EnumVisuals, EnumBuilder } from './types/enum';
import { MapVisuals, MapBuilder, MapModifierFromObject } from './types/map';
import { TupleVisuals, TupleBuilder, TupleModifierFromObject, TupleModifierAddType } from './types/tuple';

import { ChangeTypeModifier } from './hooks/ChangeTypeModifier';
import { CopyModifier, PasteBuilder } from './hooks/ClipboardHooks';


export default new Registry(defs)
  .addType(BooleanVisuals)
    .addBuilder(BooleanBuilder)
  .addType(TextVisuals)
    .addBuilder(TextBuilder)
  .addType(ObjectVisuals)
    .addBuilder(ObjectBuilder)
    .addModifier(ObjectModifierToObject)
  .addType(NumberVisuals)
    .addBuilder(NumberBuilder)
  .addType(DateVisuals)
    .addBuilder(DateBuilder)
  .addType(OptionalVisuals)
    .addModifier(OptionalModifier)
    .addModifier(OptionalModifierRequire)
  .addType(ManyVisuals)
    .addModifier(ManyModifier)
  .addType(ListVisuals)
    .addBuilder(ListBuilder)
  .addType(EnumVisuals)
    .addBuilder(EnumBuilder)
  .addType(MapVisuals)
    .addBuilder(MapBuilder)
    .addModifier(MapModifierFromObject)
  .addType(TupleVisuals)
    .addBuilder(TupleBuilder)
    .addModifier(TupleModifierFromObject)
    .addModifier(TupleModifierAddType)
  .addModifier(ChangeTypeModifier)
  .addBuilder(PasteBuilder)
  .addModifier(CopyModifier)
;
