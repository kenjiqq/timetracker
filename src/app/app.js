'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link} from 'react-router';
import { history } from 'react-router/lib/HashHistory';
import CalendarPage from './pages/CalendarPage';
import { Provider } from 'redux/react';
import { createRedux } from 'redux';
import * as stores from './stores';
import moment from 'moment';

moment.locale('nb');
const redux = createRedux(stores);

class TimeTrackerApp extends React.Component {
    render() {
        return (
            <Provider redux={redux}>
                {() =>
                    <div>
                        <header>
                            <ul className="nav nav-tabs">
                                <li role="presentation"><Link to="/">Calendar</Link></li>
                                <li role="presentation"><Link to="projects">Projects</Link></li>
                            </ul>
                        </header>
                        {this.props.children}
                    </div>
                }
             </Provider>
        );
    }
}


var routes = (
    <Router history={history}>
        <Route component={TimeTrackerApp}>
            <Route path="/" component={CalendarPage}/>
        </Route>
    </Router>
);

 ReactDOM.render(routes, document.getElementById('app'));
