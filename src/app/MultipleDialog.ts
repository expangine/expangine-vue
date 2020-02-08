

export function getMultipleDialoger<T extends { visible: boolean }>(state: T)
{
  const stack: T[] = [];

  const dialoger = 
  {
    open(opener: () => boolean | void)
    {
      if (state.visible) 
      {
        stack.push(Object.assign({}, state));
      }

      if (opener() === false)
      {
        if (state.visible)
        {
          stack.pop();
        }
        
        return;
      }

      state.visible = true;
    },
    close()
    {
      const last = stack[stack.length - 1];

      if (last)
      {
        stack.pop();

        Object.assign(state, last);
      }
      else
      {
        state.visible = false;
      }
    },
  };

  return dialoger;
}
