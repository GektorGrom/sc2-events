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
  const [lock, setLock] = useState(false);
  cdmEvent(id, db, setLock);
  const rating = up + down;
  return (
    <Connect mutation={graphqlOperation(updateSc2Events)}>
      {({ mutation }) => (
        <div className="flex mb-4 leading-loose event-item">
          <div
            className={classnames('w-3/5', 'text-left', {
              'text-teal-lighter': AWSTimestamp < now / 1000,
            })}
          >
            {`${title} - ${stage}`}
            <span className="text-xs ml-2">
              {format(new Date(AWSTimestamp * 1000), 'dd MMM HH:mm')}
            </span>
          </div>
          <div className="w-1/5">
            <button
              type="button"
              disabled={lock}
              className="text-green-light font-bold hover:bg-green-lightest p-3 rounded event-item__voteBtn-up"
              onClick={async (e) => {
                e.preventDefault();
                setLock(true);
                db.votesTable.add({ id, didVoteDown: true });
                await mutation({ input: { id, up: up + 1 } });
              }}
            >
              <FiThumbsUp />
            </button>
            <button
              type="button"
              className="text-red-light font-bold hover:bg-red-lightest p-3 rounded ml-3 event-item__voteBtn-down"
              disabled={lock}
              onClick={async (e) => {
                e.preventDefault();
                setLock(true);
                await db.votesTable.add({ id, didVoteDown: true });
                await mutation({ input: { id, down: down - 1 } });
              }}
            >
              <FiThumbsDown />
            </button>
          </div>
          <div
            className={classnames(
              'w-1/5',
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
