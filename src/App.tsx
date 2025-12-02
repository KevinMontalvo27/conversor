// src/App.tsx

// ¡Importamos useEffect!
import { useState, useEffect } from 'react';
import axios, { type AxiosError } from 'axios';
import fileDownload from 'js-file-download';

// Importamos nuestros componentes
import FileUploader from './components/FileUploader';
import FormatSelector from './components/FormatSelector';
import ConvertButton from './components/ConvertButton';
import StatusMessage from './components/StatusMessage';

// ¡Importamos nuestro mapa de conversiones!
import { VALID_CONVERSIONS } from './lib/conversions';

const API_URL = import.meta.env.VITE_API_BASE_URL + "/convert";

function App() {
  
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>(''); // Inicia vacío
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // ¡NUEVO ESTADO!
  // Almacena la lista de formatos válidos para el archivo actual
  const [availableFormats, setAvailableFormats] = useState<string[]>([]);

  /**
   * ¡NUEVA LÓGICA!
   * Este Hook "observa" la variable 'file'.
   * Cada vez que 'file' cambia, este código se ejecuta.
   */
  useEffect(() => {
    if (!file) {
      // Si no hay archivo, reseteamos todo
      setAvailableFormats([]);
      setTargetFormat('');
      setError('');
      return;
    }

    // 1. Obtenemos la extensión del archivo
    const extension = file.name.split('.').pop()?.toLowerCase() || '';

    // 2. Buscamos las conversiones válidas en nuestro mapa
    const validFormats = VALID_CONVERSIONS[extension] || [];

    // 3. Actualizamos el estado con los formatos válidos
    setAvailableFormats(validFormats);

    // 4. Lógica de "auto-selección"
    if (validFormats.length === 0) {
      // Si no hay conversiones válidas (ej. un .zip)
      setError(`No hay conversiones soportadas para archivos '.${extension}'`);
      setTargetFormat('');
    } else {
      // Si hay conversiones, auto-seleccionamos la primera de la lista
      // (a menos que la que ya estaba seleccionada siga siendo válida)
      if (!validFormats.includes(targetFormat)) {
        setTargetFormat(validFormats[0]);
      }
      setError(''); // Limpiamos errores anteriores
    }
    
  }, [file]); // <-- La "dependencia" del hook: se re-ejecuta solo si 'file' cambia

  /**
   * Lógica de Conversión (sin cambios, pero con mejor validación)
   */
  const handleConvert = async () => {
    if (!file) {
      setError('Por favor, selecciona un archivo primero.');
      return;
    }
    if (!targetFormat) {
      setError('Por favor, selecciona un formato de destino.');
      return;
    }

    setIsLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('to_format', targetFormat);

    try {
      const response = await axios.post(API_URL, formData, {
        responseType: 'blob',
      });
      const downloadName = response.headers['x-filename'] || `${file.name.split('.')[0]}.${targetFormat}`;
      fileDownload(response.data, downloadName);
      setFile(null); // Limpiamos el archivo (esto disparará el useEffect)
    } catch (err) {
      // ... (Manejo de errores idéntico al anterior) ...
      if (axios.isAxiosError(err)) {
        // ... (código de manejo de blob) ...
        const axiosError = err as AxiosError;
        if (axiosError.response && axiosError.response.data instanceof Blob) {
          try {
            const errorBlob = axiosError.response.data as Blob;
            const errorText = await errorBlob.text();
            const errorJson = JSON.parse(errorText);
            setError(errorJson.detail || 'Ocurrió un error desconocido.');
          } catch (parseError) {
            setError('Error al procesar la respuesta de error del servidor.');
          }
        } else {
          setError(axiosError.message || 'Error de conexión.');
        }
      } else {
        setError('Ocurrió un error inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Renderizado
   */
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Mi Conversor de Archivos
        </h2>

        <StatusMessage message={error} type="error" />
        
        <FileUploader
          file={file}
          onFileSelect={setFile} // Esto dispara el useEffect
        />
        
        {/* Renderizado Condicional:
          Solo muestra los selectores si hay formatos válidos
        */}
        {availableFormats.length > 0 && (
          <div className="space-y-4 animate-fade-in"> {/* (Opcional) 'animate-fade-in' */}
            
            <FormatSelector
              selectedFormat={targetFormat}
              onFormatChange={setTargetFormat}
              availableFormats={availableFormats} // <-- Pasamos la lista filtrada
            />
            
            <ConvertButton
              isLoading={isLoading}
              onClick={handleConvert}
            />
          </div>
        )}

      </div>
    </div>
  );
}

// (Opcional) Añade esto a tu 'tailwind.config.js' para una bonita animación
// theme: {
//   extend: {
//     keyframes: {
//       'fade-in': {
//         '0%': { opacity: '0', transform: 'translateY(-10px)' },
//         '100%': { opacity: '1', transform: 'translateY(0)' },
//       },
//     },
//     animation: {
//       'fade-in': 'fade-in 0.3s ease-out',
//     },
//   },
// },

export default App;