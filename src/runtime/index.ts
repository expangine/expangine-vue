
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
import { TupleVisuals, TupleBuilder, TupleModifierFromObject, TupleModifierAddType, TupleBuilderWrapper } from './types/tuple';

import { ChangeTypeModifier } from './hooks/ChangeTypeModifier';
import { CopyModifier, PasteBuilder } from './hooks/ClipboardHooks';
import { DefaultWrapper } from './hooks/DefaultWrapper';

import { GetVisuals } from './exprs/get';
import { ConstantVisuals } from './exprs/constant';
import { SetVisuals } from './exprs/set';
import { IfVisuals } from './exprs/if';
import { ChainVisuals } from './exprs/chain';
import { UpdateVisuals } from './exprs/update';
import { DoVisuals } from './exprs/do';
import { WhileVisuals } from './exprs/while';
import { ForVisuals } from './exprs/for';


export default new Registry(defs)
  // Types
  .addType(BooleanVisuals)
    .addTypeBuilder(BooleanBuilder)
  .addType(TextVisuals)
    .addTypeBuilder(TextBuilder)
  .addType(ObjectVisuals)
    .addTypeBuilder(ObjectBuilder)
    .addTypeModifier(ObjectModifierToObject)
  .addType(NumberVisuals)
    .addTypeBuilder(NumberBuilder)
  .addType(DateVisuals)
    .addTypeBuilder(DateBuilder)
  .addType(OptionalVisuals)
    .addTypeModifier(OptionalModifier)
    .addTypeModifier(OptionalModifierRequire)
  .addType(ManyVisuals)
    .addTypeModifier(ManyModifier)
    .addTypeBuilderWrapper(ManyBuilderWrapper)
  .addType(ListVisuals)
    .addTypeBuilder(ListBuilder)
    .addTypeBuilderWrapper(ListBuilderWrapper)
  .addType(EnumVisuals)
    .addTypeBuilder(EnumBuilder)
    .addTypeBuilderWrapper(EnumBuilderWrapper)
  .addType(MapVisuals)
    .addTypeBuilder(MapBuilder)
    .addTypeModifier(MapModifierFromObject)
    .addTypeBuilderWrapper(MapBuilderWrapper)
  .addType(TupleVisuals)
    .addTypeBuilder(TupleBuilder)
    .addTypeModifier(TupleModifierFromObject)
    .addTypeModifier(TupleModifierAddType)
    .addTypeBuilderWrapper(TupleBuilderWrapper)
  .addTypeModifier(ChangeTypeModifier)
  .addTypeBuilder(PasteBuilder)
  .addTypeModifier(CopyModifier)
  .addTypeBuilderWrapper(DefaultWrapper)
  // Expressions
  .addExpression(GetVisuals)
  .addExpression(ConstantVisuals)
  .addExpression(SetVisuals)
  .addExpression(IfVisuals)
  .addExpression(ChainVisuals)
  .addExpression(UpdateVisuals)
  .addExpression(DoVisuals)
  .addExpression(WhileVisuals)
  .addExpression(ForVisuals)
;
