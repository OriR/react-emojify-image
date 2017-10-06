import React from 'react';
import EmojifyImageCustom from './EmojifyImageCustom';
import emojis from './emojis';

const EmojifyImage = (props) => <EmojifyImageCustom emojis={ emojis } { ...props }/>;

EmojifyImage.propTypes = { ...EmojifyImageCustom.propTypes };
delete EmojifyImage.propTypes.emojis;

export default EmojifyImage;

