export function parseFrequency(frequencyString?: string): number {
  const f = Math.floor(Number(frequencyString));
  const valid = f !== Infinity && f >= 0;
  return valid ? f : 0;
}

export function runEvery(seconds: number, callback: () => any) {
  const repeater = async () => {
    await callback();
    setTimeout(repeater, seconds * 1000);
  }
  repeater();
}