import React from 'react';
import { TOPICS } from '../../data/topicsContent';
import { TopicPage } from './TopicPage';

/** Thin wrapper: the long-form discussion, rendered by the shared TopicPage. */
export const TopicTawaqifView: React.FC = () => {
  const topic = TOPICS.find((t) => t.id === 'four-tawaqif')!;
  return <TopicPage topic={topic} />;
};
