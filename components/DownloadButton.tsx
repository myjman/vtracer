'use client';

interface DownloadButtonProps {
  svgContent: string | null;
  fileName: string;
}

export default function DownloadButton({ svgContent, fileName }: DownloadButtonProps) {
  if (!svgContent) {
    return null;
  }

  const handleDownload = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.png$/i, '.svg');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="
        group relative px-8 py-4 mt-8
        bg-gradient-to-r from-purple-600 to-pink-600
        hover:from-purple-500 hover:to-pink-500
        rounded-xl font-semibold text-white
        transition-all duration-300
        hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25
        active:scale-100
      "
    >
      <span className="flex items-center gap-3">
        <svg
          className="w-5 h-5 transition-transform group-hover:-translate-y-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Download SVG
      </span>
    </button>
  );
}
