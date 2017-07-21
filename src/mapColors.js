const getImageData = (totalEmojis) => {
  const entireData = [];
  // Canvas has a max side length of 32,767 pixels (width and height).
  // Exceeding that size will render the canvas useless (the entire image data becomes corrupted).
  // Since each emoji is drawn on 50 pixels, we can only draw 655 emojis on a single canvas (655 * 50 = 32750).
  // See https://stackoverflow.com/a/11585939 for more information.
  const sliceAmount = 655;

  for(let sliceIndex = 0; sliceIndex < totalEmojis.length; sliceIndex += sliceAmount) {
    const emojis = totalEmojis.slice(sliceIndex, sliceIndex + sliceAmount);
    const canvas = document.createElement('canvas');
    canvas.width = `${emojis.length * 50}`;
    canvas.height = '60';
    const context = canvas.getContext('2d');

    context.font = '50px sans-serif';
    context.fillText(emojis.join(''), 0, 50);
    entireData.push({ emojis, data:context.getImageData(0,0,emojis.length * 50,60) });
  }

  return entireData;
};

const mapEmojisToColor = (emojisColorData) => {
  const channels = ['red', 'green', 'blue', 'alpha'];
  const _reduce = (array, reducer, seed) => array.reduce((...args) => { reducer(...args); return args[0]; }, seed);

  return _reduce(emojisColorData,(mapping, colorData) => {
    const emojiWidth = colorData.data.width / colorData.emojis.length;
    for(let emojiIndex = 0; emojiIndex < colorData.emojis.length; emojiIndex++) {
      const sums = { red: 0, green: 0, blue: 0, alpha: 0, total: 0 };

      for(let rowIndex = 0; rowIndex < colorData.data.height; rowIndex++) {
        for(let columnIndex = 0; columnIndex < emojiWidth; columnIndex++) {
          const pixelIndex = (columnIndex + emojiIndex * emojiWidth + rowIndex * colorData.data.width) * 4;
          const pixel = _reduce(channels,(pixel, channel, index) => pixel[channel] = colorData.data.data[index + pixelIndex], {});

          if(pixel.red === 0 && pixel.green === 0 && pixel.blue === 0 && pixel.alpha === 0) continue;

          channels.forEach(channel => sums[channel] += Number(pixel[channel]));
          sums.total++;
        }
      }
      const color = _reduce(channels, (color, channel) => color[channel] = sums[channel] / sums.total, {});

      mapping.push({ emoji: colorData.emojis[emojiIndex], color });
    }
  }, []);
};

export default { mapEmojisToColor, getImageData };
