const debounce = (debouncedFunc, time) => {
    let timeOut;
  
    return function () {
      const fnCall = () => {
        debouncedFunc.apply(this, arguments);
      };
  
      clearTimeout(timeOut);
  
      timeOut = setTimeout(fnCall, time);
    };
  };

export {debounce};