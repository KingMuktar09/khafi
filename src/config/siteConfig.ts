export const siteConfig = {
  appName: 'Ilm-e-Ghayb Library',
  brand: 'Ghayb Chronicles',
  /** Official logo: halftone gold arch doorway with a geometric star and
   * light, on dark navy (1600x1600, 18 Nov 2026).
   * Hosted on Google Drive (thumbnail URL) because binary files cannot be
   * pushed to GitHub through the snapshot tool, so /logo.jpg 404s live.
   * Shown whole and centred everywhere (object-cover on a square box, so
   * nothing is cropped). */
  logo: 'https://drive.google.com/thumbnail?id=1EILLlQUdXJ4pWIYZP81HdnFq_ZpKnEdA&sz=w400',
  /**
   * Known catalog totals from the last catalog build
   * (data/catalog.json: All Islamic History Books, 17 Nov 2026).
   * Used ONLY as a first-paint fallback on the follow gate while
   * /api/catalog is still loading, so the gate never shows "0 Collections,
   * 0 Books" for a library that has books. The live counts from the
   * loaded catalog always replace these. Update these two numbers
   * whenever data/catalog.json is rebuilt with a different total.
   */
  catalogStats: {
    totalFolders: 27,
    totalBooks: 138,
  },
  instagram: {
    handle: '@ghayb.chronicles',
    url: 'https://instagram.com/ghayb.chronicles',
  },
  creator: {
    name: 'Ghayb Chronicles',
    location: 'India',
    tagline: 'Islamic history and wisdom • Sufism and hidden knowledge, through art',
    about:
      'Ilm-e-Ghayb Library, by Ghayb Chronicles, is a free library of hidden knowledge and Sufi wisdom — Sufism is the spiritual side of Islam — and the books behind it.\n\nThe library holds Islamic knowledge, the Quran, the Sunnah (the Prophet\'s way of life), spirituality, history and philosophy, with sources in every entry. Follow @ghayb.chronicles on Instagram to enter the library.',
    note: {
      quote:
        'Some knowledge is everywhere.\nSome knowledge is hidden.\nThis is a place to seek both.',
      author: 'Ghayb Chronicles',
    },
    socials: {
      instagram: { handle: '@ghayb.chronicles', url: 'https://instagram.com/ghayb.chronicles' },
      telegram: { handle: '', url: '' },
    },
  },
};
