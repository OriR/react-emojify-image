import React from 'react';
import EmojifyImageCustom from './EmojifyImageCustom';
import emojis from './emojis';

const EmojifyImage = (props) => <EmojifyImageCustom emojis={ emojis } { ...props }/>;
const originalPropNames = Object.keys(EmojifyImageCustom.propTypes);
const originalProps = Object.assign({}, EmojifyImageCustom.propTypes);
const _reduce = (array, reducer, seed) => array.reduce((...args) => { reducer(...args); return args[0] }, seed);

EmojifyImage.propTypes = _reduce(originalPropNames, (props, key) => key === 'emojis' && delete props[key], originalProps);

export default EmojifyImage;

