'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link} from 'react-router';
import { history } from 'react-router/lib/HashHistory';
import CalendarPage from './pages/CalendarPage';
import ProjectEditPage from './pages/ProjectEditPage';
import LoginPage from './pages/LoginPage';
import { Provider } from 'redux/react';
import { createRedux } from 'redux';
import * as stores from './stores';
import {init as actionInit} from './actions';
import moment from 'moment';
import Ref from './constants/AsyncAdapter';

moment.locale('nb');
const redux = createRedux(stores);

class TimeTrackerApp extends React.Component {

    handleLogout = () => {
        Ref.unauth();
    }

    render() {
        return (
            <Provider redux={redux}>
                {() =>
                    <div>
                        <header>
                            <ul className="nav nav-tabs">
                                <li role="presentation"><Link to="/">Calendar</Link></li>
                                <li role="presentation"><Link to="/projects">Projects</Link></li>
                            </ul>
                            <button onClick={this.handleLogout}>Logout</button>
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
            <Route path="/projects" components={ProjectEditPage} />
        </Route>
    </Router>
);

Ref.onAuth(authData => {
    if(!authData) {
        ReactDOM.render(<LoginPage></LoginPage>, document.getElementById('app'));
    } else {
        const userRef = Ref.child('users').child(authData.uid);
        actionInit(redux, userRef);
        ReactDOM.render(routes, document.getElementById('app'));
    }
});
