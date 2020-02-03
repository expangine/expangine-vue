
import { DirectiveOptions } from 'vue';


const VISIBILITY_ANIMATION_TIME = 300;
type VisibleElement = HTMLElement & { _visible: boolean };

export const FocusOnVisible: DirectiveOptions = {
  bind(el, binding) {
    handleFocus(el as VisibleElement, binding.value);
  },
  update(el, binding) {
    handleFocus(el as VisibleElement, binding.value);
  },
};

function handleFocus(el: VisibleElement, [visible, query]: [boolean, string]) 
{
  if (visible && visible !== el._visible) 
  {
    setTimeout(() => 
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
    }, VISIBILITY_ANIMATION_TIME);    
  }

  el._visible = visible;
}
