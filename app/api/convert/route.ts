import { NextRequest, NextResponse } from 'next/server';
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
    const buffer = Buffer.from(arrayBuffer);

    // Decode image using native APIs
    const { createCanvas, loadImage } = await import('canvas');
    const img = await loadImage(buffer);

    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    // White background for transparency
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, img.width, img.height);
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);

    // High quality settings
    const svg = ImageTracer.imagedataToSVG(imageData as unknown as ImageData, {
      colorsampling: 2,
      numberofcolors: 64,
      mincolorratio: 0,
      colorquantcycles: 3,
      ltres: 0.5,
      qtres: 0.5,
      pathomit: 4,
      rightangleenhance: true,
      blurradius: 0,
      blurdelta: 20,
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
