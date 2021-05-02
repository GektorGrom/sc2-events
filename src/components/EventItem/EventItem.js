import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { Connect } from 'aws-amplify-react';
import { graphqlOperation } from 'aws-amplify';
import classNames from 'clsx';
import { format } from 'date-fns';

import { updateSc2Events } from '../../graphql/mutations';

import { useCdmEvent } from '../../hooks/eventHooks';

import './EventItem.scss';

const now = new Date().getTime();

const EventItem = ({
  stage, title, up, down, id, AWSTimestamp, db, Liquipedia,
}) => {
  // declare state
  const [lock, setLock] = useState({
    didVoteUp: false,
    didVoteDown: false,
  });
  useCdmEvent(id, db, setLock);
  const { didVoteUp, didVoteDown } = lock;
  const rating = up + down;
  const isPast = AWSTimestamp < now / 1000;
  return (
    <Connect mutation={graphqlOperation(updateSc2Events)}>
      {({ mutation }) => (
        <a
          href={Liquipedia}
          target="_blank"
          rel="noreferrer noopener"
          className={classNames('text-xl flex flex-wrap mb-4 leading-loose event-item items-center', {
            'event-item__disabled': isPast,
          })}
        >
          <div
            className={classNames(
              'text-xl',
              'lg:text-4xl',
              'w-full',
              'lg:w-3/5',
              'text-left',
              'truncate',
              {
                'text-grey-darker': isPast,
              },
            )}
          >
            {`${title} - ${stage}`}
          </div>
          <div className={classNames('self-end lg:self-center w-3/5 lg:w-1/5 text-left lg:text-right', {
            invisible: isPast,
          })}
          >
            <button
              type="button"
              disabled={didVoteDown}
              className={classNames(
                'text-green-dark',
                'font-bold',
                'hover:bg-green-lightest',
                'p-3',
                'rounded',
                'bg-transparent',
                'border-transparent',
                'text-4xl',
                'lg:text-2xl',
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
              className={classNames(
                'text-red-light',
                'font-bold',
                'hover:bg-red-lightest',
                'p-3',
                'rounded',
                'ml-3',
                'bg-transparent',
                'border-transparent',
                'text-4xl',
                'lg:text-2xl',
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
            className={classNames(
              'w-2/5',
              'lg:w-1/5',
              'text-right',
              'text-2xl',
              { 'text-green-dark': rating >= 0 },
              { 'text-red-dark': rating < 0 },
            )}
          >
            <span className="text-lg ml-4">
              {format(new Date(AWSTimestamp * 1000), 'h:mm a')}
            </span>
            <div>
              {`Rating: ${rating}`}
            </div>

          </div>
        </a>
      )}
    </Connect>
  );
};

EventItem.propTypes = {
  id: PropTypes.number.isRequired,
  // eventId: PropTypes.number.isRequired,
  stage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  Liquipedia: PropTypes.string,
  up: PropTypes.number,
  down: PropTypes.number,
  AWSTimestamp: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  db: PropTypes.object.isRequired,
};
EventItem.defaultProps = {
  up: 0,
  down: 0,
  Liquipedia: null,
};

export default EventItem;
