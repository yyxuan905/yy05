let facemesh;
let video;
let predictions = [];

function setup() {
  createCanvas(400, 400);
  video = createCapture(VIDEO);
  video.size(400, 400);
  video.hide();

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on("predict", (results) => {
    predictions = results;
  });
}

function modelReady() {
  console.log("FaceMesh model loaded!");
}

function draw() {
  background(220);
  image(video, 0, 0, width, height);

  drawFaceMeshLines();
}

function drawFaceMeshLines() {
  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 指定的點編號
    const indices = [409, 270, 269, 267, 0, 37];

    stroke(255, 0, 0); // 紅色
    strokeWeight(15); // 線條粗細
    noFill();

    beginShape();
    for (let i = 0; i < indices.length; i++) {
      const [x, y] = keypoints[indices[i]];
      vertex(x, y);
    }
    endShape(CLOSE); // 將最後一點與第一點連接
  }
}