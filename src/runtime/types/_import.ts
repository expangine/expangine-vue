import { Registry } from '../Registry';

import AnyImport from './any/_import';
import BooleanImport from './boolean/_import';
import ColorImport from './color/_import';
import DateImport from './date/_import';
import EntityImport from './entity/_import';
import EnumImport from './enum/_import';
import ListImport from './list/_import';
import ManyImport from './many/_import';
import MapImport from './map/_import';
import NullImport from './null/_import';
import NumberImport from './number/_import';
import ObjectImport from './object/_import';
import OptionalImport from './optional/_import';
import SetImport from './set/_import';
import TextImport from './text/_import';
import TupleImport from './tuple/_import';

export default function(registry: Registry)
{
  registry
    
    .import(AnyImport)
    .import(BooleanImport)
    .import(ColorImport)
    .import(DateImport)
    .import(EntityImport)
    .import(EnumImport)
    .import(ListImport)
    .import(ManyImport)
    .import(MapImport)
    .import(NullImport)
    .import(NumberImport)
    .import(ObjectImport)
    .import(OptionalImport)
    .import(SetImport)
    .import(TextImport)
    .import(TupleImport)
  ;
}
