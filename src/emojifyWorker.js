import emojifier from './emojify';
import promiseWorker from './promiseWorker';

const worker = promiseWorker({
  internal: {
    emojify: emojifier,
    execute: function(self, data) {
      const mapping = data.args[0];
      const scale = data.args[1];
      const imageData = data.args[2];
      self.postMessage({
        action: 'done',
        data: { id: data.id, emojifiedData: this.emojify(mapping, scale, imageData) }
      });
    }
  },
  external: {
    done: (worker, data, context) => {
      context.resolvers[data.id](data.emojifiedData);
      delete context.resolvers[data.id];
    }
  }
});

export default (mapping, scale, imageData) => worker('execute', mapping, scale, imageData);
