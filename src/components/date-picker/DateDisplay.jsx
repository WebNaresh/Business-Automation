

import React from 'react';
import { CalendarIcon } from '@heroicons/react/24/solid'; // Import the CalendarIcon

const DateDisplay = () => {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateString = today.toLocaleDateString('en-US', options);

  return (
    <div className="">
      <div className=" flex items-center space-x-4 max-w-md mx-auto">
        <CalendarIcon className="h-8 w-8 text-blue-600" />
        <div>
          <p className="text-xl font-bold text-gray-600">{dateString}</p>
          {/* <p className="text-sm text-gray-500">Today's Date</p> */}
        </div>
      </div>
    </div>
  );
};

export default DateDisplay;
