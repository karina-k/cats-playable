import "./style.css";
import { Application } from "pixi.js";
import { loadTextures } from "./assets";
import { installUrl } from "./config";
import { createGame } from "./game";
import { createPlayfieldMetrics } from "./layout";
import {
  animateInstallButton,
  createScene,
  layoutBackground,
  layoutCompleteOverlay,
  layoutUi,
} from "./scene";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <main class="game">
    <div id="game-stage" aria-label="Cats sorting game"></div>
  </main>
`;

const stageHost = document.querySelector<HTMLDivElement>("#game-stage")!;
const app = new Application();

await app.init({
  backgroundAlpha: 0,
  antialias: true,
  autoDensity: true,
  resolution: Math.min(window.devicePixelRatio || 1, 2),
  resizeTo: stageHost,
});

stageHost.appendChild(app.canvas);

const textures = await loadTextures();
const metrics = createPlayfieldMetrics(textures.shelf);
const scene = createScene(app, textures);
const game = createGame(scene, textures, metrics);

scene.installButton.on("pointertap", () =>
  window.open(installUrl, "_blank", "noreferrer"),
);

function layout() {
  const { width, height } = app.screen;

  layoutBackground(scene, width, height);
  const reserves = layoutUi(scene, width, height);
  game.layout(width, height, reserves);
  layoutCompleteOverlay(scene, width, height);
}

app.renderer.on("resize", layout);
app.ticker.add((ticker) => {
  animateInstallButton(scene, game.isComplete());
  game.update(ticker);
});

game.reset();
layout();
