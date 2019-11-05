

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

  return {
    result,
    min, sec, mil, mic, nan,
    elapsedMillis,
    elapsedSeconds,
    elapsedSecondsFormatted,
    elapsedTime,
    elapsedSummary,
  };
}
