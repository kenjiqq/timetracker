'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route} from 'react-router';
import { history } from 'react-router/lib/HashHistory';
import TimeTrackerApp from './components/TimeTrackerApp';
import CalendarPage from './components/CalendarPage';
import moment from 'moment';

moment.locale('nb');

var routes = (
    <Router history={history}>
        <Route component={TimeTrackerApp}>
            <Route path="/" component={CalendarPage}/>
        </Route>
    </Router>
);

 ReactDOM.render(routes, document.getElementById('app'));
