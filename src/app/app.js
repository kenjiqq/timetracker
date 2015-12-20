'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link} from 'react-router';
import CalendarPage from './pages/CalendarPage';
import ProjectEditPage from './pages/ProjectEditPage';
import TimesheetPage from './pages/TimesheetPage';
import LoginPage from './pages/LoginPage';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import rootReducer from './reducers';
import {init as actionInit} from './actions';
import moment from 'moment';
import Ref from './constants/AsyncAdapter';
import DevTools from './components/DevTools';

moment.locale('nb');
const store = compose(applyMiddleware(thunk), DevTools.instrument())(createStore)(rootReducer);

if (module.hot) {
    module.hot.accept('./reducers', () =>
      store.replaceReducer(require('./reducers'))
    );
};

class RoutingContainer extends React.Component {
    static propTypes = {
        routes: React.PropTypes.element.isRequired
    }
    render () {
        return (
            <div>
                <header>
                    <ul className='nav nav-tabs'>
                        <li role='presentation'><Link to='/'>Calendar</Link></li>
                        <li role='presentation'><Link to='/projects'>Projects</Link></li>
                        <li role='presentation'><Link to='/timesheet'>Timesheet</Link></li>
                    </ul>
                    <button onClick={this.handleLogout}>Logout</button>
                </header>
                {this.props.routes}
                <DevTools />
            </div>
        );
    }
}

class TimeTrackerApp extends React.Component {
    static propTypes = {
        children: React.PropTypes.element
    }

    handleLogout = () => {
        Ref.unauth();
    }

    render () {
        return (
            <Provider store={store}>
                <RoutingContainer routes={this.props.children} />
             </Provider>
        );
    }
}

var routes = (
    <Router>
        <Route component={TimeTrackerApp}>
            <Route path='/' component={CalendarPage}/>
            <Route path='/projects' components={ProjectEditPage} />
            <Route path='/timesheet' components={TimesheetPage} />
        </Route>
    </Router>
);

Ref.onAuth(authData => {
    if (!authData) {
        ReactDOM.render(<LoginPage />, document.getElementById('app'));
    } else {
        const userRef = Ref.child('users').child(authData.uid);
        actionInit(store, userRef);
        ReactDOM.render(routes, document.getElementById('app'));
    }
});
