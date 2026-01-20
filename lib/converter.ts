/* eslint-disable @typescript-eslint/no-explicit-any */

const TRACER_CONFIG = {
  // Color quantization
  colorsampling: 2,      // 0: simple, 1: random, 2: deterministic
  numberofcolors: 24,    // Number of colors to use
  mincolorratio: 0.02,   // Color ratio below this will be merged
  colorquantcycles: 3,   // Color quantization cycles

  // Tracing
  ltres: 1,              // Line tracer error threshold
  qtres: 1,              // Quadratic spline error threshold
  pathomit: 8,           // Edge node count below this will be omitted
  rightangleenhance: true,

  // Blur preprocessing
  blurradius: 0,
  blurdelta: 20,

  // SVG output
  scale: 1,
  roundcoords: 2,        // Decimal places
  strokewidth: 1,
  linefilter: false,
  desc: false,           // Don't add description
};

export async function convertPngToSvg(imageFile: File): Promise<string> {
  const ImageTracer = (await import('imagetracerjs')).default;
  const imageData = await getImageData(imageFile);

  const svgString = ImageTracer.imagedataToSVG(imageData, TRACER_CONFIG);

  return svgString;
}

async function getImageData(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Fill with white background to handle transparency
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);

      URL.revokeObjectURL(url);

      resolve(imageData);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

export function isWasmSupported(): boolean {
  // No longer need WASM check since imagetracerjs is pure JavaScript
  return true;
}
