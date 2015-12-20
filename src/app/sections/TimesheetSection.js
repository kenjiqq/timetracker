import React, { PropTypes } from 'react';
import Timesheet from '../components/Timesheet';
import { connect } from 'react-redux';

class TimesheetSection extends React.Component {
    static propTypes = {
        timeSlots: PropTypes.object.isRequired,
        calendar: PropTypes.object.isRequired,
        projects: PropTypes.array.isRequired
    }

    render () {
        return (
            <Timesheet projects={this.props.projects} timeSlots={this.props.timeSlots} week={this.props.calendar.week}/>
        );
    }
};

function select (state) {
    return {
        projects: state.projects.toJS(),
        timeSlots: state.timeSlots.toJS(),
        calendar: state.calendar.toJS()
    };
}

export default connect(select)(TimesheetSection);
