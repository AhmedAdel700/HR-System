export interface GeniePoint {
  x: number;
  y: number;
}

export type GenieDirection = "open" | "minimize";

export const GENIE_DURATION_MS = 420;

const clamp = (value: number, low: number, high: number): number =>
  Math.max(low, Math.min(high, value));

const lerp = (from: number, to: number, t: number): number => from + (to - from) * t;

const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const easeInQuad = (t: number): number => t * t;

export function renderGenie(
  ctx: CanvasRenderingContext2D,
  snapshot: HTMLCanvasElement,
  viewportW: number,
  viewportH: number,
  panelW: number,
  panelH: number,
  rawT: number,
  direction: GenieDirection,
  source: GeniePoint,
  destination: GeniePoint,
): void {
  ctx.clearRect(0, 0, viewportW, viewportH);

  for (let y = 0; y < panelH; y += 1) {
    const rowRatio = y / panelH;
    const rowXStart =
      direction === "minimize" ? (1 - rowRatio) * 0.65 : rowRatio * 0.65;
    const xProgress = clamp((rawT - rowXStart) / (1 - rowXStart), 0, 1);
    const xEase = easeInOutCubic(xProgress);

    const rowYStart =
      direction === "minimize" ? (1 - rowRatio) * 0.2 : rowRatio * 0.2;
    const yProgress = clamp((rawT - rowYStart) / (1 - rowYStart), 0, 1);
    const yEase = easeInQuad(yProgress);

    let left: number;
    let right: number;
    let destY: number;

    if (direction === "minimize") {
      left = lerp(destination.x, source.x, xEase);
      right = lerp(destination.x + panelW, source.x, xEase);
      destY = lerp(destination.y + y, source.y, yEase);
    } else {
      left = lerp(source.x, destination.x, xEase);
      right = lerp(source.x, destination.x + panelW, xEase);
      destY = lerp(source.y, destination.y + y, yEase);
    }

    const rowWidth = right - left;
    if (rowWidth < 0.8) continue;

    ctx.drawImage(snapshot, 0, y, panelW, 1, left, destY, rowWidth, 1);
  }
}
