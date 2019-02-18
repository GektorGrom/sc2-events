import React from 'react';
import PropTypes from 'prop-types';
import { format, addDays, parse } from 'date-fns';
import { Link } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const EventsNav = ({ currentDay }) => {
  const currentDate = currentDay ? parse(currentDay, 'yyyy-MM-dd', new Date()) : new Date();
  console.log(currentDate);
  const prvDate = addDays(currentDate, -1);
  const nextDate = addDays(currentDate, 1);
  return (
    <div className="flex">
      <div className="w-1/2">
        <Link to={`/${format(prvDate, 'yyyy-MM-dd')}`} className="text-white">
          <IoIosArrowBack />
        </Link>
      </div>
      <div className="w-1/2">
        <Link to={`/${format(nextDate, 'yyyy-MM-dd')}`} className="text-white">
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
