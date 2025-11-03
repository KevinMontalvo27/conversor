import { useCallback, type MouseEvent } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi'; // Iconos


interface FileUploaderProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

/**
 * Componente FileUploader:
 * Una zona "drag-and-drop" que renderiza un estado diferente
 * si un archivo está seleccionado o no.
 */
function FileUploader({ file, onFileSelect }: FileUploaderProps) {


  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    
    if (fileRejections.length > 0) {
      console.warn('Archivo rechazado:', fileRejections[0].errors[0].message);
    }
    
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]); // Dependencia del hook

  /**
   * Proporciona las props para nuestros elementos DOM.
   */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    multiple: false,
  });

  /**
   * Se activa al hacer clic en el botón 'X'.
   */
  const handleClearFile = (e: MouseEvent) => {
    // Usamos el tipo 'MouseEvent' que importamos de 'react'
    e.stopPropagation(); // Evita que se dispare el click del dropzone
    onFileSelect(null);  // Notifica al padre que no hay archivo
  };

  // --- Renderizado Condicional ---

  /**
   * 6. Vista si SÍ hay un archivo
   */
  if (file) {
    return (
      <div className="flex items-center justify-between w-full p-4 border border-green-300 bg-green-50 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3 min-w-0">
          <FiFile className="w-6 h-6 text-green-700 flex-shrink-0" />
          {/* 'truncate' es clave para nombres de archivo largos */}
          <span className="text-sm font-medium text-green-800 truncate">
            {file.name}
          </span>
        </div>
        <button
          onClick={handleClearFile}
          className="p-1 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors flex-shrink-0"
          aria-label="Quitar archivo"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
    );
  }

  /**
   * 7. Vista si NO hay archivo (la zona de drop)
   */
  return (
    <div
      {...getRootProps()}
      className={`
        p-10 border-2 border-dashed rounded-lg text-center cursor-pointer 
        transition-colors duration-200 ease-in-out
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }
      `}
    >
      {/* El input real está oculto pero es funcional */}
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center justify-center text-gray-500 pointer-events-none">
        <FiUploadCloud className="w-12 h-12 mb-4 text-gray-400" />
        
        {isDragActive ? (
          <p className="font-semibold text-blue-600">¡Suelta el archivo aquí!</p>
        ) : (
          <p className="font-semibold text-gray-600">
            Arrastra un archivo o haz clic para seleccionar
          </p> // <-- ¡CORREGIDO!
        )}
        
        <p className="mt-2 text-sm text-gray-500">
          Soporta .docx, .pptx, .xlsx, .pdf, y más...
        </p>
      </div>
    </div>
  );
}

export default FileUploader;