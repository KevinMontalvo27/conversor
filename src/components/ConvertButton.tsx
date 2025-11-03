/**
 * 1. Definición de las Props
 *
 * @param isLoading - Booleano que indica si la conversión está en progreso.
 * @param onClick - Función callback que se ejecuta al hacer clic.
 */
interface ConvertButtonProps {
  isLoading: boolean;
  onClick: () => void;
}


function ConvertButton({ isLoading, onClick }: ConvertButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        w-full p-3 text-white font-bold rounded-lg transition-all 
        flex items-center justify-center space-x-2
        ${isLoading 
          ? 'bg-gray-400 cursor-not-allowed' // Estilo cuando está cargando/deshabilitado
          : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800' // Estilo normal
        }
      `}
    >
      {/* Renderizado condicional:
        Muestra el spinner O el texto "Convertir".
      */}
      {isLoading ? (
        <>
          {/* Un simple spinner SVG de Tailwind */}
          <svg 
            className="animate-spin h-5 w-5 text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Convirtiendo...</span>
        </>
      ) : (
        <span>Convertir</span>
      )}
    </button>
  );
}

export default ConvertButton;