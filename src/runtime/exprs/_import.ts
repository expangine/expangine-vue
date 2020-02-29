
import { Registry } from '../Registry';

import { GetVisuals } from './get';
import { GetDataVisuals } from './data';
import { GetEntityVisuals } from './entity';
import { GetRelationVisuals } from './relation';
import { ComputedVisuals } from './computed';
import { ConstantVisuals } from './constant';
import { CommentVisuals } from './comment';
import { SetVisuals } from './set';
import { SubVisuals } from './sub';
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
import { InvokeVisuals } from './invoke';


export default function(registry: Registry)
{
  registry
    .addExpression(ConstantVisuals)
    .addExpression(GetVisuals)
    .addExpression(OperationVisuals)
    .addExpression(SetVisuals)
    .addExpression(UpdateVisuals)
    .addExpression(SubVisuals)
    .addExpression(ComputedVisuals)
    .addExpression(IfVisuals)
    .addExpression(SwitchVisuals)
    .addExpression(DoVisuals)
    .addExpression(WhileVisuals)
    .addExpression(ForVisuals)
    .addExpression(DefineVisuals)
    .addExpression(TemplateVisuals)
    .addExpression(TupleVisuals)
    .addExpression(ObjectVisuals)
    .addExpression(InvokeVisuals) 
    .addExpression(NotVisuals)
    .addExpression(AndVisuals)
    .addExpression(NoVisuals)
    .addExpression(OrVisuals)
    .addExpression(ChainVisuals)
    .addExpression(GetDataVisuals)
    .addExpression(GetEntityVisuals)
    .addExpression(GetRelationVisuals)
    .addExpression(CommentVisuals)
    .addExpression(ReturnVisuals)
  ;
}
