import React, { useState } from 'react';
import { UploadCloud, Loader2, CheckCircle2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface FileUploaderProps {
  bucketName: 'public_assets' | 'product_files';
  folderPath: string; // e.g. "covers", "ebooks"
  acceptedTypes?: string; // e.g. "image/*", "application/pdf"
  onUploadSuccess: (publicUrl: string) => void;
  label?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  bucketName, 
  folderPath, 
  acceptedTypes = "*",
  onUploadSuccess,
  label = "Fazer Upload de Ficheiro"
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(10); // Fake progress to show UI quickly

    try {
      // Create unique filename to prevent overwriting
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${folderPath}/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;
      
      setUploadProgress(100);

      // Get public URL
      if (bucketName === 'public_assets') {
        const { data: publicData } = supabase.storage
          .from('public_assets')
          .getPublicUrl(data.path);
        
        setUploadedUrl(publicData.publicUrl);
        onUploadSuccess(publicData.publicUrl);
      } else {
        // For private files, we just store the storage path
        // To play/download them later we will generate signed URLs
        const privatePath = data.path;
        setUploadedUrl(privatePath);
        onUploadSuccess(privatePath);
      }

    } catch (err: any) {
      console.error('Upload Error:', err);
      setError(err.message || 'Falha ao fazer upload do ficheiro.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-slate-300 mb-1">{label}</label>
      
      {!uploadedUrl && !isUploading && (
        <div className="relative group w-full border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl bg-slate-950/50 hover:bg-blue-500/5 transition-all cursor-pointer">
          <input 
            type="file" 
            accept={acceptedTypes}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="p-6 flex flex-col items-center justify-center text-center space-y-2 pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 transition-all">
              <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-white" />
            </div>
            <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
              Clique ou arraste um ficheiro
            </p>
            <p className="text-[10px] text-slate-500">
              Formatos aceites: {acceptedTypes === '*' ? 'Todos os ficheiros' : acceptedTypes}
            </p>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="w-full p-6 border-2 border-slate-800 rounded-xl bg-slate-950 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          <p className="text-xs text-blue-400 font-medium">A carregar ficheiro para a nuvem... {uploadProgress}%</p>
        </div>
      )}

      {uploadedUrl && !isUploading && (
        <div className="w-full p-4 border border-emerald-500/30 bg-emerald-500/10 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3 truncate pr-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="text-sm font-medium text-emerald-300 truncate">
              Upload concluído com sucesso
            </span>
          </div>
          <button 
            type="button"
            onClick={() => setUploadedUrl(null)}
            className="p-1 hover:bg-emerald-500/20 rounded-md text-emerald-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
          <X className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
};
