'use client';

import { useMemo } from 'react';

interface PreviewProps {
  originalFile: File | null;
  svgContent: string | null;
}

export default function Preview({ originalFile, svgContent }: PreviewProps) {
  const originalUrl = useMemo(() => {
    if (!originalFile) return null;
    return URL.createObjectURL(originalFile);
  }, [originalFile]);

  if (!originalFile || !svgContent) {
    return null;
  }

  const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
  const svgUrl = URL.createObjectURL(svgBlob);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original PNG */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded">
              PNG
            </span>
            <span className="text-sm text-gray-400">Original</span>
          </div>
          <div className="relative aspect-square bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #222 25%, transparent 25%),
                  linear-gradient(-45deg, #222 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #222 75%),
                  linear-gradient(-45deg, transparent 75%, #222 75%)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }}
            />
            {originalUrl && (
              <img
                src={originalUrl}
                alt="Original PNG"
                className="relative w-full h-full object-contain p-4"
              />
            )}
          </div>
        </div>

        {/* Converted SVG */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs font-medium bg-purple-500/20 text-purple-400 rounded">
              SVG
            </span>
            <span className="text-sm text-gray-400">Converted</span>
          </div>
          <div className="relative aspect-square bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #222 25%, transparent 25%),
                  linear-gradient(-45deg, #222 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #222 75%),
                  linear-gradient(-45deg, transparent 75%, #222 75%)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }}
            />
            <img
              src={svgUrl}
              alt="Converted SVG"
              className="relative w-full h-full object-contain p-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
