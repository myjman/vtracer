'use client';

import { useState, useCallback, useEffect } from 'react';
import UploadZone from '@/components/UploadZone';
import Preview from '@/components/Preview';
import DownloadButton from '@/components/DownloadButton';
import { convertPngToSvg, isWasmSupported } from '@/lib/converter';

type ConversionStatus = 'idle' | 'converting' | 'done' | 'error';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [wasmSupported, setWasmSupported] = useState(true);

  useEffect(() => {
    setWasmSupported(isWasmSupported());
  }, []);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setSvgContent(null);
    setError(null);
    setStatus('converting');

    try {
      const svg = await convertPngToSvg(selectedFile);
      setSvgContent(svg);
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
      setStatus('error');
    }
  }, []);

  const handleReset = useCallback(() => {
    setFile(null);
    setSvgContent(null);
    setStatus('idle');
    setError(null);
  }, []);

  if (!wasmSupported) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">Browser Not Supported</h2>
          <p className="text-gray-400">Your browser does not support WebAssembly. Please use a modern browser.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          PNG to SVG
        </h1>
        <p className="mt-4 text-gray-400 max-w-md mx-auto">
          Convert PNG images to high-quality vector SVG files.
          Free, fast, and completely private.
        </p>

        {/* Privacy Badge */}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-sm text-green-400">100% Private - All processing happens in your browser</span>
        </div>
      </div>

      {/* Main Content */}
      {status === 'idle' && (
        <UploadZone onFileSelect={handleFileSelect} />
      )}

      {status === 'converting' && (
        <div className="text-center space-y-6">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-xl font-medium text-white">Converting...</p>
            <p className="mt-2 text-sm text-gray-400">Processing your image</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p className="text-xl font-medium text-white">Conversion Failed</p>
            <p className="mt-2 text-sm text-red-400">{error}</p>
          </div>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {status === 'done' && (
        <div className="w-full flex flex-col items-center">
          <Preview originalFile={file} svgContent={svgContent} />

          <div className="flex items-center gap-4 mt-8">
            <DownloadButton
              svgContent={svgContent}
              fileName={file?.name || 'converted.svg'}
            />
            <button
              onClick={handleReset}
              className="px-6 py-4 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
            >
              Convert Another
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center text-xs text-gray-600">
        Powered by vtracer
      </footer>
    </main>
  );
}
