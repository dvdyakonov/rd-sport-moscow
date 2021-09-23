const jsonp = (src, optionsArg) => {
  const options = optionsArg || {};
  const callbackName = options.callbackName || `callback${String(Math.random()).substr(2)}`;
  const onSuccess = options.onSuccess || (() => {});
  const onTimeout = options.onTimeout || (() => {});
  const onError = options.onError || (() => {});
  const timeout = options.timeout || 10;

  const timeoutTrigger = window.setTimeout(() => {
    window[callbackName] = () => {};
    onTimeout();
  }, timeout * 1000);

  window[callbackName] = (data) => {
    window.clearTimeout(timeoutTrigger);
    onSuccess(data);
  };

  const script = document.createElement("script");
  const head = document.getElementsByTagName("head")[0];
  script.type = "text/javascript";
  script.async = true;
  script.src = `${src}&callback=${callbackName}`;
  script.onload = () => {
    head.removeChild(script);
  };
  script.onerror = () => {
    onError();
  };
  head.appendChild(script);
};

export default jsonp;
