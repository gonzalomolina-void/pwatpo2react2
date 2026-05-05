/* global process */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración para emular __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Captura de argumentos: node optimize-images.js [input] [output] [width]
const args = process.argv.slice(2);
const inputDirName = args[0] || 'ToOptimize';
const outputDirName = args[1] || 'public/cards';
const targetWidth = parseInt(args[2]) || 500;

const inputFolder = path.resolve(__dirname, inputDirName);
const outputFolder = path.resolve(__dirname, outputDirName);

// Crear carpeta de salida si no existe
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
}

console.log(`🚀 Iniciando optimización: [${inputDirName}] -> [${outputDirName}] (Ancho: ${targetWidth}px)`);

try {
    if (!fs.existsSync(inputFolder)) {
        throw new Error(`La carpeta de origen "${inputDirName}" no existe.`);
    }

    const files = fs.readdirSync(inputFolder);
    const imageFiles = files.filter(file => /\.(png|jpg|jpeg|webp)$/i.test(file));

    if (imageFiles.length === 0) {
        console.log(`⚠️ No se encontraron imágenes en ${inputDirName}.`);
    } else {
        imageFiles.forEach(async (file) => {
            const inputPath = path.join(inputFolder, file);
            const baseName = path.parse(file).name;
            const outputName = `${baseName}.webp`;
            const outputPath = path.join(outputFolder, outputName);

            try {
                await sharp(inputPath)
                    .resize(targetWidth)
                    .webp({ quality: 75 })
                    .toFile(outputPath);
                console.log(`✅ ${file} -> ${outputName}`);
            } catch (err) {
                console.error(`❌ Error procesando ${file}:`, err);
            }
        });
    }
} catch (err) {
    console.error(`❌ Error: ${err.message}`);
}
