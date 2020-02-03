
import { DirectiveOptions } from 'vue';


const VISIBILITY_ANIMATION_TIME = 300;

export const FocusOnVisible: DirectiveOptions = {
  bind(el, binding) {
    handleFocus(el, binding.value);
  },
  update(el, binding) {
    handleFocus(el, binding.value);
  },
};

function handleFocus(el: HTMLElement, [visible, query]: [boolean, string]) 
{    
  if (visible) 
  {
    setTimeout(() => 
    {
      const found = query === 'self'
        ? el
        : el.querySelector(query);

      if (found instanceof HTMLElement) 
      {
        found.focus();

        if (found instanceof HTMLInputElement)
        {
          found.select();
        }
      }
    }, VISIBILITY_ANIMATION_TIME);    
  }
}
