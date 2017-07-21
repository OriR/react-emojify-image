import React, { Component } from 'react';
import PropTypes from 'prop-types';

import mapColors from './mapColorsWorker';
import emojify from './emojifyWorker';

/**
 * @class EmojifyImageCustom
 **/
export default class EmojifyImageCustom extends Component {

  _remap(emojis) {
    mapColors(emojis).then(mapping => {
      this.setState({mapping, isLoading: false});
    });
  }

  _redraw(props) {
    if (!this.canvas || this.state.isLoading || this.state.justLoaded) return;

    const context = this.canvas.getContext('2d');

    this.canvas.width = props.image.width;
    this.canvas.height = props.image.height;
    context.drawImage(props.image, 0, 0);
    const imageData = context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.setState({isLoading: true, justLoaded: false});

    emojify(this.state.mapping, props.scale, imageData).then((emojifiedData) => {
      context.font = `${props.scale * 1.3}px sans-serif`;
      emojifiedData.forEach(emojiData => {
        context.fillText(emojiData.emoji, emojiData.x, emojiData.y);
      });
      this.setState({isLoading: false, justLoaded: true});
    });
  }

  /**
   * @constructor EmojifyImageCustom
   **/
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      justLoaded: false
    };

    this._remap(props.emojis);
  }

  componentWillReceiveProps(nextProps) {
    const shouldMapEmojis = nextProps.emojis !== this.props.emojis || nextProps.emojis.length !== this.props.emojis.length;

    if (shouldMapEmojis) {
      this.setState({ isLoading: true });
      this._remap(nextProps.emojis);
    }

    this.setState({ justLoaded: nextProps.scale === this.props.scale && nextProps.image === this.props.image });
  }

  componentDidUpdate() {
    this._redraw(this.props);
  }

  /**
   * Render
   * @returns {XML}
   **/
  render() {
    const Loader = this.props.loader;
    return (
      <div style={{display: 'flex', flexFlow: 'column'}}>
        { this.state.isLoading ? <Loader /> : null }
        <canvas style={{width: this.props.image.width, height: this.props.image.height}} ref={r => (this.canvas = r)}/>
      </div>
    );
  }
}

EmojifyImageCustom.defaultProps = {
  scale: 15,
  loader: () => <span>Loading...</span>
};

EmojifyImageCustom.propTypes = {
  /**
   * An array of emojis to use when emojifying the image.
   */
  emojis: PropTypes.arrayOf(PropTypes.string).isRequired,
  /**
   * An ImageBitmap object of the actual image to use.
   * The easiest way to get this object is to use `createImageBitmap()`.
   * It gets an image source, which can be an <img>, SVG <image>, <video>, OffscreenCanvas, or <canvas> element, a Blob, ImageData, or another ImageBitmap object.
   */
  image: PropTypes.instanceOf(ImageBitmap).isRequired,
  /**
   * The number of (scale X scale) pixels to replace with one emoji.
   */
  scale: PropTypes.number,
  /**
   * The loader component to render when either remapping colors to emojis or when emojifying the image
   */
  loader: PropTypes.func
};