import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  FolderOpen,
  Edit2,
  Edit3,
  AlignLeft,
  Move,
  Eye,
  EyeOff,
  Trash2,
  FileText,
  IndianRupee,
} from 'lucide-react';

interface ContextMenuOption {
  label: string;
  icon: React.ReactNode;
  action: () => void;
  danger?: boolean;
}

interface AdminContextMenuProps {
  x: number;
  y: number;
  title: string;
  type: 'folder' | 'book';
  isVisible: boolean;
  /** Book only: whether the book is currently paid. */
  isPaid?: boolean;
  onClose: () => void;
  onOpen: () => void;
  onQuickEdit: () => void;
  onRename: () => void;
  onEditDescription: () => void;
  onMove: () => void;
  onToggleVisibility: () => void;
  /** Book only: one-click paid/free toggle (no price needed — paid books
   * need their own key). */
  onTogglePaid?: () => void;
  onDelete: () => void;
}

export const AdminContextMenu: React.FC<AdminContextMenuProps> = ({
  x,
  y,
  title,
  type,
  isVisible,
  isPaid,
  onClose,
  onOpen,
  onQuickEdit,
  onRename,
  onEditDescription,
  onMove,
  onToggleVisibility,
  onTogglePaid,
  onDelete,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Adjust coordinates if menu overflows viewport window
  const menuWidth = 190;
  const menuHeight = 260;
  const SAFE_MARGIN = 10;
  const adjustedX = Math.max(SAFE_MARGIN, Math.min(x, window.innerWidth - menuWidth - SAFE_MARGIN));
  const adjustedY = Math.max(SAFE_MARGIN, Math.min(y, window.innerHeight - menuHeight - SAFE_MARGIN));

  const options: ContextMenuOption[] = [
    {
      label: type === 'folder' ? 'Open Folder' : 'Open Book',
      icon: type === 'folder' ? <FolderOpen className="w-3.5 h-3.5 text-[var(--gold)]" /> : <FileText className="w-3.5 h-3.5 text-indigo-400" />,
      action: onOpen,
    },
    {
      label: 'Quick Edit',
      icon: <Edit2 className="w-3.5 h-3.5" />,
      action: onQuickEdit,
    },
    {
      label: 'Rename',
      icon: <Edit3 className="w-3.5 h-3.5" />,
      action: onRename,
    },
    ...(type === 'folder'
      ? [
          {
            label: 'Edit Description',
            icon: <AlignLeft className="w-3.5 h-3.5" />,
            action: onEditDescription,
          },
        ]
      : []),
    {
      label: 'Move',
      icon: <Move className="w-3.5 h-3.5 text-[var(--gold)]" />,
      action: onMove,
    },
    {
      label: isVisible ? 'Hide from Public Library' : 'Make Public',
      icon: isVisible ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />,
      action: onToggleVisibility,
    },
    ...(type === 'book' && onTogglePaid
      ? [
          {
            label: isPaid ? 'Make free' : 'Mark as paid',
            icon: <IndianRupee className="w-3.5 h-3.5 text-[var(--gold)]" />,
            action: onTogglePaid,
          },
        ]
      : []),
    {
      label: 'Delete',
      icon: <Trash2 className="w-3.5 h-3.5 text-rose-400" />,
      action: onDelete,
      danger: true,
    },
  ];

  if (!isVisible) return null;

  return createPortal(
    <div
      ref={menuRef}
      style={{ top: `${adjustedY}px`, left: `${adjustedX}px`, zIndex: 9999 }}
      className="fixed bg-[var(--bg-surface)] border border-[var(--border-main)] shadow-2xl rounded-md py-1.5 min-w-[180px] text-xs font-sans animate-fade-in divide-y divide-[var(--border-subtle)]"
    >
      <div className="px-3 py-1 text-[10px] text-[var(--text-muted)] font-semibold truncate max-w-[200px]">
        {title}
      </div>

      <div className="py-1">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => {
              opt.action();
              onClose();
            }}
            className={`w-full px-3 py-1.5 text-left flex items-center gap-2 transition-colors hover:bg-[var(--bg-hover)] cursor-pointer ${
              opt.danger
                ? 'text-rose-400 font-medium'
                : 'text-[var(--text-main)] font-normal'
            }`}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
};
