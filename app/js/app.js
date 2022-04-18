import { initView } from './view';
import '../css/main.scss';
/**
|--------------------------------------------------
|	Global Var to be use in entire app
|--------------------------------------------------
*/
// our model
const config = {
  scaledWidth: 0,
  scaledHeight: 0,
  scale: 1,
  width: 0,
  height: 0,
  photo: {
    id: '',
    src: '',
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  },
};
const MOVE_SIZE = 5;
const image = new Image();
let editorCanvas;

/**
|--------------------------------------------------
|	Helper
|--------------------------------------------------
*/
function getContext() {
  if (editorCanvas) return editorCanvas.getContext('2d');
}

// setting the config & use later
function setConfig(canvas) {
  config.width = canvas.width;
  config.height = canvas.height;
  config.photo = {
    id: Date.now(),
    width: image.width,
    height: image.height,
    x: image.x,
    y: image.y,
  };
}

// setting the saved text
function setConfigFromJson(json) {
  if (json) {
    if (json.width) config.width = json.width;
    if (json.height) config.height = json.height;
    if (json.photo) config.photo = json.photo;
    if (json.scale) config.scale = json.scale;
    if (json.scaledWidth) config.scaledWidth = json.scaledWidth;
    if (json.scaledHeight) config.scaledHeight = json.scaledHeight;
  }
}

// set the canvas width & height
function scaleCanvas(canvas) {
  canvas.width = canvas.parentElement.offsetWidth ?? 1440;
  canvas.height = canvas.parentElement.offsetHeight ?? 960;
}

// set the photo width,height,x,y
function scalePhoto() {
  const imageRatio = config.photo.height / config.photo.width;
  const canvasRatio = config.height / config.width;
  // if the image size is bigger than our canvas
  if (imageRatio > canvasRatio) {
    config.scaledHeight = config.width * imageRatio * config.scale;
    config.scaledWidth = config.width * config.scale;

    config.photo.x = config.scale ? (config.width - config.scaledWidth) / 2 : 0;
    config.photo.y = (config.height - config.scaledHeight) / 2;
  } else {
    config.scaledHeight = config.height * config.scale;
    config.scaledWidth =
      ((config.width * canvasRatio) / imageRatio) * config.scale;

    config.photo.x = (config.width - config.scaledWidth) / 2;
    config.photo.y = config.scale
      ? (config.height - config.scaledHeight) / 2
      : 0;
  }
}

function scale(percentage) {
  config.scale = percentage / 100;
  scalePhoto();
  requestAnimationFrame(draw);
}

function move(moveX, moveY) {
  if (moveX && moveY) {
    config.photo.x += moveX;
    config.photo.y += moveY;
    moveX = null;
    moveY = null;
    requestAnimationFrame(draw);
  } else if (moveX) {
    config.photo.x += moveX;
    moveX = null;
    requestAnimationFrame(draw);
  } else if (moveY) {
    config.photo.y += moveY;
    moveY = null;
    requestAnimationFrame(draw);
  }
}

// setting the btns and etc
const initControls = () => {
  // move buttons
  const btnMoveDown = document.getElementById('btnMoveDown');
  const btnMoveUp = document.getElementById('btnMoveUp');
  const btnMoveRight = document.getElementById('btnMoveRight');
  const btnMoveLeft = document.getElementById('btnMoveLeft');

  // scale buttons
  const btnScale50 = document.getElementById('btnScale50');
  const btnScale100 = document.getElementById('btnScale100');
  const btnScale200 = document.getElementById('btnScale200');

  // save btn
  const btnSave = document.getElementById('btnSave');

  btnMoveDown.onclick = function (e) {
    move(null, MOVE_SIZE);
  };
  btnMoveUp.onclick = function (e) {
    move(null, -MOVE_SIZE);
  };
  btnMoveRight.onclick = function (e) {
    move(MOVE_SIZE, null);
  };
  btnMoveLeft.onclick = function (e) {
    move(-MOVE_SIZE, null);
  };

  btnScale50.onclick = function (e) {
    scale(50);
  };
  btnScale100.onclick = function (e) {
    scale(100);
  };
  btnScale200.onclick = function (e) {
    scale(200);
  };

  btnSave.onclick = function (e) {
    if (image.src) {
      config.photo.src = image.src;
      handleSaveConfig(JSON.stringify(config), 'json.txt', 'text/plain');
    } else {
      alert('please select the image');
    }
  };
};

/**
|--------------------------------------------------
|	Save config
|--------------------------------------------------
*/
function handleSaveConfig(config, fileName, contentType) {
  var a = document.createElement('a');
  var file = new Blob([config], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

/**
|--------------------------------------------------
|	Draw
|--------------------------------------------------
*/
function draw() {
  getContext().clearRect(0, 0, config.width, config.height);
  getContext().drawImage(
    image,
    config.photo.x,
    config.photo.y,
    config.scaledWidth,
    config.scaledHeight
  );
}

/**
|--------------------------------------------------
|	Main
|--------------------------------------------------
*/
const AppView = () => {
  // to call the html
  initView();
  // setting the btns and the rest
  initControls();

  editorCanvas = document.getElementById('editorCanvas');
  scaleCanvas(editorCanvas);

  const fileSelector = document.getElementById('fileSelector');
  fileSelector.onchange = function (e) {
    // get all selected Files
    const files = e.target.files;
    let file;
    for (let i = 0; i < files.length; ++i) {
      file = files[i];
      // check if file is valid Image (just a MIME check)
      switch (file.type) {
        case 'text/plain':
          // read the json file
          const textFile = new FileReader();
          textFile.onload = function (e) {
            setConfigFromJson(JSON.parse(e.target.result));
            image.src = config.photo.src;
            image.onload = function () {
              draw();
            };
          };
          textFile.readAsText(file);
          return;
        case 'image/jpeg':
        case 'image/png':
        case 'image/gif':
          // read Image contents from file
          const reader = new FileReader();
          reader.onload = function () {
            // create HTMLImageElement holding image data
            image.src = reader.result;
            image.onload = function () {
              setConfig(editorCanvas);
              scalePhoto();
              draw();
            };

            // do your magic here...
          };
          reader.readAsDataURL(file);
          // process just one file.
          return;
      }
    }
  };
};

// To Run
AppView();

// When I load the application there are some initial func that I call initially:
// Fun: initView(): to call and setup the html
// Fun: initControls(): to make a event listener for the btns
// Fun: scaleCanvas(): the canvas width & height

// ------------------- For Img
// when the image is being loaded, I will call another set of func to do:
// Fun: setConfig: one of the helper function to set the values to our model
// My goad is to set the values such as (Canvas height & width, photo x,y,heigh,width) to our model and help to draw later
// Fun: scalePhoto: to measure and calculate photo specification and get the values for image
// Fun: draw: clearRect and drawImage are being use in here, to clear the canvas and to draw the img with our model

// ------------------- For Saved Text
// when saved json files are being loaded we call almost the same function as we did for img plus:
// fun: setConfigFromJson to set the new data into our model and again draw() it.

// Note: Model here is our config (const config = {})
