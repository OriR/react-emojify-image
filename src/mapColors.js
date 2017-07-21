const RGBtoHSL = (component) => {
  const normalR = component.red / 255;
  const normalG = component.green / 255;
  const normalB = component.blue / 255;
  const max = Math.max(normalR, normalG, normalB);
  const min = Math.min(normalR, normalG, normalB);
  const diff = max - min;

  const L = (max + min) / 2;
  const S = diff / (1 - Math.abs(2 * L - 1));
  const H = (diff === 0 ? 0 : max === normalR ? ((normalG - normalB) / diff) % 6 : max === normalG ? ((normalB - normalR)/diff + 2) : ((normalR - normalG) / diff) + 4) * 60;

  return {H, S, L};
};

const getImageData = (emojis) => {
  const canvas = document.createElement('canvas');
  canvas.width = `${emojis.length * 50}`;
  canvas.height = '60';
  const context = canvas.getContext('2d');

  context.font = '50px sans-serif';
  context.fillText(emojis.join(''),0,50);

  return context.getImageData(0,0,emojis.length * 50,60);
};

const mapEmojisToColor = (totalEmojis, getImageData) => {
  return new Promise(resolve => {
    const promises = [];
    const channels = ['red', 'green', 'blue', 'alpha'];
    const _reduce = (array, reducer, seed) => array.reduce((...args) => {
        reducer(...args);
        return args[0];
      }, seed);

    // For some reason when there are too many emojis rendered to the canvas it fails evaluating all of them.
    // We split the emojis array to chunks of 500 emojis to make sure it works.
    for(let sliceIndex = 0; sliceIndex < totalEmojis.length; sliceIndex += 500){
      const emojis = totalEmojis.slice(sliceIndex, sliceIndex + 500);
      promises.push(getImageData(emojis).then(data => {
        const partialMapping = [];
        for(let emojiIndex = 0; emojiIndex < emojis.length; emojiIndex++) {
          const sums = { red: 0, green: 0, blue: 0, alpha: 0, total: 0 };

          for(let rowIndex = 0; rowIndex < 60; rowIndex++) {
            for(let columnIndex = 0; columnIndex < 50; columnIndex++) {
              const pixelIndex = (columnIndex + emojiIndex * 50 + rowIndex * data.width) * 4;
              const pixel = _reduce(channels,(pixel, channel, index) => pixel[channel] = data.data[index + pixelIndex], {});

              if(pixel.red === 0 && pixel.green === 0 && pixel.blue === 0 && pixel.alpha === 0) continue;

              channels.forEach(channel => sums[channel] += Number(pixel[channel]));
              sums.total++;
            }
          }
          const color = _reduce(channels, (color, channel) => color[channel] = sums[channel] / sums.total, {});

          partialMapping.push({ emoji: emojis[emojiIndex], color });
        }
        return partialMapping;
      }));
    }

    Promise.all(promises).then(partialMappings => {
      resolve(partialMappings.reduce((mapping, partial) => mapping.concat(partial), []));
    });
  });
};

export default { mapEmojisToColor, getImageData };
