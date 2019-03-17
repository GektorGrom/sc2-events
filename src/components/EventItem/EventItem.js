import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { Connect } from 'aws-amplify-react';
import { graphqlOperation } from 'aws-amplify';
import classnames from 'classnames';
import { format } from 'date-fns';

import { updateSc2Events } from '../../graphql/mutations';

import './EventItem.scss';
import { cdmEvent } from '../../hooks/eventHooks';

const now = new Date().getTime();

const EventItem = ({
  stage, title, up, down, id, AWSTimestamp, db,
}) => {
  // declare state
  const [lock, setLock] = useState({
    didVoteUp: false,
    didVoteDown: false,
  });
  cdmEvent(id, db, setLock);
  const { didVoteUp, didVoteDown } = lock;
  const rating = up + down;
  return (
    <Connect mutation={graphqlOperation(updateSc2Events)}>
      {({ mutation }) => (
        <div className="flex flex-wrap mb-4 leading-loose event-item items-center">
          <div
            className={classnames(
              'text-xl',
              'lg:text-4xl',
              'w-full',
              'lg:w-3/5',
              'text-left',
              'truncate',
              {
                'text-teal-lighter': AWSTimestamp < now / 1000,
              },
            )}
          >
            {`${title} - ${stage}`}
            <span className="text-sm ml-2">
              {format(new Date(AWSTimestamp * 1000), 'dd MMM HH:mm')}
            </span>
          </div>
          <div className="w-3/5 lg:w-1/5 text-left">
            <button
              type="button"
              disabled={didVoteDown}
              className={classnames(
                'text-green-light',
                'font-bold',
                'hover:bg-green-lightest',
                'p-3',
                'rounded',
                'event-item__voteBtn-up',
                {
                  'event-item__voteBtn-gray': didVoteDown,
                },
                {
                  'event-item__voteBtn-up-active': didVoteUp,
                },
              )}
              onClick={async (e) => {
                e.preventDefault();
                setLock({ didVoteUp: !didVoteUp });
                db.votesTable.put({ id, didVoteUp: !didVoteUp });
                await mutation({
                  input: { id, up: didVoteUp ? up - 1 : up + 1 },
                });
              }}
            >
              <FiThumbsUp />
            </button>
            <button
              type="button"
              className={classnames(
                'text-red-light',
                'font-bold',
                'hover:bg-red-lightest',
                'p-3',
                'rounded',
                'ml-3',
                'event-item__voteBtn-down',
                {
                  'event-item__voteBtn-gray': didVoteUp,
                },
                {
                  'event-item__voteBtn-down-active': didVoteDown,
                },
              )}
              disabled={didVoteUp}
              onClick={async (e) => {
                e.preventDefault();
                setLock({ didVoteDown: !didVoteDown });
                await db.votesTable.put({ id, didVoteDown: !didVoteDown });
                await mutation({
                  input: { id, down: didVoteDown ? down + 1 : down - 1 },
                });
              }}
            >
              <FiThumbsDown />
            </button>
          </div>
          <div
            className={classnames(
              'w-2/5',
              'lg:w-1/5',
              'text-left',
              { 'text-green-light': rating >= 0 },
              { 'text-red-light': rating < 0 },
            )}
          >
            Rating:
            {' '}
            {rating}
          </div>
        </div>
      )}
    </Connect>
  );
};

EventItem.propTypes = {
  id: PropTypes.number.isRequired,
  // eventId: PropTypes.number.isRequired,
  stage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  // Liquipedia: PropTypes.string,
  up: PropTypes.number,
  down: PropTypes.number,
  AWSTimestamp: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  db: PropTypes.object.isRequired,
};
EventItem.defaultProps = {
  up: 0,
  down: 0,
  // Liquipedia: null,
};

export default EventItem;
