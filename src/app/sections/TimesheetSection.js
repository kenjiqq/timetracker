import React, { PropTypes } from 'react';
import Timesheet from '../components/Timesheet';
import { connect } from 'react-redux';
import {calendarSelector} from '../selectors/calendarSelectors';
import {projectsSelector, subProjectsSelector} from '../selectors/projectSelectors';
import {timeSlotsByDateSelector} from '../selectors/timeslotSelectors';

class TimesheetSection extends React.Component {
    static propTypes = {
        timeSlots: PropTypes.object.isRequired,
        calendar: PropTypes.object.isRequired,
        projects: PropTypes.object.isRequired,
        subProjects: PropTypes.object.isRequired
    }

    render () {
        return (
            <Timesheet projects={this.props.projects} subProjects={this.props.subProjects} timeSlots={this.props.timeSlots} week={this.props.calendar.week}/>
        );
    }
};

function select (state) {
    return Object.assign(
        {},
        timeSlotsByDateSelector(state),
        projectsSelector(state),
        subProjectsSelector(state),
        calendarSelector(state)
    );
}

export default connect(select)(TimesheetSection);
