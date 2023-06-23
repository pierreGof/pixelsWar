document.addEventListener('touchstart', {});
let socket;
let tabPixels = [];
let jsonDataArray = [];
let nomCol = 30;
let radio;
let macoul;
let dB;



function setup() {
  if (windowWidth < 500) {
    createCanvas(windowWidth, windowWidth);
  } else {
    createCanvas(500, 500);
  };
  socket = io.connect('http://framboise.local:4000');
  socket.on('miseAjourPixel', newPixel);
  
  let taille = width / nomCol;
  let a = 0;
  for (let x = 0; x < width; x += taille) {
    for (let y = 0; y < height; y += taille) {
      tabPixels[a] = new Pixel(x, y, 'black', taille, a);
      a++;
    }
  }

  radio = createRadio();
  radio.option('White', '◻️');
  radio.option('yellow', '🟨');
  radio.option('orange', '🟧');
  radio.option('red', '🟥');
  radio.option('DodgerBlue', '🟦');
  radio.option('purple', '🟪');
  radio.option('LawnGreen', '🟩');
  radio.option('brown', '🟫');
  radio.option('black', '🔳');
  radio.style('height', '20px');

  getDB();
}



function draw() {
  background(50);
  macoul = radio.value();
  for (let p of tabPixels) {
    p.coul();
    p.display();
  }
}



function mousePressed() {
  for (let p of tabPixels) {
    p.clicked();
  }
}



function newPixel(data) {
  tabPixels[data.a].couleur = data.c;
}



async function getDB() {
  try {
    let response = await fetch('pixelWar.db');
    let data = await response.text();
    let dataArray = data.trim().split('\n');
    jsonDataArray = dataArray.map((item) => JSON.parse(item));
    //console.log(jsonDataArray);
    for (let x = 0; x < jsonDataArray.length; x++) {
      tabPixels[jsonDataArray[x].numeroPixel].couleur = jsonDataArray[x].couleur;
    }
  } catch (erreur) {
    console.log('pas de dataBase', erreur);
  }
}