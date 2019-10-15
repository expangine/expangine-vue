
import { Registry } from '../Registry';

import { GetVisuals } from './get';
import { ConstantVisuals } from './constant';
import { SetVisuals } from './set';
import { IfVisuals } from './if';
import { ChainVisuals } from './chain';
import { UpdateVisuals } from './update';
import { DoVisuals } from './do';
import { WhileVisuals } from './while';
import { ForVisuals } from './for';
import { NotVisuals } from './not';
import { DefineVisuals } from './define';
import { TemplateVisuals } from './template';
import { AndVisuals } from './and';
import { NoVisuals } from './no';
import { OrVisuals } from './or';
import { OperationVisuals } from './operation';
import { TupleVisuals } from './tuple';
import { ObjectVisuals } from './object';
import { SwitchVisuals } from './switch';
import { ReturnVisuals } from './return';


export default function(registry: Registry)
{
  registry
    .addExpression(ConstantVisuals)
    .addExpression(GetVisuals)
    .addExpression(OperationVisuals)
    .addExpression(SetVisuals)
    .addExpression(UpdateVisuals)
    .addExpression(IfVisuals)
    .addExpression(SwitchVisuals)
    .addExpression(DoVisuals)
    .addExpression(WhileVisuals)
    .addExpression(ForVisuals)
    .addExpression(DefineVisuals)
    .addExpression(TemplateVisuals)
    .addExpression(TupleVisuals)
    .addExpression(ObjectVisuals)
    .addExpression(NotVisuals)
    .addExpression(AndVisuals)
    .addExpression(NoVisuals)
    .addExpression(OrVisuals)
    .addExpression(ChainVisuals)
    .addExpression(ReturnVisuals)
  ;
}
