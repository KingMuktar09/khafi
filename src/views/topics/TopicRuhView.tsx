import React from 'react';
import { TOPICS } from '../../data/topicsContent';
import { TopicPage } from './TopicPage';

/** Thin wrapper: the long-form discussion, rendered by the shared TopicPage. */
export const TopicRuhView: React.FC = () => {
  const topic = TOPICS.find((t) => t.id === 'ruh-and-soul')!;
  return <TopicPage topic={topic} />;
};
