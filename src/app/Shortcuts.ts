import { DirectiveOptions } from 'vue';
import { Promiser, getPromiser } from './Promiser';
import { isFunction, isString } from 'expangine-runtime';


export type ShortcutListenerCallback = (e: KeyboardEvent) => any;

export type ShortcutListener = ShortcutListenerCallback | {
  handler: ShortcutListenerCallback;
  outside?: string;
  inside?: string;
  matches?: string;
  not?: string;
};

export function isShortcutListenerCallback(listener: ShortcutListener): listener is ShortcutListenerCallback
{
  return isFunction(listener);
}

export type ShortcutModifiers = 'ctrl' | 'alt' | 'shift';

export type Shortcut = Record<ShortcutModifiers, boolean> & { key: number };

export type ShortcutCode = string;

export interface ShortcutContext
{
  id?: string;
  downs?: Record<ShortcutCode, ShortcutListener>;
  ups?: Record<ShortcutCode, ShortcutListener>;
}

export function newShortcut()
{
  return {
    key: -1,
    shift: false,
    alt: false,
    ctrl: false,
  };
}

export class Shortcuts 
{
  public static enabled: boolean = true;
  public static capturing: boolean = false;
  public static captured: Shortcut = newShortcut();
  public static capturer: Promiser<Shortcut> = getPromiser<Shortcut>();
  public static blocked: string = '';
  public static blockedKeys: Record<number, boolean> = {};

  public static modifiers: Record<string, ShortcutModifiers> = {
    16:  'shift',
    17:  'ctrl',
    18:  'alt', 
    91:  'ctrl',
    92:  'ctrl',
    93:  'ctrl',
    224: 'ctrl',
  };

  public static names: Record<number, [string, string, string]> = {
    8:   ['Backspace', '\b', '\b'],
    9:   ['Tab', '\t', '\t'],
    13:  ['Enter', '\r', '\r'],
    16:  ['Shift', '', ''],
    17:  ['Ctrl', '', ''],
    18:  ['Alt', '', ''],
    19:  ['Pause/Break', '', ''],
    20:  ['Caps Lock', '', ''],
    27:  ['Escape', '', ''],
    33:  ['Page Up', '', ''],
    34:  ['Page Down', '', ''],
    35:  ['End', '', ''],
    36:  ['Home', '', ''],
    37:  ['Left Arrow', '', ''],
    38:  ['Up Arrow', '', ''],
    39:  ['Right Arrow', '', ''],
    40:  ['Down Arrow', '', ''],
    45:  ['Insert', '', ''],
    46:  ['Delete', '', ''],
    48:  ['0', '0', ')'],
    49:  ['1', '1', '!'],
    50:  ['2', '2', '@'],
    51:  ['3', '3', '#'],
    52:  ['4', '4', '$'],
    53:  ['5', '5', '%'],
    54:  ['6', '6', '^'],
    55:  ['7', '7', '&'],
    56:  ['8', '8', '*'],
    57:  ['9', '9', '('],
    65:  ['A', 'a', 'A'],
    66:  ['B', 'b', 'B'],
    67:  ['C', 'c', 'C'],
    68:  ['D', 'd', 'D'],
    69:  ['E', 'e', 'E'],
    70:  ['F', 'f', 'F'],
    71:  ['G', 'g', 'G'],
    72:  ['H', 'h', 'H'],
    73:  ['I', 'i', 'I'],
    74:  ['J', 'j', 'J'],
    75:  ['K', 'k', 'K'],
    76:  ['L', 'l', 'L'],
    77:  ['M', 'm', 'M'],
    78:  ['N', 'n', 'N'],
    79:  ['O', 'o', 'O'],
    80:  ['P', 'p', 'P'],
    81:  ['Q', 'q', 'Q'],
    82:  ['R', 'r', 'R'],
    83:  ['S', 's', 'S'],
    84:  ['T', 't', 'T'],
    85:  ['U', 'u', 'U'],
    86:  ['V', 'v', 'V'],
    87:  ['W', 'w', 'W'],
    88:  ['X', 'x', 'X'],
    89:  ['Y', 'y', 'Y'],
    90:  ['Z', 'z', 'Z'],
    91:  ['Left Window Key/Command', '', ''],
    92:  ['Right Window Key/Command', '', ''],
    93:  ['Select/Command', '', ''],
    96:  ['Numpad 0', '0', 'Numpad 0'],
    97:  ['Numpad 1', '1', 'Numpad 1'],
    98:  ['Numpad 2', '2', '2'],
    99:  ['Numpad 3', '3', '3'],
    100: ['Numpad 4', '4', '4'],
    101: ['Numpad 5', '5', '5'],
    102: ['Numpad 6', '6', '6'],
    103: ['Numpad 7', '7', '7'],
    104: ['Numpad 8', '8', '8'],
    105: ['Numpad 9', '9', '9'],
    106: ['Multiply', '*', '*'],
    107: ['Add', '+', '+'],
    109: ['Subtract', '-', '-'],
    110: ['Period', '.', '.'],
    111: ['Divide', '/', '/'],
    112: ['F1', '', ''],
    113: ['F2', '', ''],
    114: ['F3', '', ''],
    115: ['F4', '', ''],
    116: ['F5', '', ''],
    117: ['F6', '', ''],
    118: ['F7', '', ''],
    119: ['F8', '', ''],
    120: ['F9', '', ''],
    121: ['F10', '', ''],
    122: ['F11', '', ''],
    123: ['F12', '', ''],
    144: ['Num Lock', '', ''],
    145: ['Scroll Lock', '', ''],
    186: ['Semi-Colon', ';', ':'],
    187: ['Equal Sign', '=', '+'],
    188: ['Comma', ',', '<'],
    189: ['Dash', '-', '_'],
    190: ['Period', '.', '>'],
    191: ['Forward Slash', '/', '?'],
    192: ['Grave Accent', '`', '~'],
    219: ['Open Bracket', '[', '{'],
    220: ['Back Slash', '\\', '|'],
    221: ['Close Bracket', ']', '}'],
    222: ['Single Quote', '\'', '"'],
  };

  public static codeFromShortcut(s: Shortcut): ShortcutCode
  {
    return s.key + 
      (s.alt ? 'a' : '_') + 
      (s.shift ? 's' : '_') + 
      (s.ctrl ? 'c' : '_');
  }
    
  public static codeFromEvent(e: KeyboardEvent): ShortcutCode
  {
    return e.which + 
      (e.altKey ? 'a' : '_') + 
      (e.shiftKey ? 's' : '_') + 
      (e.ctrlKey  || e.metaKey ? 'c' : '_');
  }
   
  public static nameFromShortcut(s: Shortcut): string
  {
    return (s.ctrl ? 'Ctrl + ' : '') +
      (s.alt ? 'Alt + ' : '') +
      (s.shift ? 'Shift + ' : '') +
      Shortcuts.keyName(s.key, '?');
  }

  public static keyName(key: number, missing: string = '')
  {
    return key in Shortcuts.names
      ? Shortcuts.names[key][0]
      : missing;
  }

  public static keyChar(key: number, shift: boolean, missing: string = '')
  {
    return key in Shortcuts.names
      ? Shortcuts.names[key][shift ? 2 : 1]
      : missing;
  }

  public static shortcutFromCode(c: ShortcutCode): Shortcut 
  {
    const shortcut = newShortcut();
    const parts = /^(\d+)(_|a)(_|s)(_|c)$/.exec(c);

    if (parts) 
    {
      const [, key, alt, shift, ctrl] = parts;
      shortcut.key = parseInt(key, 10);
      shortcut.alt = alt !== '_';
      shortcut.shift = shift !== '_';
      shortcut.ctrl = ctrl !== '_';
    }

    return shortcut;
  }

  public static nameFromCode(c: ShortcutCode): string
  {
    return Shortcuts.nameFromShortcut(Shortcuts.shortcutFromCode(c));
  }

  public static isBlocked(e: KeyboardEvent) 
  {
    if (!Shortcuts.enabled) 
    {
      return true;
    }

    if (Shortcuts.blockedKeys[e.which]) 
    {
      return true;
    }

    if (e.target instanceof HTMLElement && Shortcuts.blocked) 
    {
      if (e.target.closest(Shortcuts.blocked) !== null) 
      {
        return true;
      }
    }

    return false;
  }


  public static captureDown(e: KeyboardEvent)
  {
    const key = e.which;

    if (key in Shortcuts.modifiers) {
      Shortcuts.captured[Shortcuts.modifiers[key]] = true;
    } else {
      Shortcuts.captured.key = key;
      Shortcuts.capturing = false;
      Shortcuts.capturer.resolve(Shortcuts.captured);
    }

    Shortcuts.cancel(e);
  }

  public static captureUp(e: KeyboardEvent)
  {
    const key = e.which;

    if (key in Shortcuts.modifiers) 
    {
      Shortcuts.captured[Shortcuts.modifiers[key]] = false;
    }

    Shortcuts.cancel(e);
  }

  public static capture()
  {
    Shortcuts.capturing = true;
    Shortcuts.captured = newShortcut();
    Shortcuts.capturer = getPromiser<Shortcut>();

    return Shortcuts.capturer.promise;
  }

  public static cancel(e: KeyboardEvent) 
  {
    e.preventDefault();
    e.stopPropagation();
  }

  public contexts: ShortcutContext[] = [];
  public listening: boolean = false;
  public element: GlobalEventHandlers;
  public keydown: (e: KeyboardEvent) => false | undefined;
  public keyup: (e: KeyboardEvent) => false | undefined;

  public constructor(element: GlobalEventHandlers)
  {
    this.element = element;

    this.keydown = (e) => {
      window.console.log(Shortcuts.nameFromCode(Shortcuts.codeFromEvent(e)));

      if (Shortcuts.isBlocked(e)) {
        return;
      }
      if (Shortcuts.capturing) {
        Shortcuts.captureDown(e);
      } else {
        for (const context of this.contexts) {
          if (context.downs && this.handle(e, context.downs)) {
            return false;
          }
        }
      }
    };

    this.keyup = (e) => {
      if (Shortcuts.isBlocked(e)) {
        return;
      }
      if (Shortcuts.capturing) {
        Shortcuts.captureUp(e);
      } else {
        for (const context of this.contexts) {
          if (context.ups && this.handle(e, context.ups)) {
            return false;
          }
        }
      }
    };
  }
  
  public handle(e: KeyboardEvent, map: Record<string, ShortcutListener>)
  {
    const code = Shortcuts.codeFromEvent(e);

    if (code in map) 
    {
      const listener = map[code];

      if (this.invoke(e, listener) !== false) 
      {
        Shortcuts.cancel(e);

        return true;
      }
    }

    return false;
  }

  public invoke(e: KeyboardEvent, listener: ShortcutListener)
  {
    if (isShortcutListenerCallback(listener)) 
    {
      return listener(e);
    }

    if (e.target instanceof HTMLElement) 
    {
      if (isString(listener.outside)) 
      {
        if (e.target.closest(listener.outside)) 
        {
          return false;
        }
      }

      if (isString(listener.inside)) 
      {
        if (!e.target.closest(listener.inside)) 
        {
          return false;
        }
      }

      if (isString(listener.matches)) 
      {
        if (!e.target.matches(listener.matches)) 
        {
          return false;
        }
      }

      if (isString(listener.not)) 
      {
        if (e.target.matches(listener.not)) 
        {
        return false;
        }
      }
    } 
    else if (isString(listener.matches) || isString(listener.inside)) 
    {
      return false;
    }

    return listener.handler(e);
  }

  public enable()
  {
    if (!this.listening) 
    {
      this.element.addEventListener('keydown', this.keydown);
      this.element.addEventListener('keyup', this.keyup);
      this.listening = true;
    }
  }

  public addContext(context: ShortcutContext) 
  {
    this.enable();

    this.removeContext(context, false);
    this.contexts.push(context);
  }

  public removeContext(context: ShortcutContext, destroy: boolean = true)
  {
    const i = this.contexts.findIndex((c) => c.id === context.id);

    if (i !== -1) 
    {
      this.contexts.splice(i, 1);
    }

    if (destroy && this.contexts.length === 0)
    {
      this.element.removeEventListener('keydown', this.keydown);
      this.element.removeEventListener('keyup', this.keyup);
      this.listening = false;
    }
  }

}

const DocumentShortcuts: Shortcuts = new Shortcuts(document);
const ShortcutsMap: Record<string, Shortcuts> = {};

export const ShortcutDirective: DirectiveOptions = 
{
  bind(el, binding) 
  {
    const context: ShortcutContext = binding.value;

    let id = context.id || el.getAttribute('id');

    if (!id || id in ShortcutsMap) 
    {
      id = 'shortcuts' + Math.floor(Math.random() * 2147483647);
    }

    el.setAttribute('id', context.id = id);

    const shortcuts = binding.modifiers.document
      ? DocumentShortcuts
      : ShortcutsMap[id] = new Shortcuts(el);

    shortcuts.addContext(context);
  },
  update(el, binding) 
  {
    const context: ShortcutContext = binding.value;

    if (context !== binding.oldValue) 
    {
      context.id = el.getAttribute('id') as string;

      const shortcuts = binding.modifiers.document
        ? DocumentShortcuts
        : ShortcutsMap[context.id];
       
      shortcuts.addContext(binding.value);
    }
  },
  unbind(el, binding) 
  {
    const id = el.getAttribute('id') as string;
    const context: ShortcutContext = binding.value;
    const shortcuts = binding.modifiers.document
        ? DocumentShortcuts
        : ShortcutsMap[id];

    shortcuts.removeContext(context);

    if (!shortcuts.listening)
    {
      delete ShortcutsMap[id];
    }
  },
};
