'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import TimeTrackerApp from './components/TimeTrackerApp';
import moment from 'moment';

moment.locale('nb');

ReactDOM.render(
    <TimeTrackerApp />,
    document.getElementById('app')
);
