let video;
let facemesh;
let predictions = [];
const firstIndices = [
  409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291
];
const secondIndices = [
  76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184
];
const thirdIndices = [
  359, 467, 260, 259, 257, 258, 286, 414, 463, 341, 256, 252, 253, 254, 339, 255,
  263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249
];

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

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 繪製第一組陣列的連線
    stroke(255, 0, 0); // 紅色
    strokeWeight(15);
    noFill();
    beginShape();
    for (let i = 0; i < firstIndices.length; i++) {
      const idx = firstIndices[i];
      if (keypoints[idx]) {
        const [x, y] = keypoints[idx];
        vertex(x, y);
      }
    }
    endShape();

    // 繪製第二組陣列的內部填充
    fill(255, 255, 0); // 黃色
    noStroke();
    beginShape();
    for (let i = 0; i < secondIndices.length; i++) {
      const idx = secondIndices[i];
      if (keypoints[idx]) {
        const [x, y] = keypoints[idx];
        vertex(x, y);
      }
    }
    endShape(CLOSE);

    // 在第一組與第二組之間填充綠色
    fill(0, 255, 0); // 綠色
    noStroke();
    beginShape();
    for (let i = 0; i < firstIndices.length; i++) {
      const idx = firstIndices[i];
      if (keypoints[idx]) {
        const [x, y] = keypoints[idx];
        vertex(x, y);
      }
    }
    for (let i = secondIndices.length - 1; i >= 0; i--) {
      const idx = secondIndices[i];
      if (keypoints[idx]) {
        const [x, y] = keypoints[idx];
        vertex(x, y);
      }
    }
    endShape(CLOSE);

    // 繪製第三組陣列的連線
    stroke(255, 0, 0); // 紅色
    strokeWeight(15);
    noFill();
    beginShape();
    for (let i = 0; i < thirdIndices.length; i++) {
      const idx = thirdIndices[i];
      if (keypoints[idx]) {
        const [x, y] = keypoints[idx];
        vertex(x, y);
      }
    }
    endShape();
  }
}
