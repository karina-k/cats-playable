import { Assets, Texture } from "pixi.js";
import { catAssetPaths, rows, shelfAssetPaths, uiAssetPaths } from "./config";
import type { CatColor, GameTextures } from "./types";

export async function loadTextures(): Promise<GameTextures> {
  const aliases = [
    { alias: "background", src: uiAssetPaths.background },
    { alias: "like", src: uiAssetPaths.like },
    { alias: "call-to-action", src: uiAssetPaths.callToAction },
    { alias: "button", src: uiAssetPaths.button },
    ...Object.entries(shelfAssetPaths).map(([color, src]) => ({
      alias: `shelf-${color}`,
      src,
    })),
    ...Object.entries(catAssetPaths).flatMap(([state, byColor]) =>
      Object.entries(byColor).map(([color, src]) => ({
        alias: `${state}-${color}`,
        src,
      })),
    ),
  ];

  await Assets.load(aliases);

  return {
    background: Assets.get<Texture>("background"),
    like: Assets.get<Texture>("like"),
    callToAction: Assets.get<Texture>("call-to-action"),
    button: Assets.get<Texture>("button"),
    shelf: textureRecord("shelf"),
    cat: {
      idle: textureRecord("idle"),
      select: textureRecord("select"),
      sleep: textureRecord("sleep"),
    },
  };
}

function textureRecord(aliasPrefix: string): Record<CatColor, Texture> {
  return Object.fromEntries(
    rows.map((row) => [
      row.color,
      Assets.get<Texture>(`${aliasPrefix}-${row.color}`),
    ]),
  ) as Record<CatColor, Texture>;
}
