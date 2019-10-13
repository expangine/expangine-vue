
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


export default function(registry: Registry)
{
  registry
    .addExpression(GetVisuals)
    .addExpression(ConstantVisuals)
    .addExpression(SetVisuals)
    .addExpression(IfVisuals)
    .addExpression(ChainVisuals)
    .addExpression(UpdateVisuals)
    .addExpression(DoVisuals)
    .addExpression(WhileVisuals)
    .addExpression(ForVisuals)
    .addExpression(NotVisuals)
    .addExpression(DefineVisuals)
    .addExpression(TemplateVisuals)
    .addExpression(NoVisuals)
    .addExpression(OrVisuals)
    .addExpression(AndVisuals)
    .addExpression(OperationVisuals)
    .addExpression(TupleVisuals)
    .addExpression(ObjectVisuals)
  ;
}
