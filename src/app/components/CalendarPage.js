'use strict';
import React from 'react';
import CalendarSection from './CalendarSection';
import ProjectSection from './ProjectSection';

export default class CalendarPage extends React.Component {
    render() {
        return (
            <div className="app">
                <ProjectSection />
                <CalendarSection />
            </div>
        );
    }
}
