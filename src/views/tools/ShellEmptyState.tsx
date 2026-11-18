import React from 'react';

/**
 * Shared empty state for Tier B shell pages. Shells hold no content:
 * entries are added only from material supplied with a source, page,
 * and permission note. The message can be varied per page, but the
 * default wording stays honest about why the page is empty.
 */
export const ShellEmptyState: React.FC<{ message?: string }> = ({
  message = 'Nothing here yet — entries are added only from material supplied with a source, page, and permission note.',
}) => (
  <div className="py-10 px-4 text-center space-y-2" role="status">
    <p className="ms-h2">Nothing here yet</p>
    <p className="ms-body">{message}</p>
  </div>
);
