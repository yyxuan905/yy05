let video;
let facemesh;
let predictions = [];
const leftEyeIndices = [33, 160, 158, 133, 153, 144]; // 左眼索引
const rightEyeIndices = [362, 385, 387, 263, 373, 380]; // 右眼索引
let frameCounter = 0;

function setup() {
  createCanvas(640, 480).position(
    (windowWidth - 640) / 2,
    (windowHeight - 480) / 2
  );
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on('predict', results => {
    predictions = results;
  });
}

function modelReady() {
  console.log("模型載入完成");
}

function draw() {
  image(video, 0, 0, width, height);

  // 每 5 幀執行一次
  if (frameCounter % 5 === 0 && predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 繪製左眼輪廓
    stroke(0, 255, 0); // 綠色
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i < leftEyeIndices.length; i++) {
      const idx = leftEyeIndices[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape(CLOSE);

    // 繪製右眼輪廓
    stroke(0, 0, 255); // 藍色
    beginShape();
    for (let i = 0; i < rightEyeIndices.length; i++) {
      const idx = rightEyeIndices[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape(CLOSE);
  }

  frameCounter++;
}
