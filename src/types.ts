import type { Sprite, Texture } from "pixi.js";

export type CatColor =
  | "white"
  | "yellow"
  | "pink"
  | "blue"
  | "green"
  | "orange";
export type CatState = "idle" | "select" | "sleep";

export type ShelfRow = {
  color: CatColor;
  capacity: number;
};

export type Slot = {
  id: number;
  rowIndex: number;
  columnIndex: number;
  localX: number;
  localY: number;
  shelfBottomY: number;
  x: number;
  y: number;
};

export type Cat = {
  id: number;
  color: CatColor;
  state: CatState;
  slotId: number;
  sprite: Sprite;
  targetX: number;
  targetY: number;
};

export type GameTextures = {
  background: Texture;
  like: Texture;
  callToAction: Texture;
  button: Texture;
  shelf: Record<CatColor, Texture>;
  cat: Record<CatState, Record<CatColor, Texture>>;
};

export type UiReserves = {
  topReserve: number;
  bottomReserve: number;
};

export type PlayfieldMetrics = {
  width: number;
  height: number;
  centerX: number;
  slotStartX: number;
  slotStartY: number;
  slotGapX: number;
  slotGapY: number;
  catSeatOffsetY: number;
  maxShelfScale: number;
};
