export interface SparklineOptions {
  readonly width: number;
  readonly height: number;
  readonly padX?: number;
  readonly padY?: number;
}

/**
 * Converts a numeric series into SVG polyline coordinate pairs.
 */
export function buildSparklinePoints(
  points: readonly number[],
  options: SparklineOptions,
): string {
  if (points.length === 0) {
    return '';
  }

  const { width, height } = options;
  const padX = options.padX ?? 4;
  const padY = options.padY ?? 4;
  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const span = maxVal - minVal || 1;

  return points
    .map((val, index) => {
      const x =
        points.length === 1
          ? width / 2
          : padX + (index / (points.length - 1)) * (width - padX * 2);
      const y = padY + (1 - (val - minVal) / span) * (height - padY * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}
