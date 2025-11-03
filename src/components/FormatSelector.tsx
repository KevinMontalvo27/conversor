import { type ChangeEvent } from 'react';

 
interface FormatGroup {
    group: string;
    values: string[];
}

const formatOptions: FormatGroup[] = [
    { group: "Documentos", values: ["pdf", "docx", "doc", "odt", "rtf", "txt", "html", "epub"] },
    { group: "Hojas de Cálculo", values: ["xlsx", "xls", "ods", "csv"] },
    { group: "Presentaciones", values: ["pptx", "ppt", "odp", "gif"] },
    { group: "Imágenes y Dibujos", values: ["png", "jpg", "svg", "rtf"] }, // 'rtf' desde PDF
];

/**
 * 3. Definición de las Props
 *
 * @param selectedFormat - El valor actual del formato (ej. "pdf").
 * @param onFormatChange - Función callback para notificar al padre (App.tsx)
 * cuando el usuario selecciona un nuevo formato.
 */
interface FormatSelectorProps {
    selectedFormat: string;
    onFormatChange: (value: string) => void;
}

function FormatSelector({ selectedFormat, onFormatChange }: FormatSelectorProps) {
    
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        // Notifica al componente padre (App.tsx) del nuevo valor
        onFormatChange(e.target.value);
    };

    /**
     * 5. Renderizado del Componente
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
            {/* Mapeamos sobre cada grupo (ej. "Documentos") 
            para crear una etiqueta <optgroup> 
            */}
            {formatOptions.map((group) => (
            <optgroup label={group.group} key={group.group}>
                {/* Dentro de cada grupo, mapeamos sobre sus valores (ej. "pdf", "docx")
                para crear cada <option>
                */}
                {group.values.map((format) => (
                <option key={format} value={format}>
                    {format.toUpperCase()}
                </option>
                ))}
            </optgroup>
            ))}
        </select>
        </div>
    );
}

export default FormatSelector;