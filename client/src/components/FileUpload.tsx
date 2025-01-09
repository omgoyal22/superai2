import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      console.log("File dropped:", file.name);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div 
      className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <Upload className="w-12 h-12 mx-auto mb-4 text-blue-500" />
      <h3 className="text-lg font-semibold mb-2">Upload CSV File</h3>
      <p className="text-sm text-gray-400 mb-4">Drag and drop or click to select</p>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Select File
      </label>
    </div>
  );
}
