import React from 'react';
// import PropTypes from 'prop-types';
import { Connect } from 'aws-amplify-react';
import { graphqlOperation } from 'aws-amplify';
import Dexie from 'dexie';
import { format, endOfDay } from 'date-fns';
import { listSc2Events } from '../../graphql/queries';
import { onUpdateRate } from '../../graphql/subscriptions';
import EventItem from '../EventItem/EventItem';

const today = new Date('2019-02-17');
const EventsList = () => {
  const db = new Dexie('EventsVote');
  db.version(1).stores({
    votesTable: '++id, didVoteUp, didVoteDown',
  });
  return (
    <Connect
      query={graphqlOperation(listSc2Events, {
        limit: 1000,
        filter: {
          AWSTimestamp: {
            ge: +format(today, 't'),
            lt: +format(endOfDay(today), 't'),
          },
        },
      })}
      subscription={graphqlOperation(onUpdateRate)}
      onSubscriptionMsg={(prev, { onUpdateRate: sc2Event }) => Object.assign({}, prev, {
        listSc2Events: {
          items: prev.listSc2Events.items.map((el) => {
            if (el.id === sc2Event.id) {
              return Object.assign({}, el, sc2Event);
            }
            return el;
          }),
        },
      })}
    >
      {({ data: { listSc2Events: sc2Events }, loading, error }) => {
        if (error) return <h3>Error</h3>;
        if (loading || !sc2Events.items) return <h3>Loading...</h3>;
        return sc2Events.items.map((event) => {
          console.log(event);
          return <EventItem db={db} key={event.id} {...event} />;
        });
      }}
    </Connect>
  );
};

EventsList.propTypes = {};
EventsList.defaultProps = {};

export default EventsList;
