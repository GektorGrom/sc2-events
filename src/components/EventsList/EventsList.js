import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Connect } from 'aws-amplify-react';
import { graphqlOperation } from 'aws-amplify';
import Dexie from 'dexie';
import Keyboardist from 'react-keyboardist';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  format, endOfDay, startOfDay, parse, addDays,
} from 'date-fns';

import { listRangeEvents } from '../../graphql/queries';
import { onUpdateRate } from '../../graphql/subscriptions';
import EventItem from '../EventItem/EventItem';
import EventsNav from '../EventsNav/EventsNav';
import TimeCard from '../TimeCard/TimeCard';

class EventsList extends Component {
  constructor(props) {
    super(props);
    this.left = this.left.bind(this);
    this.right = this.right.bind(this);
  }

  left() {
    const { match, history } = this.props;
    const { currentDay } = match.params;
    const currentDate = currentDay ? parse(currentDay, 'yyyy-MM-dd', new Date()) : new Date();
    history.push(`/${format(addDays(currentDate, -1), 'yyyy-MM-dd')}`);
  }

  right() {
    const { match, history } = this.props;
    const { currentDay } = match.params;
    const currentDate = currentDay ? parse(currentDay, 'yyyy-MM-dd', new Date()) : new Date();
    history.push(`/${format(addDays(currentDate, 1), 'yyyy-MM-dd')}`);
  }

  render() {
    const { match } = this.props;
    const { currentDay } = match.params;
    const currentDate = currentDay ? parse(currentDay, 'yyyy-MM-dd', new Date()) : new Date();
    const db = new Dexie('EventsVote');
    db.version(1).stores({
      votesTable: '++id, didVoteUp, didVoteDown',
    });
    return (
      <>
        <Keyboardist bindings={{
          Left: this.left,
          Right: this.right,
        }}
        />
        <header className="App-header justify-center sm:justify-between">
          <img
            src="/images/logo/Starcraft_2_Icons_rep_512px.png"
            className="App-logo hidden sm:block h-full"
            alt="logo"
          />
          <TimeCard date={currentDate} />
        </header>
        <Connect
          query={graphqlOperation(listRangeEvents, {
            start: +format(startOfDay(currentDate), 't'),
            end: +format(endOfDay(currentDate), 't'),
          })}
          subscription={graphqlOperation(onUpdateRate)}
          onSubscriptionMsg={(prev, { onUpdateRate: sc2Event }) => ({

            ...prev,
            listRangeEvents: {
              items: prev.listRangeEvents.items.map((el) => {
                if (el.id === sc2Event.id) {
                  return { ...el, ...sc2Event };
                }
                return el;
              }),
            },
          })}
        >
          {({ data, loading, errors }) => {
            if (errors.length > 0) return <h3>{JSON.stringify(errors)}</h3>;
            if (loading) return <h3>Loading...</h3>;
            const { listRangeEvents: sc2Events } = data;
            return sc2Events.items
              .sort((a, b) => a.AWSTimestamp - b.AWSTimestamp)
              // eslint-disable-next-line react/jsx-props-no-spreading
              .map((event) => <EventItem db={db} key={event.id} {...event} />);
          }}
        </Connect>
        <EventsNav currentDay={currentDay} />
      </>
    );
  }
}

EventsList.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};
EventsList.defaultProps = {};

export default EventsList;
