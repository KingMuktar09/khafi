import React from 'react';
import { TOPICS } from '../../data/topicsContent';
import { TopicPage } from './TopicPage';

/** Thin wrapper: the long-form discussion, rendered by the shared TopicPage. */
export const TopicRijalView: React.FC = () => {
  const topic = TOPICS.find((t) => t.id === 'rijal-al-ghayb')!;
  return <TopicPage topic={topic} />;
};
