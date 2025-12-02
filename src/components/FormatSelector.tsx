// src/components/FormatSelector.tsx

import { type ChangeEvent } from 'react';
// Importamos la lista maestra de grupos
import { formatGroups } from '../lib/conversions';

/**
 * 1. Definición de las Props
 *
 * @param availableFormats - ¡NUEVA PROP! La lista de formatos ['pdf', 'txt']
 * que SÍ están permitidos para el archivo actual.
 * @param selectedFormat - El valor actual del formato (ej. "pdf").
 * @param onFormatChange - Callback para notificar al padre del cambio.
 */
interface FormatSelectorProps {
  availableFormats: string[]; // <-- ¡NUEVA!
  selectedFormat: string;
  onFormatChange: (value: string) => void;
}

function FormatSelector({ 
  availableFormats, 
  selectedFormat, 
  onFormatChange 
}: FormatSelectorProps) {
  
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFormatChange(e.target.value);
  };

  /**
   * 2. Renderizado Dinámico
   */
  return (
    <div>
      <label 
        htmlFor="format-select" 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Convertir a:
      </label>
      
      <select
        id="format-select"
        value={selectedFormat}
        onChange={handleChange}
        className="
          w-full p-2.5 border border-gray-300 rounded-lg shadow-sm 
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          text-gray-900 bg-gray-50
        "
      >
        {/* 3. Lógica de Filtrado:
          Iteramos sobre la lista 'maestra' de grupos
        */}
        {formatGroups.map((group) => {
          
          // Filtramos los valores del grupo:
          // Solo nos quedamos con los que SÍ están en 'availableFormats'
          const validFormatsInGroup = group.values.filter(format => 
            availableFormats.includes(format)
          );

          // Si no hay formatos válidos en este grupo, no renderizamos el <optgroup>
          if (validFormatsInGroup.length === 0) {
            return null;
          }

          // Renderizamos el grupo solo con las opciones válidas
          return (
            <optgroup label={group.group} key={group.group}>
              {validFormatsInGroup.map((format) => (
                <option key={format} value={format}>
                  {format.toUpperCase()}
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>
    </div>
  );
}

export default FormatSelector;  