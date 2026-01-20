declare module 'imagetracerjs' {
  interface TracerOptions {
    colorsampling?: number;
    numberofcolors?: number;
    mincolorratio?: number;
    colorquantcycles?: number;
    ltres?: number;
    qtres?: number;
    pathomit?: number;
    rightangleenhance?: boolean;
    blurradius?: number;
    blurdelta?: number;
    scale?: number;
    roundcoords?: number;
    strokewidth?: number;
    linefilter?: boolean;
    desc?: boolean;
  }

  interface ImageTracer {
    imagedataToSVG(imageData: ImageData, options?: TracerOptions): string;
  }

  const ImageTracer: ImageTracer;
  export default ImageTracer;
}
