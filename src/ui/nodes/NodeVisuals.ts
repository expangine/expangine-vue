import { Registry } from '@/runtime/Registry';
import { Type } from 'expangine-runtime';
import { NodeTemplateChild } from 'expangine-ui';
import { VueConstructor } from 'vue';
import { NodePreview } from './NodePreview';


export interface NodeVisuals
{
  name: string;
  getPreviews: (registry: Registry) => NodePreview[];
  isValid: (node: NodeTemplateChild, registry: Registry) => boolean;
  label: (node: NodeTemplateChild, registry: Registry) => string;
  editor: VueConstructor;
  viewer: VueConstructor;
}

export interface NodeDraggable
{
  id: number;
  node: NodeTemplateChild;
}

export interface NodeSelection
{
  node: NodeTemplateChild;
  context: Type;
  children?: NodeTemplateChild[];
  childIndex?: number;
}
