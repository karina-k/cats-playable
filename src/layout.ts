import type { Texture } from "pixi.js";
import { layoutRules, rows } from "./config";
import type { CatColor, CatState, PlayfieldMetrics, Slot } from "./types";

export function createPlayfieldMetrics(
  shelves: Record<CatColor, Texture>,
): PlayfieldMetrics {
  const shelfSizes = Object.values(shelves).map((texture) => ({
    width: texture.width,
    height: texture.height,
  }));
  const shelfWidth = Math.max(...shelfSizes.map((size) => size.width));
  const shelfHeight = Math.max(...shelfSizes.map((size) => size.height));
  const maxColumns = Math.max(...rows.map((row) => row.capacity));
  const slotGapX = shelfWidth - layoutRules.shelfGapX;
  const slotGapY = shelfHeight + layoutRules.shelfGapY;
  const slotStartX = shelfWidth / 2;
  const slotStartY = shelfHeight - layoutRules.shelfTopOverlap;
  const left = slotStartX - shelfWidth / 2;
  const right = slotStartX + (maxColumns - 1) * slotGapX + shelfWidth / 2;
  const top = slotStartY - shelfHeight;
  const bottom = slotStartY + (rows.length - 1) * slotGapY;

  return {
    width: right - left,
    height: bottom - top,
    centerX: (left + right) / 2,
    slotStartX,
    slotStartY,
    slotGapX,
    slotGapY,
    catSeatOffsetY: shelfHeight * layoutRules.catSeatOffsetRatio,
    maxShelfScale: layoutRules.maxShelfScale,
  };
}

export function createSlots(metrics: PlayfieldMetrics) {
  let nextId = 0;

  return rows.flatMap((row, rowIndex) =>
    Array.from({ length: row.capacity }, (_, columnIndex): Slot => {
      const shelfBottomY = metrics.slotStartY + rowIndex * metrics.slotGapY;

      return {
        id: nextId++,
        rowIndex,
        columnIndex,
        localX: metrics.slotStartX + columnIndex * metrics.slotGapX,
        localY: shelfBottomY + metrics.catSeatOffsetY,
        shelfBottomY,
        x: 0,
        y: 0,
      };
    }),
  );
}

export function getShelfScale(
  metrics: PlayfieldMetrics,
  width: number,
  height: number,
) {
  const isLandscape = width > height;
  const widthRatio = isLandscape
    ? layoutRules.landscapeShelfWidthRatio
    : layoutRules.portraitShelfWidthRatio;
  const heightRatio = isLandscape
    ? layoutRules.landscapeShelfHeightRatio
    : layoutRules.portraitShelfHeightRatio;
  const widthScale = (width * widthRatio) / metrics.width;
  const heightScale = (height * heightRatio) / metrics.height;

  return Math.min(widthScale, heightScale, metrics.maxShelfScale);
}

export function getCatTargetSize(
  metrics: PlayfieldMetrics,
  state: CatState,
): { height: number } {
  const shelfHeight = metrics.slotGapY - layoutRules.shelfGapY;
  const heightRatio =
    state === "select"
      ? layoutRules.flyingCatHeightRatio
      : state === "sleep"
        ? layoutRules.sleepingCatHeightRatio
        : layoutRules.catHeightRatio;

  return { height: shelfHeight * heightRatio };
}
