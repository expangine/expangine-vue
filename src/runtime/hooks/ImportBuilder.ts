import { TypeBuilder } from '../types/TypeBuilder';
import { getDescribeData } from '@/app/DescribeData';
import { Exprs } from 'expangine-runtime';


export const ImportBuilder: TypeBuilder = 
{
  getOption: ({ registry }) => ({
    text: 'Import Data',
    description: 'Use JSON / JS to define and populate',
    priority: 15,
    value: async () => {
      const result = await getDescribeData({
        registry,
      });

      if (!result) {
        return false;
      }

      const { type, settings, data } = result;

      return {
        type,
        settings,
        transform: Exprs.const(data),
      };
    },
  }),
};
