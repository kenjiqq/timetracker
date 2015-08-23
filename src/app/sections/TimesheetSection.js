import React from 'react';
import Timesheet from '../components/Timesheet';
import { connect } from 'redux/react';

@connect(state => ({
  projects: state.projects.toJS(),
  timeSlots: state.timeSlots.toJS(),
  calendar: state.calendar.toJS()
}))
export default class TimesheetSection extends React.Component {
    render() {
        return (
            <Timesheet projects={this.props.projects} timeSlots={this.props.timeSlots} week={this.props.calendar.week}/>
        );
    }

};
