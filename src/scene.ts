import { Application, Container, Graphics, Sprite } from "pixi.js";
import { layoutRules } from "./config";
import type { GameTextures, UiReserves } from "./types";

export type Scene = {
  background: Sprite;
  playfield: Container;
  shelfLayer: Container;
  catLayer: Container;
  uiLayer: Container;
  callToAction: Sprite;
  installButton: Sprite;
  installButtonBaseScale: number;
  completeOverlay: Container;
  completeDimmer: Graphics;
  completeLike: Sprite;
};

export function createScene(app: Application, textures: GameTextures): Scene {
  const background = new Sprite(textures.background);
  const playfield = new Container();
  const shelfLayer = new Container();
  const catLayer = new Container();
  const uiLayer = new Container();
  const callToAction = new Sprite(textures.callToAction);
  const installButton = new Sprite(textures.button);
  const completeOverlay = new Container();
  const completeDimmer = new Graphics();
  const completeLike = new Sprite(textures.like);

  app.stage.addChild(background, playfield, uiLayer, completeOverlay);
  playfield.addChild(shelfLayer, catLayer);
  uiLayer.addChild(callToAction, installButton);
  completeOverlay.addChild(completeDimmer, completeLike);
  completeOverlay.visible = false;

  installButton.eventMode = "static";
  installButton.cursor = "pointer";

  return {
    background,
    playfield,
    shelfLayer,
    catLayer,
    uiLayer,
    callToAction,
    installButton,
    installButtonBaseScale: 1,
    completeOverlay,
    completeDimmer,
    completeLike,
  };
}

export function layoutBackground(scene: Scene, width: number, height: number) {
  const { background } = scene;
  const scale = Math.max(
    width / background.texture.width,
    height / background.texture.height,
  );

  background.anchor.set(0.5);
  background.scale.set(scale);
  background.position.set(width / 2, height / 2);
}

export function layoutUi(
  scene: Scene,
  width: number,
  height: number,
): UiReserves {
  const { callToAction, installButton } = scene;
  const isLandscape = width > height;
  const ctaScale = fitSprite(
    callToAction,
    width *
      (isLandscape
        ? layoutRules.landscapeCtaWidthRatio
        : layoutRules.portraitCtaWidthRatio),
    height * layoutRules.ctaHeightRatio,
  );
  const buttonScale = fitSprite(
    installButton,
    width *
      (isLandscape
        ? layoutRules.landscapeButtonWidthRatio
        : layoutRules.portraitButtonWidthRatio),
    height *
      (isLandscape
        ? layoutRules.landscapeButtonHeightRatio
        : layoutRules.portraitButtonHeightRatio),
  );
  const topMargin = Math.max(16, height * (isLandscape ? 0.04 : 0.045));
  const bottomMargin = Math.max(14, height * (isLandscape ? 0.035 : 0.04));
  const shelfMargin = Math.max(16, height * 0.025);

  callToAction.anchor.set(0.5);
  callToAction.scale.set(ctaScale);
  callToAction.position.set(width / 2, topMargin + callToAction.height / 2);

  installButton.anchor.set(0.5);
  installButton.scale.set(buttonScale);
  installButton.position.set(
    width / 2,
    height - bottomMargin - installButton.height / 2,
  );
  scene.installButtonBaseScale = buttonScale;

  return {
    topReserve: callToAction.y + callToAction.height / 2 + shelfMargin,
    bottomReserve:
      height - (installButton.y - installButton.height / 2) + shelfMargin,
  };
}

export function layoutCompleteOverlay(
  scene: Scene,
  width: number,
  height: number,
) {
  const { completeDimmer, completeLike } = scene;

  completeDimmer.clear();
  completeDimmer
    .rect(0, 0, width, height)
    .fill({ color: 0x2f2f2f, alpha: 0.62 });

  const likeScale = Math.min(
    (width * 0.54) / completeLike.texture.width,
    (height * 0.48) / completeLike.texture.height,
    0.74,
  );

  completeLike.anchor.set(0.5);
  completeLike.scale.set(likeScale);
  completeLike.position.set(width / 2, height / 2);
}

export function animateInstallButton(scene: Scene, isComplete: boolean) {
  const speed = isComplete ? 115 : 220;
  const pulse = 1 + Math.sin(performance.now() / speed) * 0.035;

  scene.installButton.scale.set(scene.installButtonBaseScale * pulse);
}

function fitSprite(sprite: Sprite, maxWidth: number, maxHeight: number) {
  return Math.min(
    maxWidth / sprite.texture.width,
    maxHeight / sprite.texture.height,
    1,
  );
}
