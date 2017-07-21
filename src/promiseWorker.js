/**
 * Builds a web worker from the given actions.
 * `actions.internal` - will be the internal actions of the worker (on the worker thread).
 * `actions.external` - will be the external actions of the worker (on the UI thread).
 *
 * In case `actions.internal.init` exist it will be called once after the creation of the web worker.
 * It will be called with `self` and `context` to initialize the `context`.
 *
 * The returned function is an executor of an action within the web worker.
 * That function returns a Promise that will be called when the web worker action has finished.
 *
 * PAY ATTENTION!
 * Every function in `actions.internal` is being serialized and de-serialized in order to call them from within the web worker.
 * That means that you can't use closures in each of these functions!
 * Even more, you can't use "bleeding edge" JS syntax since babel will compile it and sometimes will create a closure.
 * @param actions
 * @returns {function(*=, ...[*]): Promise}
 */
export default (actions) => {
  const normalizedInternalActions = Object.keys(actions.internal).reduce((newActions, key) => {
    newActions[key] = actions.internal[key].toString();
    return newActions;
  }, {});

  const workerFunction = function() {
    const context = {};
    const actions = {
      build: (self, data) => {
        Object.assign(actions, Object.keys(data).reduce((newData, key) => {
          newData[key] = eval(`(${data[key]})`);
          return newData;
        }, {}));
        (actions.init || (() => {}))(self, context);
      }
    };

    /*eslint-disable no-restricted-globals*/
    self.onmessage = function(message, transferables) {
      actions[message.data.action](self, message.data.data, context, transferables);
    };
    /*eslint-enable no-restricted-globals*/
  };

  const worker = new Worker(URL.createObjectURL(new Blob([`(${workerFunction.toString()})();`], {type: 'application/javascript'})));

  const context = { id: 0, resolvers: {} };

  worker.postMessage({
    action: 'build',
    data: normalizedInternalActions
  });

  worker.onmessage = (message) => {
    actions.external[message.data.action](worker, message.data.data, context);
  };

  return (action, ...args) => new Promise((resolve) => {
    const id = context.id;
    context.resolvers[id] = resolve;
    context.id++;

    worker.postMessage({
      action: action,
      data: { args, id }
    });
  });
};
