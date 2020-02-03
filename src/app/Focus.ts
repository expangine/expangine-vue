
import { DirectiveOptions } from 'vue';


const VISIBILITY_ANIMATION_TIME = 200;
type VisibleElement = HTMLElement & { _visible: boolean | number };

export const FocusOnVisible: DirectiveOptions = {
  bind(el, binding) {
    handleFocus(el as VisibleElement, binding.value, binding.modifiers.last);
  },
  update(el, binding) {
    handleFocus(el as VisibleElement, binding.value, binding.modifiers.last);
  },
};

export const FocusOnCreate: DirectiveOptions = {
  bind(el, binding) {
    handleFocus(el as VisibleElement, [true, binding.value || 'self'], binding.modifiers.last);
  },
};

export const FocusOnChange: DirectiveOptions = {
  bind(el, binding) {
    handleFocus(el as VisibleElement, binding.value, binding.modifiers.last);
  },
  update(el, binding) {
    handleFocus(el as VisibleElement, binding.value, binding.modifiers.last);
  },
};

let timeout = -1;

function handleFocus(el: VisibleElement, [visible, query]: [boolean | number, string], last: boolean = false) 
{
  if (visible && visible !== el._visible && (last || timeout === -1)) 
  {
    if (last && timeout !== -1)
    {
      window.clearTimeout(timeout);
      timeout = -1;
    }

    timeout = window.setTimeout(() => 
    {
      const found = query === 'self'
        ? el
        : el.querySelector(query);

      if (found instanceof HTMLElement && document.activeElement !== found) 
      {
        found.focus();

        if (found instanceof HTMLInputElement)
        {
          found.select();
        }
      }

      timeout = -1;

    }, VISIBILITY_ANIMATION_TIME);    
  }

  el._visible = visible;
}
