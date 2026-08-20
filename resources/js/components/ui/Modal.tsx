import React, { useEffect } from 'react';
import { cn } from '@/shared/lib/utils';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dialog container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          className={cn(
            'relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full my-8 animate-in zoom-in-95 duration-200 border border-slate-100',
            maxWidths[maxWidth]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || description) && (
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between">
              <div>
                {title && <h3 className="text-lg font-semibold text-slate-900 leading-6">{title}</h3>}
                {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors hover:bg-slate-100 -mr-2 -mt-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Body */}
          <div className="px-6 py-5">{children}</div>
        </div>
      </div>
    </div>
  );
};
