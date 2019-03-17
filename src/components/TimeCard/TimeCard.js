import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

import './TimeCard.scss';

const TimeCard = ({ date }) => (
  <section className="time-card" id="today">
    <div className="time-card__day">{format(date, 'EEEE')}</div>
    <div className="time-card__date">{format(date, 'dd')}</div>
    <div className="time-card__month">{format(date, 'MMMM')}</div>
  </section>
);

TimeCard.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
};
TimeCard.defaultProps = {};

export default TimeCard;
