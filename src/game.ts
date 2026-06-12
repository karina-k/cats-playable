import { Sprite, type Ticker } from "pixi.js";
import { rows } from "./config";
import { createSlots, getCatTargetSize, getShelfScale } from "./layout";
import type { Scene } from "./scene";
import type {
  Cat,
  CatColor,
  GameTextures,
  PlayfieldMetrics,
  ShelfRow,
  Slot,
  UiReserves,
} from "./types";
import { shuffle } from "./utils";

export type Game = {
  reset(): void;
  update(ticker: Ticker): void;
  layout(width: number, height: number, reserves: UiReserves): void;
  isComplete(): boolean;
};

export function rowTargetCount(row: ShelfRow): number {
  return row.color === "orange" ? row.capacity - 1 : row.capacity;
}

export function createGame(
  scene: Scene,
  textures: GameTextures,
  metrics: PlayfieldMetrics,
): Game {
  let slots: Slot[] = [];
  let cats: Cat[] = [];
  const shelvesBySlot = new Map<number, Sprite>();
  let freeSlotId = 0;
  let movingCat: Cat | null = null;
  let completedRows = 0;
  let shelfScale = 1;

  function getSlot(slotId: number): Slot {
    const slot = slots.find((candidate) => candidate.id === slotId);

    if (!slot) {
      throw new Error(`Missing slot ${slotId}`);
    }

    return slot;
  }

  function drawCat(cat: Cat) {
    cat.sprite.texture = textures.cat[cat.state][cat.color];
    cat.sprite.anchor.set(0.5, 1);

    const responsiveScale = shelfScale / metrics.maxShelfScale;
    const targetSize = getCatTargetSize(metrics, cat.state);
    const textureRatio = cat.sprite.texture.width / cat.sprite.texture.height;

    cat.sprite.height = targetSize.height * responsiveScale;
    cat.sprite.width = targetSize.height * textureRatio * responsiveScale;
    cat.sprite.alpha = cat.state === "sleep" ? 0.95 : 1;
    cat.sprite.cursor = cat.state === "sleep" ? "default" : "pointer";
  }

  function selectCat(cat: Cat) {
    if (movingCat || cat.state === "sleep") {
      return;
    }

    const destination = getSlot(freeSlotId);

    freeSlotId = cat.slotId;
    cat.slotId = destination.id;
    cat.state = "select";
    cat.targetX = destination.x;
    cat.targetY = destination.y;
    movingCat = cat;
    scene.catLayer.addChild(cat.sprite);
    drawCat(cat);
  }

  function evaluateRows() {
    const completeRowIndexes = new Set<number>();

    rows.forEach((row, rowIndex) => {
      const rowSlots = slots.filter((slot) => slot.rowIndex === rowIndex);
      const rowCats = rowSlots
        .map((slot) => cats.find((cat) => cat.slotId === slot.id))
        .filter((cat): cat is Cat => Boolean(cat));
      const isComplete =
        rowCats.length === rowTargetCount(row) &&
        rowCats.every((cat) => cat.color === row.color);

      if (isComplete) {
        completeRowIndexes.add(rowIndex);
      }
    });

    cats.forEach((cat) => {
      if (cat.state === "select") {
        return;
      }

      const rowIndex = getSlot(cat.slotId).rowIndex;

      cat.state = completeRowIndexes.has(rowIndex) ? "sleep" : "idle";
      drawCat(cat);
    });

    completedRows = completeRowIndexes.size;
    scene.completeOverlay.visible = completedRows === rows.length;
  }

  function reset() {
    scene.shelfLayer.removeChildren();
    scene.catLayer.removeChildren();
    shelvesBySlot.clear();
    slots = createSlots(metrics);
    cats = [];
    freeSlotId = slots[Math.floor(Math.random() * slots.length)].id;
    movingCat = null;
    completedRows = 0;
    scene.completeOverlay.visible = false;

    slots.forEach((slot) => {
      const row = rows[slot.rowIndex];
      const shelf = new Sprite(textures.shelf[row.color]);

      shelf.anchor.set(0.5, 1);
      shelf.position.set(slot.x, slot.shelfBottomY);
      scene.shelfLayer.addChild(shelf);
      shelvesBySlot.set(slot.id, shelf);
    });

    const availableSlots = shuffle(
      slots.filter((slot) => slot.id !== freeSlotId).map((slot) => slot.id),
    );
    const colors = rows.flatMap((row) =>
      Array<CatColor>(rowTargetCount(row)).fill(row.color),
    );

    shuffle(colors).forEach((color, index) => {
      const slot = getSlot(availableSlots[index]);
      const sprite = new Sprite(textures.cat.idle[color]);
      const cat: Cat = {
        id: index,
        color,
        state: "idle",
        slotId: slot.id,
        sprite,
        targetX: slot.x,
        targetY: slot.y,
      };

      sprite.anchor.set(0.5, 1);
      sprite.eventMode = "static";
      sprite.cursor = "pointer";
      sprite.on("pointertap", () => selectCat(cat));
      scene.catLayer.addChild(sprite);
      cats.push(cat);
      drawCat(cat);
    });

    evaluateRows();
  }

  function update(ticker: Ticker) {
    if (!movingCat) {
      return;
    }

    const cat = movingCat;
    const speed = Math.min(1, 0.13 * ticker.deltaTime);

    cat.sprite.x += (cat.targetX - cat.sprite.x) * speed;
    cat.sprite.y += (cat.targetY - cat.sprite.y) * speed;
    cat.sprite.rotation = Math.sin(performance.now() / 80) * 0.025;

    if (
      Math.hypot(cat.targetX - cat.sprite.x, cat.targetY - cat.sprite.y) < 1.5
    ) {
      cat.sprite.position.set(cat.targetX, cat.targetY);
      cat.sprite.rotation = 0;
      cat.state = "idle";
      movingCat = null;
      drawCat(cat);
      evaluateRows();
    }
  }

  function layout(width: number, height: number, reserves: UiReserves) {
    shelfScale = getShelfScale(metrics, width, height);

    const availableHeight = Math.max(
      240,
      height - reserves.topReserve - reserves.bottomReserve,
    );

    scene.playfield.position.set(
      width / 2,
      reserves.topReserve +
        Math.max(0, (availableHeight - metrics.height * shelfScale) / 2),
    );

    slots.forEach((slot) => {
      slot.x = (slot.localX - metrics.centerX) * shelfScale;
      slot.y = slot.localY * shelfScale;

      const shelf = shelvesBySlot.get(slot.id);

      if (shelf) {
        shelf.scale.set(shelfScale);
        shelf.position.set(slot.x, slot.shelfBottomY * shelfScale);
      }
    });

    cats.forEach((cat) => {
      const slot = getSlot(cat.slotId);

      cat.targetX = slot.x;
      cat.targetY = slot.y;

      if (movingCat !== cat) {
        cat.sprite.position.set(slot.x, slot.y);
      }

      drawCat(cat);
    });
  }

  return {
    reset,
    update,
    layout,
    isComplete: () => completedRows === rows.length,
  };
}
