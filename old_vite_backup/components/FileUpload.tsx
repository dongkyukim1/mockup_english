import React, { useState, useCallback, useRef } from 'react';
import type { VocabularyItem } from '../types';
import { parseExcelFile } from '../services/excelParser';
import { UploadCloudIcon, CheckCircleIcon, FileTextIcon } from './icons';

interface FileUploadProps {
  onFileParsed: (data: VocabularyItem[]) => void;
  vocabCount: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileParsed, vocabCount }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.xlsx')) {
        setError('잘못된 파일 형식입니다. .xlsx 파일을 업로드하세요.');
        setFileName(null);
        onFileParsed([]);
        return;
      }

      setIsParsing(true);
      setError(null);
      setFileName(file.name);
      try {
        const data = await parseExcelFile(file);
        onFileParsed(data);
      } catch (err) {
        console.error("Parsing error:", err);
        setError('파일 분석에 실패했습니다. 올바른 엑셀 파일과 정확한 열이 있는지 확인하세요.');
        onFileParsed([]);
      } finally {
        setIsParsing(false);
      }
    }
  }, [onFileParsed]);
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const file = event.dataTransfer.files?.[0];
      if (file && fileInputRef.current) {
          fileInputRef.current.files = event.dataTransfer.files;
          const changeEvent = new Event('change', { bubbles: true });
          fileInputRef.current.dispatchEvent(changeEvent);
      }
  }, []);

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="w-full">
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          htmlFor="file-upload" 
          className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer transition-colors duration-300 bg-white dark:bg-gray-800"
        >
            <div className="flex flex-col items-center">
                <UploadCloudIcon className="w-12 h-12 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                    여기에 .xlsx 파일을 드래그 앤 드롭하거나 <span className="text-blue-600 dark:text-blue-400">파일 찾기</span>
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">필수 열: "English", "Korean", "Sentence"</span>
                <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                />
            </div>
            
            <div className="my-6 border-t border-dashed border-gray-300 dark:border-gray-600"></div>

            <div className="w-full text-left">
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">파일 형식 예시</h4>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    다음과 같이 첫 번째 행에 "English", "Korean", "Sentence" 헤더가 있는 .xlsx 파일을 사용하세요.
                </p>
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            English
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Korean
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Sentence
                        </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">apple</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">사과</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">I ate an apple for breakfast.</td>
                        </tr>
                        <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">study</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">공부하다</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">He needs to study for his exam.</td>
                        </tr>
                        <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">beautiful</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">아름다운</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">The sunset was beautiful.</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
        </label>
        
        {isParsing && <div className="mt-4 text-center text-gray-500 dark:text-gray-400">파일 분석 중...</div>}
        {error && <div className="mt-4 text-center text-red-500">{error}</div>}
        
        {fileName && !isParsing && !error && (
            <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-4 rounded-lg flex items-center justify-between shadow-sm">
                <div className="flex items-center">
                    <FileTextIcon className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
                    <div>
                        <p className="font-medium text-green-800 dark:text-green-200">{fileName}</p>
                        <p className="text-sm text-green-600 dark:text-green-300">{vocabCount}개의 단어를 찾았습니다.</p>
                    </div>
                </div>
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
            </div>
        )}
    </div>
  );
};

export default FileUpload;