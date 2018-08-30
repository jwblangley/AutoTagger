module.exports.generateColors = generateColors;

function randBetween(i, j) {
  //Pre: i < j
  return Math.floor((Math.random() * (j - i)) + i);
}

const GREY_CONTROL = 0.05;


function generateColors(imageSrc, numToGen, colFunc) {
  getImg(imageSrc, (img) => pickColorsFromImage(img, 3, numToGen, colFunc));
}

function getImg(imageSrc, imgFunc) {
  var img = new Image();
  img.src = imageSrc;
  img.crossOrigin = "Anonymous";
  img.setAttribute('crossOrigin', '');
  img.onload = () => imgFunc(img);
}

function pickColorsFromImage(img, numToPick, numToGen, colFunc) {
  const borderRemoval = 0.1;

  var canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

  var cols = [];
  for (var i = 0; i < numToPick; i++) {
    var x = randBetween(borderRemoval * img.width,
      img.width - (borderRemoval * img.width));
    var y = randBetween(borderRemoval * img.height,
      img.height - (borderRemoval * img.height));
    cols[i] = canvas.getContext('2d')
      .getImageData(x, y, 1, 1).data;
  }

  colFunc(triadMixing(cols, numToGen, GREY_CONTROL));
}
// Inspired by
// http://devmag.org.za/2012/07/29/how-to-choose-colours-procedurally-algorithms
function triadMixing(inputCols, numOutputs, greyControl) {
  var outCols = [];
  for (var i = 0; i < numOutputs; i++) {
    var randomIndex = randBetween(0, 3);

    var mixRatio0 =
    (randomIndex === 0) ? Math.random() * greyControl : Math.random();

    var mixRatio1 =
    (randomIndex === 1) ? Math.random() * greyControl : Math.random();

    var mixRatio2 =
    (randomIndex === 2) ? Math.random() * greyControl : Math.random();

    var sum = mixRatio0 + mixRatio1 + mixRatio2;

    mixRatio0 /= sum;
    mixRatio1 /= sum;
    mixRatio2 /= sum;

    outCols[i] = [
      Math.floor(mixRatio0 * inputCols[0][0] + mixRatio1 * inputCols[1][0] + mixRatio2 * inputCols[2][0]),
      Math.floor(mixRatio0 * inputCols[0][1] + mixRatio1 * inputCols[1][1] + mixRatio2 * inputCols[2][1]),
      Math.floor(mixRatio0 * inputCols[0][2] + mixRatio1 * inputCols[1][2] + mixRatio2 * inputCols[2][2]),
      255
    ];
  }

  return outCols;
}
