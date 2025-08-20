"use client";

import { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle, File, Image, FileText } from 'lucide-react';
import { useUploadThing } from '@/lib/uploadthing';
import { cn } from '@/lib/utils';

interface FileUploadButtonProps {
  endpoint: 'documentUploader' | 'projectAttachment' | 'taskAttachment' | 'eventMedia' | 'profileImage';
  onUploadComplete?: (files: { url: string; name: string }[]) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
  multiple?: boolean;
  accept?: string;
  maxSize?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

interface UploadedFile {
  name: string;
  url: string;
  size: number;
  type: string;
}

export function FileUploadButton({
  endpoint,
  onUploadComplete,
  onUploadError,
  className,
  multiple = true,
  accept,
  maxSize = '16MB',
  disabled = false,
  children,
}: FileUploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const { startUpload, permittedFileInfo } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      const files = res?.map(file => ({
        url: file.url,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream'
      })) || [];
      
      setUploadedFiles(prev => [...prev, ...files]);
      setIsUploading(false);
      setUploadProgress({});
      
      if (onUploadComplete) {
        onUploadComplete(files.map(f => ({ url: f.url, name: f.name })));
      }
    },
    onUploadError: (error) => {
      console.error('Upload error:', error);
      setIsUploading(false);
      setUploadProgress({});
      
      if (onUploadError) {
        onUploadError(error);
      }
    },
    onUploadBegin: (name) => {
      setIsUploading(true);
      setUploadProgress(prev => ({ ...prev, [name]: 0 }));
    },
    onUploadProgress: (progress) => {
      setUploadProgress(prev => ({ ...prev, [`file-${Date.now()}`]: progress }));
    },
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    try {
      await startUpload(fileArray);
    } catch (error) {
      console.error('Failed to start upload:', error);
      if (onUploadError) {
        onUploadError(error as Error);
      }
    }

    // Reset the input
    event.target.value = '';
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="relative">
        <input
          type="file"
          multiple={multiple}
          accept={accept || permittedFileInfo?.config?.image?.acceptedFileTypes?.join(',')}
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          id={`file-upload-${endpoint}`}
        />
        <label
          htmlFor={`file-upload-${endpoint}`}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors',
            isUploading && 'opacity-50 cursor-not-allowed',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
        >
          {isUploading ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {children || (
            <span>
              {isUploading ? 'Uploading...' : `Upload ${multiple ? 'Files' : 'File'}`}
              {maxSize && ` (Max ${maxSize})`}
            </span>
          )}
        </label>
      </div>

      {/* Upload Progress */}
      {isUploading && Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300 truncate">{fileName}</span>
                <span className="text-xs text-gray-400">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Uploaded Files</h4>
          {uploadedFiles.map((file, index) => (
            <div
              key={`${file.url}-${index}`}
              className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700"
            >
              <div className="text-green-400">
                {getFileIcon(file.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-400">
                  {formatFileSize(file.size)}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File Type Info */}
      {permittedFileInfo && (
        <div className="text-xs text-gray-500">
          <p>
            Accepted: {permittedFileInfo.config?.image?.acceptedFileTypes?.join(', ') || 'Various file types'}
          </p>
          <p>
            Max size: {permittedFileInfo.config?.image?.maxFileSize || maxSize}
          </p>
        </div>
      )}
    </div>
  );
}
