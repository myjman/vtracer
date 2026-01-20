export async function convertPngToSvg(imageFile: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await fetch('/api/convert', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Conversion failed');
  }

  const data = await response.json();
  return data.svg;
}

export function isWasmSupported(): boolean {
  return true;
}
