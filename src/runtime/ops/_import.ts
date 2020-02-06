
import { Registry } from '../Registry';

import AliasedOpsVisuals from './AliasedOpsVisuals';
import AnyOpsVisuals from './AnyOpsVisuals';
import BooleanOpsVisuals from './BooleanOpsVisuals';
import ColorOpsVisuals from './ColorOpsVisuals';
import DateOpsVisuals from './DateOpsVisuals';
import ListOpsVisuals from './ListOpsVisuals';
import MapOpsVisuals from './MapOpsVisuals';
import NumberOpsVisuals from './NumberOpsVisuals';
import ObjectOpsVisuals from './ObjectOpsVisuals';
import SetOpsVisuals from './SetOpsVisuals';
import TextOpsVisuals from './TextOpsVisuals';
import TupleOpsVisuals from './TupleOpsVisuals';


export default function(registry: Registry)
{
  registry
    .import(AliasedOpsVisuals)
    .import(AnyOpsVisuals)
    .import(BooleanOpsVisuals)
    .import(ColorOpsVisuals)
    .import(DateOpsVisuals)
    .import(ListOpsVisuals)
    .import(MapOpsVisuals)
    .import(NumberOpsVisuals)
    .import(ObjectOpsVisuals)
    .import(SetOpsVisuals)
    .import(TextOpsVisuals)
    .import(TupleOpsVisuals)
  ;
}
