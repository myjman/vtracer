/* eslint-disable @typescript-eslint/no-explicit-any */
let vtracerModule: any = null;

const VTRACER_CONFIG = {
  colormode: 'color',
  hierarchical: 'stacked',
  mode: 'spline',
  filter_speckle: 4,
  color_precision: 8,
  layer_difference: 16,
  corner_threshold: 60,
  length_threshold: 4.0,
  max_iterations: 10,
  splice_threshold: 45,
  path_precision: 3
};

async function initVtracer(): Promise<any> {
  if (vtracerModule) return vtracerModule;

  const vtracer = await import('vtracer-wasm');
  await vtracer.default('/vtracer.wasm');
  vtracerModule = vtracer;
  return vtracerModule;
}

export async function convertPngToSvg(imageFile: File): Promise<string> {
  const vtracer = await initVtracer();

  const imageData = await getImageData(imageFile);
  const svgString = vtracer.to_svg(
    imageData.pixels,
    imageData.width,
    imageData.height,
    VTRACER_CONFIG
  );

  return svgString;
}

async function getImageData(file: File): Promise<{
  pixels: Uint8Array;
  width: number;
  height: number;
}> {
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

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);

      URL.revokeObjectURL(url);

      resolve({
        pixels: new Uint8Array(imageData.data),
        width: img.width,
        height: img.height
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

export function isWasmSupported(): boolean {
  try {
    if (typeof WebAssembly === 'object' &&
        typeof WebAssembly.instantiate === 'function') {
      const module = new WebAssembly.Module(
        Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
      );
      if (module instanceof WebAssembly.Module) {
        return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
      }
    }
  } catch {
    // WASM not supported
  }
  return false;
}
