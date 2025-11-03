import { useState } from 'react';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('pdf');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleConvert = async () => {
    // Aquí irá tu lógica de Axios...
    console.log(`Convirtiendo ${file?.name} a ${targetFormat}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Mi Conversor de Archivos
        </h2>
        
        {/* Aquí irán tus otros componentes */}
        
      </div>
    </div>
  );
}

export default App;