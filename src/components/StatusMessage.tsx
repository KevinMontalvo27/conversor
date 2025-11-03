

/**
 *
 * @param message - El string del mensaje a mostrar.
 * @param type - El tipo de mensaje, para aplicar el estilo correcto.
 */
interface StatusMessageProps {
  message: string;
  // Usamos un tipo literal para 'type' para restringir las opciones
  type: 'error' | 'success'; 
}

/**
 * Un banner para mostrar mensajes de estado al usuario (ej. errores).
 */
function StatusMessage({ message, type }: StatusMessageProps) {
  
  // Si no hay mensaje, no renderiza nada.
  if (!message) {
    return null;
  }

  /**
   * 2. Mapa de Estilos
   * Un objeto para seleccionar las clases de Tailwind
   * basadas en la prop 'type'.
   */
  const styles: Record<string, string> = {
    error: 'bg-red-100 text-red-700 border border-red-300',
    success: 'bg-green-100 text-green-700 border border-green-300',
  };

  /**
   * 3. Renderizado del Componente
   */
  return (
    <div 
      className={`
        w-full p-3 rounded-lg text-center text-sm font-medium
        ${styles[type] || styles.error} 
      `}
      role="alert"
    >
      {message}
    </div>
  );
}

export default StatusMessage;