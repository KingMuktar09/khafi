export interface ReadingProgress {
  bookId: string;
  percentage: number;
  currentPage?: number;
  totalPages?: number;
  lastUpdated?: string;
}

export interface Folder {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  type?: 'category' | 'folder' | 'subfolder';
  /** Google Drive folder link (webViewLink). Survives server sanitising. */
  externalUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  sortOrder?: number;
  order?: number;
  visible?: boolean;
}

export type ItemType = 'pdf' | 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';

export interface Book {
  id: string;
  title: string;
  originalFilename?: string;
  author: string;
  description: string;
  category: string;
  folderId: string;
  subfolderId?: string | null;
  tags: string[];
  coverUrl?: string;
  thumbnailUrl?: string;
  pdfUrl?: string;
  fileUrl?: string;
  driveUrl?: string;
  driveFileId?: string;
  externalUrl?: string;
  fileType?: ItemType;
  mimeType?: string;
  fileExtension?: string;
  pageCount?: number;
  fileSize?: string;
  addedDate: string;
  updatedDate: string;
  createdAt?: string;
  updatedAt?: string;
  featured: boolean;
  visible: boolean;
  /** Paid-book controls (admin-only). No payment gateway: paymentLink is a link
   * the admin fills in (e.g. UPI/payment page) and access after payment is
   * unlocked manually by the admin. Free books have isPaid false. */
  isPaid?: boolean;
  price?: number;
  priceCurrency?: string;
  paymentLink?: string;
  paymentNote?: string;
  sortOrder?: number;
  publisher?: string;
  year?: string;
  language?: string;
  isbn?: string;
  edition?: string;
  notes?: string;
}

export type LibraryItem = Book;

export type ViewName = 'home' | 'library' | 'favorites' | 'info' | 'book' | 'read' | 'admin';

export interface RouteState {
  view: ViewName;
  folderId?: string | null;
  subfolderId?: string | null;
  bookId?: string | null;
  searchQuery?: string;
}

export type ThemeMode = 'dark' | 'light';

export type AppearanceSetting = 'dark' | 'light' | 'system';
export type AccentColorSetting = 'gold' | 'blue' | 'green' | 'purple' | 'rose';
export type ViewModeSetting = 'list' | 'grid';
export type FontSizeSetting = 'small' | 'medium' | 'large';
export type AnimationsSetting = 'normal' | 'reduced';

export type SortFieldSetting = 'name' | 'date' | 'modified' | 'type' | 'size';
export type SortDirectionSetting = 'asc' | 'desc';
export type FilterTypeSetting = 'all' | 'folders' | 'documents' | 'pdfs' | 'images' | 'videos' | 'audio' | 'other';

export interface UserSettings {
  appearance: AppearanceSetting;
  accentColor: AccentColorSetting;
  viewMode: ViewModeSetting;
  fontSize: FontSizeSetting;
  animations: AnimationsSetting;
  sortField: SortFieldSetting;
  sortDirection: SortDirectionSetting;
  filterType: FilterTypeSetting;
}

export interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

export interface AdminUser {
  authenticated: boolean;
  username?: string;
}

export interface CatalogData {
  folders: Folder[];
  books: Book[];
}

/** UPI payment settings, admin-only. All fields empty by default; the admin
 * fills them in. No gateway, no keys, no auto verification. */
export interface PaymentSettings {
  upiId: string;
  upiQrUrl: string;
  displayName: string;
}

export const EMPTY_PAYMENT_SETTINGS: PaymentSettings = {
  upiId: '',
  upiQrUrl: '',
  displayName: '',
};

export interface AIOrganizationProposal {
  id: string;
  bookId?: string;
  driveFileId?: string;
  localFilePath?: string;
  originalFilename: string;
  currentLocation: {
    folderId: string | null;
    subfolderId: string | null;
    folderName: string;
  };
  fileSize?: string;
  sizeBytes?: number;
  mimeType?: string;
  previewUrl?: string;

  // AI suggestions
  documentType: string;
  suggestedTitle: string;
  suggestedAuthor: string;
  suggestedLanguage: string;
  suggestedCategory: string;
  suggestedSubcategory?: string;
  volume?: string;
  edition?: string;
  subject?: string;
  tags: string[];

  suggestedFilename: string;
  suggestedFolderPath: string;
  suggestedFolderId: string | null;
  suggestedFolderName: string;
  suggestedParentFolderId: string | null;
  isNewFolderSuggested: boolean;

  reason: string;
  confidence: number;
  confidenceLevel: 'high' | 'medium' | 'low';

  semanticSimilarityScore?: number;
  semanticSimilarityContext?: string;
  possibleDuplicate: boolean;
  duplicateDetails?: {
    matchedBookId: string;
    matchedBookTitle: string;
    matchedFilename: string;
    matchedFolder: string;
    similarity: number;
  };

  status: 'pending' | 'approved' | 'rejected' | 'applied';
  createdAt: string;
}

export interface AIOrganizerStatus {
  configured: boolean;
  museConfigured?: boolean;
  embeddingConfigured?: boolean;
  organizerModel: string;
  embeddingModel: string;
  pendingCount: number;
  message?: string;
}

