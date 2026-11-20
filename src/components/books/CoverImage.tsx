import React, { memo, useState } from 'react';
import { generateFallbackCoverSvg } from '../../services/fallbackCover';
import { Book } from '../../types';
import { getItemType, getItemUrl, getTypeLabel, getTypeBadgeColor, getFileExtension, getBookCoverUrl } from '../../utils/fileUtils';
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon,
  Video as VideoIcon,
  Music as AudioIcon,
  Archive as ArchiveIcon,
  File as GenericFileIcon,
  BookOpen,
} from 'lucide-react';

interface CoverImageProps {
  book?: Book;
  coverUrl?: string;
  fileUrl?: string;
  title?: string;
  author?: string;
  category?: string;
  fileType?: string;
  className?: string;
  /**
   * Drive thumbnail width. Grid cards render ~170-190 px wide on a
   * phone, so they ask for w300; larger views keep the default w400.
   * Only rewrites a Drive thumbnail URL, nothing else.
   */
  thumbWidth?: number;
}

// Memoised: a cover only changes when its own props change. The card
// list re-renders on every favourite tap / keystroke, and without this
// each of the 138 covers re-rendered (and re-resolved its URL) with it.
export const CoverImage: React.FC<CoverImageProps> = memo(({
  book,
  coverUrl,
  fileUrl,
  title,
  author,
  category,
  fileType,
  className = 'w-full h-full object-cover',
  thumbWidth = 400,
}) => {
  const [imageError, setImageError] = useState(false);

  const itemTitle = book?.title || title || 'Untitled File';
  const itemAuthor = book?.author || author || '';
  const itemCategory = book?.category || category || '';
  const itemType = getItemType(book || { fileType: fileType as any, fileUrl, title: itemTitle });
  // Real first page from Drive first (getBookCoverUrl), then any stored cover,
  // then the image file itself. Paid books have no Drive id for visitors, so
  // they fall through to the generated title cover below — no leak.
  const rawUrl = book?.thumbnailUrl || book?.coverUrl || coverUrl || getBookCoverUrl(book) || (itemType === 'image' ? (book?.fileUrl || fileUrl) : undefined);
  // Grid cards ask for a smaller Drive thumbnail (see thumbWidth):
  // the fileUtils default is w400, which is ~2x the displayed size.
  const thumbUrl =
    rawUrl && thumbWidth !== 400 && rawUrl.includes('drive.google.com/thumbnail')
      ? rawUrl.replace(/([?&])sz=w\d+/, `$1sz=w${thumbWidth}`)
      : rawUrl;

  const ext = getFileExtension(book?.fileUrl || fileUrl || itemTitle).toUpperCase();
  const badgeColor = getTypeBadgeColor(itemType);

  // If we have an actual image URL and no loading error
  if (thumbUrl && !imageError) {
    return (
      <div className="relative w-full h-full bg-[var(--bg-surface)] overflow-hidden group/cover flex items-center justify-center">
        <img
          src={thumbUrl}
          alt={`Thumbnail for ${itemTitle}`}
          onError={() => setImageError(true)}
          className={`${className} transition-transform duration-500 group-hover/cover:scale-105`}
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 border border-black/10 dark:border-white/10 pointer-events-none" />
      </div>
    );
  }

  // If file is an Image but URL failed or is missing
  if (itemType === 'image') {
    return (
      <div className="w-full h-full bg-emerald-950/20 border border-emerald-500/20 flex flex-col items-center justify-center p-3 text-center space-y-2">
        <ImageIcon className="w-8 h-8 text-emerald-400" />
        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">Image</span>
      </div>
    );
  }

  // If file is Video
  if (itemType === 'video') {
    return (
      <div className="w-full h-full bg-purple-950/30 border border-purple-500/20 flex flex-col items-center justify-center p-3 text-center space-y-2">
        <div className="p-2.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
          <VideoIcon className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-semibold">{ext || 'VIDEO'}</span>
      </div>
    );
  }

  // If file is Audio
  if (itemType === 'audio') {
    return (
      <div className="w-full h-full bg-amber-950/30 border border-amber-500/20 flex flex-col items-center justify-center p-3 text-center space-y-2">
        <div className="p-2.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <AudioIcon className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-semibold">{ext || 'AUDIO'}</span>
      </div>
    );
  }

  // If file is Document (DOC, XLS, PPT, TXT, MD)
  if (itemType === 'document') {
    return (
      <div className="w-full h-full bg-blue-950/30 border border-blue-500/20 flex flex-col items-center justify-center p-3 text-center space-y-2">
        <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
          {['XLS', 'XLSX', 'CSV'].includes(ext) ? (
            <FileSpreadsheet className="w-6 h-6" />
          ) : ['TXT', 'MD'].includes(ext) ? (
            <FileCode className="w-6 h-6" />
          ) : (
            <FileText className="w-6 h-6" />
          )}
        </div>
        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider font-semibold">{ext || 'DOC'}</span>
      </div>
    );
  }

  // If file is Archive (ZIP, RAR, 7Z)
  if (itemType === 'archive') {
    return (
      <div className="w-full h-full bg-orange-950/30 border border-orange-500/20 flex flex-col items-center justify-center p-3 text-center space-y-2">
        <div className="p-2.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
          <ArchiveIcon className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider font-semibold">{ext || 'ARCHIVE'}</span>
      </div>
    );
  }

  // For PDF or Books, fallback to generated book cover SVG
  const fallbackSrc = generateFallbackCoverSvg(itemTitle, itemAuthor, itemCategory);

  return (
    <div className="relative w-full h-full bg-[#110e0a] overflow-hidden group/cover">
      <img
        src={fallbackSrc}
        alt={`Cover for ${itemTitle}`}
        className={`${className} transition-transform duration-500 group-hover/cover:scale-105`}
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 border border-white/5 pointer-events-none" />
    </div>
  );
});
