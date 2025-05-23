let video;
let facemesh;
let predictions = [];
const eyeIndices = [33, 133, 160, 144, 153, 362, 263, 387, 373, 380]; // 眼睛索引
const handIndices = [468, 469, 470, 471, 472]; // 手指索引（假設用手掌關鍵點）

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

    // 繪製眼睛軌跡
    stroke(0, 0, 255);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i < eyeIndices.length; i++) {
      const idx = eyeIndices[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape(CLOSE);

    // 判斷手勢
    const handPoints = handIndices.map(idx => keypoints[idx]);
    const gesture = detectGesture(handPoints);

    // 根據手勢繪製眼睛效果
    if (gesture === "scissors") {
      drawLightning(keypoints[eyeIndices[0]]);
    } else if (gesture === "rock") {
      drawStar(keypoints[eyeIndices[0]]);
    } else if (gesture === "paper") {
      drawLine(keypoints[eyeIndices[0]], keypoints[eyeIndices[eyeIndices.length - 1]]);
    }
  }
}

function detectGesture(handPoints) {
  // 簡單手勢判斷邏輯（可根據實際需求調整）
  const [p1, p2, p3, p4, p5] = handPoints;
  const distance1 = dist(p1[0], p1[1], p2[0], p2[1]);
  const distance2 = dist(p3[0], p3[1], p4[0], p4[1]);

  if (distance1 > 50 && distance2 > 50) {
    return "scissors"; // 剪刀
  } else if (distance1 < 30 && distance2 < 30) {
    return "rock"; // 石頭
  } else {
    return "paper"; // 布
  }
}

function drawLightning([x, y]) {
  stroke(255, 255, 0);
  strokeWeight(3);
  line(x, y, x + 10, y - 20);
  line(x + 10, y - 20, x - 10, y - 40);
  line(x - 10, y - 40, x + 20, y - 60);
}

function drawStar([x, y]) {
  fill(255, 255, 0);
  noStroke();
  beginShape();
  for (let i = 0; i < 5; i++) {
    const angle = TWO_PI / 5 * i - HALF_PI;
    const sx = x + cos(angle) * 10;
    const sy = y + sin(angle) * 10;
    vertex(sx, sy);
    const angle2 = angle + PI / 5;
    const sx2 = x + cos(angle2) * 5;
    const sy2 = y + sin(angle2) * 5;
    vertex(sx2, sy2);
  }
  endShape(CLOSE);
}

function drawLine([x1, y1], [x2, y2]) {
  stroke(0, 255, 0);
  strokeWeight(2);
  line(x1, y1, x2, y2);
}
