import { TypeBuilderWrapper } from '../TypeBuilder';


export const DefaultWrapper: TypeBuilderWrapper =
{
  getOption: () => ({
    text: 'One',
    priority: 1,
    value: async ([result]) => result,
  }),
};