
function randBetween(i, j) {
  //Pre: i < j
  return Math.floor((Math.random() * (j - i)) + i);
}


function generateColors(imageSrc) {
  getImg(imageSrc, (img) => pickColorsFromImage(img, 3));
}

function getImg(imageSrc, imgFunc) {
  var img = new Image();
  img.src = imageSrc;
  img.crossOrigin = "Anonymous";
  img.setAttribute('crossOrigin', '');
  img.onload = () => imgFunc(img);
}

function pickColorsFromImage(img, numCols) {
  const borderRemoval = 0.1;

  var canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

  var cols = [];
  for (var i = 0; i < numCols; i++) {
    var x = randBetween(borderRemoval * img.width,
      img.width - (borderRemoval * img.width));
    var y = randBetween(borderRemoval * img.height,
      img.height - (borderRemoval * img.height));
    cols[i] = canvas.getContext('2d')
      .getImageData(x, y, 1, 1).data;
  }
  console.log(cols);
}



module.exports.generateColors = generateColors;
