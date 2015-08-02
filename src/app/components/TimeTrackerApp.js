'use strict';

import React from 'react';
import {Link} from 'react-router';
import { Provider } from 'redux/react';
import { createRedux } from 'redux';
import * as stores from '../stores';

const redux = createRedux(stores);

export default class TimeTrackerApp extends React.Component {
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
