import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type FileUploadProps = {
  accept: string;
  maxSize?: number; // in MB
  onFileSelect: (file: File) => void;
  supportedFormats: string; // e.g., "MP3, WAV, M4A"
  className?: string;
};

export function FileUpload({
  accept,
  maxSize = 20,
  onFileSelect,
  supportedFormats,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    setError(null);

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return false;
    }

    // Check file type
    const fileType = file.type;
    const acceptedTypes = accept.split(",");
    if (!acceptedTypes.some(type => fileType.match(type))) {
      setError(`Invalid file type. Supported formats: ${supportedFormats}`);
      return false;
    }

    return true;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all",
          "flex flex-col items-center justify-center h-64",
          isDragging && "border-accent-teal bg-accent-teal/10",
          selectedFile ? "border-accent-teal" : "border-gray-700",
          "hover:border-accent-teal hover:bg-accent-teal/10"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <UploadCloud
          className={cn(
            "h-12 w-12 mb-3",
            selectedFile ? "text-accent-teal" : "text-gray-400"
          )}
        />
        
        {selectedFile ? (
          <div className="text-center">
            <p className="text-white font-medium mb-1">{selectedFile.name}</p>
            <p className="text-gray-400 text-sm">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-300 text-center">
              Drag & drop your file here or <span className="text-accent-teal">browse</span>
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Supported formats: {supportedFormats} (Max {maxSize}MB)
            </p>
          </>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />
      </div>
      
      {error && (
        <p className="text-destructive mt-2 text-sm">{error}</p>
      )}
      
      {selectedFile && (
        <div className="mt-2 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFile(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
          >
            Remove file
          </Button>
        </div>
      )}
    </div>
  );
}
