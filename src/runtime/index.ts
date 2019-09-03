
import { defs } from 'expangine-runtime';

import { Registry } from './Registry';

import { BooleanVisuals, BooleanBuilder } from './types/boolean';
import { TextVisuals, TextBuilder } from './types/text';
import { ObjectVisuals, ObjectBuilder, ObjectModifierToObject } from './types/object';
import { NumberVisuals, NumberBuilder } from './types/number';
import { DateVisuals, DateBuilder } from './types/date';
import { OptionalVisuals, OptionalModifier, OptionalModifierRequire } from './types/optional';
import { ManyVisuals, ManyModifier, ManyBuilderWrapper } from './types/many';
import { ListVisuals, ListBuilder, ListBuilderWrapper } from './types/list';
import { EnumVisuals, EnumBuilder, EnumBuilderWrapper } from './types/enum';
import { MapVisuals, MapBuilder, MapModifierFromObject, MapBuilderWrapper } from './types/map';
import { TupleVisuals, TupleBuilder, TupleModifierFromObject, TupleModifierAddType, 
  TupleBuilderWrapper } from './types/tuple';

import { ChangeTypeModifier } from './hooks/ChangeTypeModifier';
import { CopyModifier, PasteBuilder } from './hooks/ClipboardHooks';
import { DefaultWrapper } from './hooks/DefaultWrapper';


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
    .addBuilderWrapper(ManyBuilderWrapper)
  .addType(ListVisuals)
    .addBuilder(ListBuilder)
    .addBuilderWrapper(ListBuilderWrapper)
  .addType(EnumVisuals)
    .addBuilder(EnumBuilder)
    .addBuilderWrapper(EnumBuilderWrapper)
  .addType(MapVisuals)
    .addBuilder(MapBuilder)
    .addModifier(MapModifierFromObject)
    .addBuilderWrapper(MapBuilderWrapper)
  .addType(TupleVisuals)
    .addBuilder(TupleBuilder)
    .addModifier(TupleModifierFromObject)
    .addModifier(TupleModifierAddType)
    .addBuilderWrapper(TupleBuilderWrapper)
  .addModifier(ChangeTypeModifier)
  .addBuilder(PasteBuilder)
  .addModifier(CopyModifier)
  .addBuilderWrapper(DefaultWrapper)
;
