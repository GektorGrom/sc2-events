import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import { Connect } from 'aws-amplify-react';
import { graphqlOperation } from 'aws-amplify';
import Dexie from 'dexie';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  format, endOfDay, startOfDay, parse,
} from 'date-fns';

import { listRangeEvents } from '../../graphql/queries';
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
        query={graphqlOperation(listRangeEvents, {
          start: +format(startOfDay(currentDate), 't'),
          end: +format(endOfDay(currentDate), 't'),
        })}
        subscription={graphqlOperation(onUpdateRate)}
        onSubscriptionMsg={(prev, { onUpdateRate: sc2Event }) => Object.assign({}, prev, {
          listRangeEvents: {
            items: prev.listRangeEvents.items.map((el) => {
              if (el.id === sc2Event.id) {
                return Object.assign({}, el, sc2Event);
              }
              return el;
            }),
          },
        })
      }
      >
        {({ data, loading, errors }) => {
          if (errors.length > 0) return <h3>{JSON.stringify(errors)}</h3>;
          if (loading) return <h3>Loading...</h3>;
          const { listRangeEvents: sc2Events } = data;
          return sc2Events.items
            .sort((a, b) => a.AWSTimestamp - b.AWSTimestamp)
            .map(event => <EventItem db={db} key={event.id} {...event} />);
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
