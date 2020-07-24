import { isWhole } from 'expangine-runtime';


export function now()
{
  return window.performance && window.performance.now
    ? window.performance.now()
    : Date.now
      ? Date.now()
      : new Date().getTime();
}

export interface StopWatchOutput<R>
{
  result: R;
  min: number;
  sec: number;
  mil: number;
  mic: number;
  nan: number;
  elapsedMillis: number;
  elapsedSeconds: number;
  elapsedSecondsFormatted: string;
  elapsedTime: string;
  elapsedSummary: string;
  elapsedShort: string;
}

export function measure<R = any>(callback: () => R): StopWatchOutput<R>
{
  const start = now();

  const result = callback();

  const end = now();
  const measureTime = -(now() - now());
  const elapsedMillis = end - start - measureTime;
  const elapsedSeconds = (elapsedMillis / 1000);
  const elapsedSecondsString = elapsedSeconds.toString();
  const elapsedSecondsFormatted = elapsedSecondsString.substring(0, elapsedSecondsString.indexOf('.') + 10);

  const min = Math.floor(elapsedMillis / 60000) % 60;
  const sec = Math.floor(elapsedMillis / 1000) % 1000;
  const mil = Math.floor(elapsedMillis) % 1000;
  const mic = Math.floor(elapsedMillis * 1000) % 1000;
  const nan = Math.floor(elapsedMillis * 1000000) % 1000;

  const elapsed = [];
  if (min > 0) {
    elapsed.push(min + ' m');
  }
  if (sec > 0) {
    elapsed.push(sec + ' s');
  }
  if (mil > 0) {
    elapsed.push(mil + ' ms');
  }
  if (mic > 0) {
    elapsed.push(mic + ' µs');
  }
  if (nan > 0) {
    elapsed.push(nan + ' ns');
  }

  const elapsedTime = elapsed.join(' ');
  const elapsedSummary = elapsedTime + ' (' + elapsedSecondsFormatted + ' seconds total)';
  const elapsedUnit = min > 0
    ? 'm'
    : sec > 0
      ? 's'
      : mil > 0
        ? 'ms'
        : mic > 0
          ? 'µs'
          : 'ns';
  const elapsedUnitAmount = min > 0
    ? min + sec / 60
    : sec > 0
      ? sec + mil / 1000
      : mil > 0
        ? mil + mic / 1000
        : mic > 0
          ? mic + nan / 1000
          : nan;
  const elapsedShort = elapsedUnitAmount < 10
    ? isWhole(elapsedUnitAmount)
      ? elapsedUnitAmount + elapsedUnit
      : elapsedUnitAmount.toFixed(1) + elapsedUnit
    : Math.round(elapsedUnitAmount) + elapsedUnit;

  return {
    result,
    min, sec, mil, mic, nan,
    elapsedMillis,
    elapsedSeconds,
    elapsedSecondsFormatted,
    elapsedTime,
    elapsedSummary,
    elapsedShort,
  };
}
