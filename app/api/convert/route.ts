import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import ImageTracer from 'imagetracerjs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Preprocess image with sharp for better quality
    const { data, info } = await sharp(inputBuffer)
      .flatten({ background: '#ffffff' }) // Handle transparency
      .normalize() // Enhance contrast
      .sharpen({ sigma: 1 }) // Sharpen edges
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });

    // Create ImageData-like object for imagetracerjs
    const imageData = {
      width: info.width,
      height: info.height,
      data: new Uint8ClampedArray(data),
      colorSpace: 'srgb' as PredefinedColorSpace,
    };

    // High quality settings for imagetracerjs
    const svg = ImageTracer.imagedataToSVG(imageData as ImageData, {
      // Color quantization - more colors = better quality
      colorsampling: 2,
      numberofcolors: 64,
      mincolorratio: 0,
      colorquantcycles: 3,

      // Tracing - lower values = more detail
      ltres: 0.5,
      qtres: 0.5,
      pathomit: 4,
      rightangleenhance: true,

      // Blur - disabled for sharper output
      blurradius: 0,
      blurdelta: 20,

      // SVG output
      scale: 1,
      roundcoords: 3,
      strokewidth: 1,
      linefilter: false,
      desc: false,
    });

    return NextResponse.json({ svg });
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: 'Conversion failed' },
      { status: 500 }
    );
  }
}
