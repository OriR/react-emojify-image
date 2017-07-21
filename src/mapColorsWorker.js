import mapper from './mapColors';
import promiseWorker from './promiseWorker';

const worker = promiseWorker({
    internal: {
      map: mapper.mapEmojisToColor,
      init: function(self, context) {
        context.id = 0;
        context.resolvers = {};
      },
      getImageData: function (self, data, context) {
        context.resolvers[data.id](data.image);
        delete context.resolvers[data.id];
      },
      execute: function (self, data, context) {
        const emojis = data.args[0];
        this.map(emojis,
          (emojis) => new Promise(resolve => {
            const id = context.id;
            context.id++;
            context.resolvers[id] = resolve;
            self.postMessage({ action: 'getImageData', data: { id, emojis } });
          })
        ).then(mapping => {
          self.postMessage({ action: 'done', data: { id: data.id, mapping } });
        });
      }
    },
    external: {
      getImageData: (worker, data) => {
        worker.postMessage({
          action: 'getImageData',
          data: {id: data.id, image: mapper.getImageData(data.emojis)}
        });
      },
      done: (worker, data, context) => {
        context.resolvers[data.id](data.mapping);
        delete context.resolvers[data.id];
      }
    }
  }
);

export default (emojis) => worker('execute', emojis);