'use strict';
import React from 'react';
import TimesheetSection from '../sections/TimesheetSection';

export default class TimesheetPage extends React.Component {
    render () {
        return (
            <div className='app'>
                <TimesheetSection />
            </div>
        );
    }
}
