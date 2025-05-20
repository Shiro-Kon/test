import { debounce } from "throttle-debounce";
import { getAsset } from "./assets";
import { getCurrentState } from "./state";

const Constants = require("../shared/constants");

const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE } = Constants;

const canvas = document.getElementById("game-canvas");
const context = canvas.getContext("2d");
setCanvasDimensions();

window.addEventListener("resize", debounce(40, setCanvasDimensions));

let animationFrameRequestId;

function render() {
  const state = getCurrentState();
  if (state.me) {
    renderBackground(state.me.x, state.me.y);
    renderBoundaries(state.me.x, state.me.y);
    state.bullets.forEach((bullet) => renderBullet(state.me, bullet));
    renderPlayer(state.me, state.me);
    state.others.forEach((other) => renderPlayer(state.me, other));
  }
  animationFrameRequestId = requestAnimationFrame(render);
}

function renderBackground(playerX, playerY) {
  context.fillStyle = "#111111";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  const staticBlobs = [
    { x: 1000, y: 600, radius: 550, color: "rgba(119, 0, 255, 0.38)" },
    { x: 1300, y: 900, radius: 700, color: "rgba(0, 102, 255, 0.4)" },
    { x: 800, y: 1400, radius: 800, color: "rgba(80, 0, 120, 0.42)" },
    { x: 1800, y: 800, radius: 680, color: "rgba(50, 50, 255, 0.36)" },
  ];

  staticBlobs.forEach((blob) => {
    const screenX = centerX + blob.x - playerX;
    const screenY = centerY + blob.y - playerY;

    const gradient = context.createRadialGradient(
      screenX,
      screenY,
      0,
      screenX,
      screenY,
      blob.radius
    );
    gradient.addColorStop(0, blob.color);
    gradient.addColorStop(1, "transparent");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(screenX, screenY, blob.radius, 0, 2 * Math.PI);
    context.fill();
  });
}

function renderBoundaries(playerX, playerY) {
  context.strokeStyle = "white";
  context.lineWidth = 2;
  context.strokeRect(
    canvas.width / 2 - playerX,
    canvas.height / 2 - playerY,
    MAP_SIZE,
    MAP_SIZE
  );
}

function renderPlayer(me, player) {
  const { x, y, direction, hp } = player;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;

  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(direction);
  context.drawImage(
    getAsset("ship.png"),
    -PLAYER_RADIUS * 2.5,
    -PLAYER_RADIUS * 2.5,
    PLAYER_RADIUS * 5,
    PLAYER_RADIUS * 5
  );
  context.restore();

  // Health bar
  context.fillStyle = "white";
  context.fillRect(
    canvasX - PLAYER_RADIUS,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2,
    2
  );

  const hpRatio = hp / PLAYER_MAX_HP;
  context.fillStyle = hpRatio > 0.3 ? "limegreen" : "red";
  context.fillRect(
    canvasX - PLAYER_RADIUS,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2 * hpRatio,
    2
  );
}

function renderBullet(me, bullet) {
  const { x, y } = bullet;
  context.drawImage(
    getAsset("bullet.png"),
    canvas.width / 2 + x - me.x - BULLET_RADIUS,
    canvas.height / 2 + y - me.y - BULLET_RADIUS,
    BULLET_RADIUS * 10,
    BULLET_RADIUS * 10
  );
}

function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE / 2 + 800 * Math.sin(t);
  renderBackground(x, y);
  animationFrameRequestId = requestAnimationFrame(renderMainMenu);
}

animationFrameRequestId = requestAnimationFrame(renderMainMenu);

export function startRendering() {
  cancelAnimationFrame(animationFrameRequestId);
  animationFrameRequestId = requestAnimationFrame(render);
}

export function stopRendering() {
  cancelAnimationFrame(animationFrameRequestId);
  animationFrameRequestId = requestAnimationFrame(renderMainMenu);
}

function setCanvasDimensions() {
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}
