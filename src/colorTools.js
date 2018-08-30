import PixelColor from 'react-native-pixel-color';

// Usage as below

PixelColor.getHex(imageUriOrData, { x, y }).then((color) => {
  // #000000
}).catch((err) => {
  console.log("Error getting pixel colour\n" + err);
});

function pickColors(image) {

}
