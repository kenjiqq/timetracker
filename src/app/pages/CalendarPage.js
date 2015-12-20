'use strict';
import React from 'react';
import CalendarSection from '../sections/CalendarSection';
import ProjectSection from '../sections/ProjectSection';

export default class CalendarPage extends React.Component {
    render () {
        return (
            <div className='app'>
                <ProjectSection />
                <CalendarSection />
            </div>
        );
    }
}
