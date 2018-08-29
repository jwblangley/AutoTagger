import PixelColor from 'react-native-pixel-color';

// Usage as below

PixelColor.getHex(imageUriOrData, { x, y }).then((color) => {
  // #000000
}).catch((err) => {
  // Oops, something went wrong. Check that the filename is correct and
  // inspect err to get more details.
});
