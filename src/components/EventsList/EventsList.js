import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import { Connect } from 'aws-amplify-react';
import { graphqlOperation } from 'aws-amplify';
import Dexie from 'dexie';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  format, endOfDay, startOfDay, parse,
} from 'date-fns';

import { listSc2Events } from '../../graphql/queries';
import { onUpdateRate } from '../../graphql/subscriptions';
import EventItem from '../EventItem/EventItem';
import EventsNav from '../EventsNav/EventsNav';

const EventsList = ({ match }) => {
  const { currentDay } = match.params;
  const currentDate = currentDay ? parse(currentDay, 'yyyy-MM-dd', new Date()) : new Date();
  const db = new Dexie('EventsVote');
  db.version(1).stores({
    votesTable: '++id, didVoteUp, didVoteDown',
  });
  return (
    <Fragment>
      <Connect
        query={graphqlOperation(listSc2Events, {
          limit: 1000,
          filter: {
            AWSTimestamp: {
              ge: +format(startOfDay(currentDate), 't'),
              lt: +format(endOfDay(currentDate), 't'),
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
        })
      }
      >
        {({ data: { listSc2Events: sc2Events }, loading, error }) => {
          console.log(sc2Events);
          if (error) return <h3>Error</h3>;
          if (loading || !sc2Events.items) return <h3>Loading...</h3>;
          return sc2Events.items
            .sort((a, b) => a.AWSTimestamp - b.AWSTimestamp)
            .map((event) => {
              console.log(event);
              return <EventItem db={db} key={event.id} {...event} />;
            });
        }}
      </Connect>
      <EventsNav currentDay={currentDay} />
    </Fragment>
  );
};

EventsList.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};
EventsList.defaultProps = {};

export default EventsList;
