const emojify = (mapping, scale, imageData) => {
  const emojifiedData = [];
  const channels = ['red', 'green', 'blue', 'alpha'];

  const _reduce = (array, reducer, seed) => array.reduce((...args) => {
    reducer(...args);
    return args[0];
  }, seed);

  const distance = (colorA, colorB) => {
    return Math.sqrt(
      Math.pow(colorA.red - colorB.red, 2) +
      Math.pow(colorA.green - colorB.green, 2) +
      Math.pow(colorA.blue - colorB.blue, 2) +
      Math.pow(colorA.alpha - colorB.alpha, 2));
  };

  for(let row = 0; row < imageData.height; row += scale) {
    for(let col = 0; col < imageData.width; col += scale) {
      const sums = { red: 0, green: 0, blue: 0, alpha: 0, total: 0 };

      for(let pixelRowIndex = 0; pixelRowIndex < scale;pixelRowIndex++) {
        for(let pixelColIndex = 0; pixelColIndex < scale;pixelColIndex++) {
          const pixelIndex = (pixelColIndex + col + (row + pixelRowIndex) * imageData.width) * 4;
          const pixel = _reduce(channels,(pixel, channel, index) => pixel[channel] = imageData.data[index + pixelIndex], {});
          channels.forEach(channel => {
            sums[channel] += Number(pixel[channel]);
          });
          sums.total++;
        }
      }

      const color = _reduce(channels, (color, channel) => color[channel] = sums[channel] / sums.total, {});

      const closest = mapping.reduce((closest, current) => {
        const currentDistance = distance(current.color, color);

        if(closest.distance > currentDistance) {
          return Object.assign({}, current, { distance: currentDistance });
        }

        return closest;
      }, Object.assign({}, mapping[0], {distance: distance(mapping[0].color, color)}));

      emojifiedData.push({ emoji: closest.emoji, x: col, y: row + scale });
    }
  }

  return emojifiedData;
};

export default emojify;