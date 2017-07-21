# react-emojify-image
> pixelating an image, with emojis.

<p align="center">🤷‍♂️ </p>

![shrug](https://user-images.githubusercontent.com/2384068/28470161-7f9e8e2e-6e41-11e7-8cb1-1c781485c822.png)

### Demo
You can check out the demo [here](http://orir.github.io/react-emojify-image).

### Install
```
npm install --save react-emojify-image
```
### Usage
```js
import EmojifyImage from 'react-emojify-image';

class Emojified extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      loaded: false
    };
  }
  render({ imgURL, scale }) {
    return (
      <div>
        <img src={imgURL} ref={(_) => (this.img = _)} onLoad={() => this.setState({loaded: true})}/>
        { this.state.loaded && <EmojifyImage scale={10} scale={scale} image={createImageBitmap(this.img)}/> }
      </div>
    );
  }
}
```
`react-emojify-image` uses ES2015+ `import/export` syntax, and other features.</br>
Meaning, you have to use a bundler of some sort along with the package, but nowadays who doesn't?

#### props

name | type | default | required | description
---- | :----: | :-------: | :--------: | -----------
**image** | ImageBitmap |  | yes | An ImageBitmap object of the actual image to use.</br></br>The easiest way to get this object is to use `createImageBitmap()`.</br></br>It gets an image source, which can be an <img>, SVG <image>, <video>, OffscreenCanvas, or <canvas> element, a Blob, ImageData, or another ImageBitmap object.
**scale** | Number | 15 | no | The number of (scale X scale) pixels to replace with one emoji.
**loader** | Function | `() => <span>Loading...</span>` | no | The loader component to render when either remapping colors to emojis or when emojifying the image.

### FAQ
* > How can I load other emojis?
  * Simple! you can use `import { EmojifyImageCustom } from 'react-emojify-image'`. It's the same thing but it also has an `emojis` prop which is an array of strings. </br> This serves as the list of emojis to use when reconstructing the image.
* > This package is really big! can you make it smaller?
  * Well, this concerns the last question. You can supply a different set of emojis to use. Also, this was built in a way that tree-shaking can do it's magic. if you'll load `EmojifyImageCustom` you won't get the entire list of predefined emojis, making this rather small.
* > What are the supported browsers on this thing?
  * Chrome and Firefox. Unfortunately Safari doesn't support `ImageBitmap` which is used here as a base class to create all image types.</br>
  Maybe later support for other browsers will be added.
* > Hmmm... but why?
  * Why not?

### Contributing
Feel free to open issues and pull requests if you have any other cool ideas for this project :)
