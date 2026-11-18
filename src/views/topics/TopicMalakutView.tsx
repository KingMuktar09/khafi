import React from 'react';
import { TOPICS } from '../../data/topicsContent';
import { TopicPage } from './TopicPage';

/** Alam al-Malakut, from the Al Asrar notebook. Opening only: the rest is still being gathered. */
export const TopicMalakutView: React.FC = () => {
  const topic = TOPICS.find((t) => t.id === 'alam-al-malakut');
  if (!topic) return null;
  return <TopicPage topic={topic} />;
};
