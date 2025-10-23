
import type { VocabularyItem } from '../types';

declare var XLSX: any;

export const parseExcelFile = (file: File): Promise<VocabularyItem[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        if (!event.target?.result) {
          return reject(new Error("File could not be read."));
        }
        const data = new Uint8Array(event.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        const vocabularyList = json.map((row: any) => ({
          "English Word": String(row["English"] || '').trim(),
          "Korean Translation": String(row["Korean"] || '').trim(),
          "Example Sentence": String(row["Sentence"] || '').trim(),
        })).filter(item => item["English Word"] && item["Korean Translation"] && item["Example Sentence"]);

        resolve(vocabularyList as VocabularyItem[]);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};
