import React from 'react';
import { TOPICS } from '../../data/topicsContent';
import { TopicPage } from './TopicPage';

/** Thin wrapper: the long-form discussion, rendered by the shared TopicPage. */
export const TopicKhalawatView: React.FC = () => {
  const topic = TOPICS.find((t) => t.id === 'uses-of-letters-retreats')!;
  return <TopicPage topic={topic} />;
};
