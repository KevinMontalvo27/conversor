// 1. Importaciones de Hooks y Librerías
import { useState } from 'react';
import axios, { type AxiosError } from 'axios'; // 'AxiosError' es para tipar errores
import fileDownload from 'js-file-download';

// 2. Importaciones de tus Componentes
import FileUploader from './components/FileUploader';
import FormatSelector from './components/FormatSelector';
import ConvertButton from './components/ConvertButton';
import StatusMessage from './components/StatusMessage';

// 3. Obtenemos la URL de la API desde tu archivo .env
const API_URL = import.meta.env.VITE_API_BASE_URL + "/convert";

/**
 * Componente Principal de la Aplicación
 */
function App() {
  
  // 4. Definición de todos los estados de la aplicación
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('pdf'); // Inicia en 'pdf'
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  /**
   * 5. Función Principal: Maneja la lógica de conversión
   */
  const handleConvert = async () => {
    // Validación simple
    if (!file) {
      setError('Por favor, selecciona un archivo primero.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Preparamos el FormData para enviar a la API
    const formData = new FormData();
    formData.append('file', file);
    formData.append('to_format', targetFormat);

    try {
      // 6. Llamada a la API con Axios
      const response = await axios.post(API_URL, formData, {
        // MUY IMPORTANTE: Le decimos a Axios que esperamos un archivo
        responseType: 'blob', 
      });

      // 7. Éxito: Iniciar la descarga del archivo
      // Leemos el nombre del header 'X-Filename' que definimos en el backend
      const downloadName = response.headers['x-filename'] || `${file.name.split('.')[0]}.${targetFormat}`;
      fileDownload(response.data, downloadName);
      
      setFile(null); // Limpiamos el archivo del uploader

    } catch (err) {
      // 8. Manejo de Errores
      // El error de FastAPI viene como un 'blob'. Debemos leerlo.
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response && axiosError.response.data instanceof Blob) {
          try {
            // Convertimos el error (blob) a texto, luego a JSON
            const errorBlob = axiosError.response.data as Blob;
            const errorText = await errorBlob.text();
            const errorJson = JSON.parse(errorText);
            
            // Usamos el 'detail' que envía FastAPI
            setError(errorJson.detail || 'Ocurrió un error desconocido.');
          } catch (parseError) {
            setError('Error al procesar la respuesta de error del servidor.');
          }
        } else {
          // Si no es un blob, es un error de red
          setError(axiosError.message || 'Error de conexión. ¿Está el servidor activo?');
        }
      } else {
        // Error inesperado
        setError('Ocurrió un error inesperado.');
      }
      console.error(err);
    } finally {
      // 9. Pase lo que pase, dejamos de cargar
      setIsLoading(false);
    }
  };

  /**
   * 10. Renderizado del JSX
   * Aquí conectamos todos los componentes
   */
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Mi Conversor de Archivos
        </h2>

        {/* El componente de error solo se muestra si hay un mensaje */}
        <StatusMessage message={error} type="error" />
        
        {/* Pasamos el estado 'file' y la función 'setFile' */}
        <FileUploader
          file={file}
          onFileSelect={setFile}
        />
        
        {/* Este bloque solo se muestra si hay un archivo seleccionado */}
        {file && (
          <div className="space-y-4">
            {/* Pasamos el estado 'targetFormat' y la función 'setTargetFormat' */}
            <FormatSelector
              selectedFormat={targetFormat}
              onFormatChange={setTargetFormat}
            />
            
            {/* Pasamos el estado 'isLoading' y la función 'handleConvert' */}
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

export default App;