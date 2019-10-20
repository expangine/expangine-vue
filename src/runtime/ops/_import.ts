
import { Registry } from '../Registry';

import AnyOpsVisuals from './AnyOpsVisuals';
import BooleanOpsVisuals from './BooleanOpsVisuals';
import ColorOpsVisuals from './ColorOpsVisuals';
import DateOpsVisuals from './DateOpsVisuals';
import ListOpsVisuals from './ListOpsVisuals';
import MapOpsVisuals from './MapOpsVisuals';
import NumberOpsVisuals from './NumberOpsVisuals';
import ObjectOpsVisuals from './ObjectOpsVisuals';
import TextOpsVisuals from './TextOpsVisuals';
import TupleOpsVisuals from './TupleOpsVisuals';


export default function(registry: Registry)
{
  registry
    .import(AnyOpsVisuals)
    .import(BooleanOpsVisuals)
    .import(ColorOpsVisuals)
    .import(DateOpsVisuals)
    .import(ListOpsVisuals)
    .import(MapOpsVisuals)
    .import(NumberOpsVisuals)
    .import(ObjectOpsVisuals)
    .import(TextOpsVisuals)
    .import(TupleOpsVisuals)
  ;
}
