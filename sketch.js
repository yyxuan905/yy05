let video;
let facemesh;
let predictions = [];
const eyeIndices = [33, 133, 160, 144, 153, 362, 263, 387, 373, 380]; // 眼睛索引
const noseIndices = [1, 2, 98, 327]; // 鼻子索引（可根據需求調整）
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

    // 繪製眼睛和鼻子的軌跡
    stroke(255, 0, 0); // 設定軌跡顏色為紅色
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i < eyeIndices.length; i++) {
      const idx = eyeIndices[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    for (let i = 0; i < noseIndices.length; i++) {
      const idx = noseIndices[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape(CLOSE);
  }

  frameCounter++;
}
