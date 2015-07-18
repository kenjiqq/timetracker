'use strict';

import React from 'react';
import CalendarSection from './CalendarSection';
import ProjectSection from './ProjectSection';
import { Provider } from 'redux/react';
import { createRedux } from 'redux';
import * as stores from '../stores';

const redux = createRedux(stores);

export default class TimeTrackerApp extends React.Component {
    render() {
        return (
            <Provider redux={redux}>
                {() =>
                    <div className="app">
                        <ProjectSection />
                        <CalendarSection />
                    </div>
                }
             </Provider>
        );
    }
}
