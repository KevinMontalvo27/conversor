// src/lib/conversions.ts

/**
 * 1. MAPA DE LÓGICA DE CONVERSIÓN (la "verdad" de tu app)
 * Idéntico al de tu backend en Python.
 * Clave: Extensión de ENTRADA. Valor: Lista de extensiones de SALIDA permitidas.
 */

// Grupos para no repetir
const DOC_FORMATS = ["pdf", "docx", "doc", "odt", "rtf", "txt", "html", "epub", "png", "jpg"];
const SHEET_FORMATS = ["pdf", "xlsx", "xls", "ods", "csv", "html"];
const PRES_FORMATS = ["pdf", "pptx", "ppt", "odp", "gif", "png", "jpg"];
const DRAW_FORMATS = ["pdf", "png", "jpg", "svg", "odg"];

// El mapa principal
// Lo exportamos para que App.tsx pueda usarlo
export const VALID_CONVERSIONS: Record<string, string[]> = {
    // Documentos
    "docx": DOC_FORMATS,
    "doc": DOC_FORMATS,
    "odt": DOC_FORMATS,
    "rtf": DOC_FORMATS,
    "txt": ["pdf", "docx", "odt", "rtf"],
    
    // Hojas de Cálculo
    "xlsx": SHEET_FORMATS,
    "xls": SHEET_FORMATS,
    "ods": SHEET_FORMATS,
    "csv": ["pdf", "xlsx", "xls", "ods"],
    
    // Presentaciones
    "pptx": PRES_FORMATS,
    "ppt": PRES_FORMATS,
    "odp": PRES_FORMATS,

    // Dibujos/Imágenes/PDF (usamos la lista segura)
    "pdf": ["png", "jpg", "txt", "rtf"], 
    "png": ["pdf"], 
    "jpg": ["pdf"],
    "svg": ["pdf", "png"],
    "odg": DRAW_FORMATS,
};

/**
 * 2. GRUPOS DE FORMATOS (para el <select>)
 * Esta es la lista "maestra" de todos los formatos posibles,
 * que usaremos para construir los <optgroup>
 */
interface FormatGroup {
  group: string;
  values: string[];
}

// Lo exportamos para que FormatSelector.tsx pueda usarlo
export const formatGroups: FormatGroup[] = [
  { group: "Documentos", values: ["pdf", "docx", "doc", "odt", "rtf", "txt", "html", "epub"] },
  { group: "Hojas de Cálculo", values: ["xlsx", "xls", "ods", "csv"] },
  { group: "Presentaciones", values: ["pptx", "ppt", "odp", "gif"] },
  { group: "Imágenes y Dibujos", values: ["png", "jpg", "svg", "rtf", "odg"] },
];