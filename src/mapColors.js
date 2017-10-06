const getImageData = (totalEmojis) => {
  const canvas = document.createElement('canvas');
  const measureTextContext = document.createElement('canvas').getContext('2d');
  measureTextContext.font = '50px sans-serif';

  return totalEmojis.reduce((totalData, emoji) => {

    const width = Math.ceil(measureTextContext.measureText(emoji).width);
    canvas.width = `${width}`;
    canvas.height = '60';

    const context = canvas.getContext('2d');
    context.font = measureTextContext.font;

    context.fillText(emoji, 0, 50);
    totalData.push({ emoji, data:context.getImageData(0,0,width,60) });
    return totalData;
  }, []);
};

const mapEmojisToColor = (emojisColorData) => {
  const channels = ['red', 'green', 'blue', 'alpha'];
  const _reduce = (array, reducer, seed) => array.reduce((...args) => { reducer(...args); return args[0]; }, seed);

  return _reduce(emojisColorData,(mapping, colorData) => {
    const sums = { red: 0, green: 0, blue: 0, alpha: 0, total: 0 };

    for(let rowIndex = 0; rowIndex < colorData.data.height; rowIndex++) {
      for(let columnIndex = 0; columnIndex < colorData.data.width; columnIndex++) {
        const pixelIndex = (columnIndex + rowIndex * colorData.data.width) * 4;
        const pixel = _reduce(channels,(pixel, channel, index) => pixel[channel] = colorData.data.data[index + pixelIndex], {});

        if(pixel.alpha === 0) continue;

        channels.forEach(channel => sums[channel] += Number(pixel[channel]));
        sums.total++;
      }
    }
    const color = _reduce(channels, (color, channel) => color[channel] = sums[channel] / sums.total, {});

    mapping.push({ emoji: colorData.emoji, color, sums });
  }, []);
};

export default { mapEmojisToColor, getImageData };
