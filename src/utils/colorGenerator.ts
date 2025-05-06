// Adapted from: https://stackoverflow.com/questions/22503297/create-an-array-of-colors-about-100-in-javascript-but-the-colors-must-be-quit
export const generateColors = (numColors: number): string[] => {
  const colors: string[] = [];

  for (let i = 0; i < numColors; i++) {
    colors.push(
      `rgb(${randomValue(0, 255)}, ${randomValue(0, 255)}, ${randomValue(
        0,
        255
      )})`
    );
  }

  return colors;
};

function randomValue(min: number, max: number): number {
  return ~~(Math.random() * (min - max)) + max;
}
