import React from 'react';
import { TOPICS } from '../../data/topicsContent';
import { TopicPage } from './TopicPage';

/** Ibn Arabi's 40-Day Retreat, from the Al Asrar notebook. */
export const TopicRetreatView: React.FC = () => {
  const topic = TOPICS.find((t) => t.id === 'ibn-arabi-40-day-retreat');
  if (!topic) return null;
  return <TopicPage topic={topic} />;
};
