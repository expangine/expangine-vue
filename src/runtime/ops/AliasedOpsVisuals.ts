import { AliasedOps } from 'expangine-runtime';
import { Registry } from '../Registry';


export default (registry: Registry) =>
{

  registry.addOperation(AliasedOps.newInstance, {
    name: 'Create user-defined Type',
    description: 'Create a new instance of the user-defined type [name].',
    singleline: 'new {name}',
    comments: {
      name: 'The name of the user-defined type to create',
    },
    returnComments: 'A new instance of [name].',
  });

};
