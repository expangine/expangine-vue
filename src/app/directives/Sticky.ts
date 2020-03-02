import { DirectiveOptions } from 'vue';
import { isString } from 'expangine-runtime';

interface Sticky {
  x: boolean;
  y: boolean;
  target: boolean | undefined | string;
  lastTarget: HTMLElement | null;
  listener: () => void;
}

type HTMLElementWithSticky = HTMLElement & { __sticky: Sticky };

const SCROLL_REGEX = /(auto|scroll)/;
const SCROLL_OPTIONS: AddEventListenerOptions = { capture: true, passive: true };
const RESIZE_OPTIONS: AddEventListenerOptions = { capture: true };

export const StickyDirective: DirectiveOptions = 
{
  bind(el, binding) 
  {
    const els = el as HTMLElementWithSticky;

    const sticky: Sticky = {
      x: binding.modifiers.x,
      y: binding.modifiers.y,
      target: binding.value,
      lastTarget: null,
      listener: () => {
        const target = sticky.target === false
          ? null
          : isString(sticky.target)
            ? el.querySelector(sticky.target) as HTMLElement
            : el;

        if (target !== sticky.lastTarget) {
          if (sticky.lastTarget) {
            sticky.lastTarget.style.position = '';
            if (sticky.y) {
              sticky.lastTarget.style.top = '';
            }
            if (sticky.x) {
              sticky.lastTarget.style.left = '';
            }
          }
          sticky.lastTarget = target;
        }
        
        if (target && target.parentElement) {
          const bounds = target.getBoundingClientRect();
          const container = target.parentElement.getBoundingClientRect();
          const scrollContainer = getScrollParent(target);
          const viewport = scrollContainer.getBoundingClientRect();

          target.style.position = 'relative';
          target.style.transition = 'top 0.5s, left 0.5s';

          if (sticky.y) {
            const maxTop = viewport.top - container.top;
            const minTop = container.height - bounds.height;
            const top = maxTop < 0 ? 0 : Math.min(maxTop, minTop);

            target.style.top = `${top}px`;
          }
          
          if (sticky.x) {
            const maxLeft = viewport.left - container.left;
            const minLeft = container.width - bounds.width;
            const left = maxLeft < 0 ? 0 : Math.min(maxLeft, minLeft);

            target.style.left = `${left}px`;
          }
        }
      },
    };

    els.__sticky = sticky;
    els.__sticky.listener();

    document.addEventListener('scroll', els.__sticky.listener, SCROLL_OPTIONS);
    document.addEventListener('resize', els.__sticky.listener, RESIZE_OPTIONS);
  },
  update(el, binding) {
    if (binding.value !== binding.oldValue) {
      const els = el as HTMLElementWithSticky;

      els.__sticky.target = binding.value;
      els.__sticky.listener();
    }
  },
  unbind(el) {
    const els = el as HTMLElementWithSticky;

    document.removeEventListener('scroll', els.__sticky.listener, SCROLL_OPTIONS);
    document.removeEventListener('resize', els.__sticky.listener, RESIZE_OPTIONS);
  },
};

function getScrollParent(el: HTMLElement | null): HTMLElement
{
  return !el || el === document.body
    ? document.body
    : canScroll(el)
      ? el
      : getScrollParent(el.parentElement);
}

function canScroll(el: HTMLElement)
{
  return SCROLL_REGEX.test(
    getStyle(el, 'overflow') + 
    getStyle(el, 'overflow-x') + 
    getStyle(el, 'overflow-y'),
  );
}

function getStyle(el: HTMLElement, prop: string)
{
  return getComputedStyle(el, null).getPropertyValue(prop);
}
