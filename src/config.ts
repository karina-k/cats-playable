import type { CatColor, CatState, ShelfRow } from "./types";

export const installUrl = "https://play.google.com/store/apps/details?id=org.smapps.sushi&pcampaignid=web_share";
const publicAsset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const rows: ShelfRow[] = [
  { color: "white", capacity: 1 },
  { color: "yellow", capacity: 2 },
  { color: "pink", capacity: 3 },
  { color: "blue", capacity: 4 },
  { color: "green", capacity: 5 },
  { color: "orange", capacity: 6 },
];

export const catAssetPaths: Record<CatState, Record<CatColor, string>> = {
  idle: {
    white: publicAsset("cats/idle/White_cat_idle.png"),
    yellow: publicAsset("cats/idle/Yellow_cat_idle.png"),
    pink: publicAsset("cats/idle/Pink_cat_idle.png"),
    blue: publicAsset("cats/idle/Blue_cat_idle.png"),
    green: publicAsset("cats/idle/Green_cat_idle.png"),
    orange: publicAsset("cats/idle/Orange_Cat_idle.png"),
  },
  select: {
    white: publicAsset("cats/select/White_cat_select.png"),
    yellow: publicAsset("cats/select/Yellow_cat_select.png"),
    pink: publicAsset("cats/select/Pink_Cat_select.png"),
    blue: publicAsset("cats/select/Blue_cat_select.png"),
    green: publicAsset("cats/select/Green_Cat_select.png"),
    orange: publicAsset("cats/select/Orange_cat_select.png"),
  },
  sleep: {
    white: publicAsset("cats/sleep/White_Cat_sleep.png"),
    yellow: publicAsset("cats/sleep/Yellow_Cat_sleep.png"),
    pink: publicAsset("cats/sleep/Pink_Cat_sleep.png"),
    blue: publicAsset("cats/sleep/Blue_cat_sleep.png"),
    green: publicAsset("cats/sleep/Green_Cat_sleep.png"),
    orange: publicAsset("cats/sleep/Orange_Cat_sleep.png"),
  },
};

export const shelfAssetPaths: Record<CatColor, string> = {
  white: publicAsset("shelves/shelve_white.png"),
  yellow: publicAsset("shelves/shelve_yellow.png"),
  pink: publicAsset("shelves/shelve_pink.png"),
  blue: publicAsset("shelves/shelve_blue.png"),
  green: publicAsset("shelves/shelve_green.png"),
  orange: publicAsset("shelves/shelve_orange.png"),
};

export const uiAssetPaths = {
  background: publicAsset("back.png"),
  like: publicAsset("like.png"),
  callToAction: publicAsset("call_to_action.png"),
  button: publicAsset("button.png"),
};

export const layoutRules = {
  shelfGapX: 5,
  shelfGapY: 10,
  shelfTopOverlap: 5,
  catSeatOffsetRatio: -0.17,
  maxShelfScale: 0.55,
  portraitShelfWidthRatio: 0.84,
  portraitShelfHeightRatio: 0.66,
  landscapeShelfWidthRatio: 0.5,
  landscapeShelfHeightRatio: 0.64,
  portraitCtaWidthRatio: 0.66,
  landscapeCtaWidthRatio: 0.42,
  ctaHeightRatio: 0.12,
  portraitButtonWidthRatio: 0.42,
  landscapeButtonWidthRatio: 0.18,
  portraitButtonHeightRatio: 0.09,
  landscapeButtonHeightRatio: 0.11,
  catHeightRatio: 0.43,
  flyingCatHeightRatio: 0.96,
  sleepingCatHeightRatio: 0.37,
};
