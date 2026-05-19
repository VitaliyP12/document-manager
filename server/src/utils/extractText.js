const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function extractText(filePath, fileType, originalName) {
  try {
    const ext = path.extname(originalName).toLowerCase();
    const fullPath = path.join(__dirname, '../../uploads', filePath);

    if (!fs.existsSync(fullPath)) return null;

    if (ext === '.pdf' || fileType === 'application/pdf') {
      const dataBuffer = fs.readFileSync(fullPath);
      const data = await pdfParse(dataBuffer);
      return cleanText(data.text);
    }

    if (ext === '.docx' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ path: fullPath });
      return cleanText(result.value);
    }

    if (ext === '.txt' || ext === '.csv' || ext === '.json' || ext === '.html' || fileType?.startsWith('text/')) {
      const text = fs.readFileSync(fullPath, 'utf8');
      return cleanText(text);
    }

    return null;
  } catch (err) {
    console.error('Помилка витягу тексту:', err.message);
    return null;
  }
}

function cleanText(text) {
  if (!text) return null;
  const cleaned = text
    .replace(/\s+/g, ' ')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim();
  return cleaned.length > 0 ? cleaned.substring(0, 1000000) : null;
}

module.exports = { extractText };