
import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';

interface CodePreviewModalProps {
  title: string;
  code: string;
  language: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CodePreviewModal: React.FC<CodePreviewModalProps> = ({ title, code, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center gap-4">
            <button onClick={handleCopy} className="flex items-center gap-2 text-sm bg-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-600 transition-colors">
              <Icon name="copy" className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <Icon name="close" className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="p-4 overflow-y-auto">
          <pre className="bg-slate-900 p-4 rounded-md">
            <code className={`language-${'javascript'} text-sm text-white`}>
              {code}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
