import React from 'react';
import PropTypes from 'prop-types';
import { format, addDays, parse } from 'date-fns';
import { Link } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import './EventsNav.scss';

const EventsNav = ({ currentDay }) => {
  const currentDate = currentDay ? parse(currentDay, 'yyyy-MM-dd', new Date()) : new Date();
  const prvDate = addDays(currentDate, -1);
  const nextDate = addDays(currentDate, 1);
  return (
    <div className="flex font-black text-4xl events-nav justify-between">
      <div className="">
        <Link to={`/${format(prvDate, 'yyyy-MM-dd')}`} className="text-white block text-left">
          <IoIosArrowBack />
        </Link>
      </div>
      <div className="">
        <Link to={`/${format(nextDate, 'yyyy-MM-dd')}`} className="text-white block text-right">
          <IoIosArrowForward />
        </Link>
      </div>
    </div>
  );
};

EventsNav.propTypes = {
  currentDay: PropTypes.string,
};
EventsNav.defaultProps = {
  currentDay: null,
};

export default EventsNav;
