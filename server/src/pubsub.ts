import { PubSubEngine } from 'type-graphql';
import { PubSub } from 'graphql-subscriptions';

export const pubSub: PubSubEngine = new PubSub();
