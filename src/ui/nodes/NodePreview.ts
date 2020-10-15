import { NodeTemplateChild } from 'expangine-ui';


export interface NodePreview
{
  name: string;
  description: string;
  template: NodeTemplateChild;
  folders?: string[];
  preview?: NodeTemplateChild;
}
