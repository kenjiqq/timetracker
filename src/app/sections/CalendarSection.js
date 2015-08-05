import React from 'react';
import { connect } from 'redux/react';
import DayColumn from '../components/DayColumn';
import moment from 'moment';
import * as TimeSlotActions from '../actions/TimeSlotActions';
import { bindActionCreators } from 'redux';
import NewTimeSlotDragger from '../components/NewTimeSlotDragger';

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const hours = ['00.00', '00.30', '01.00', '01.30', '02.00', '02.30', '03.00', '03.30', '04.00', '04.30', '05.00', '05.30', '06.00', '06.30', '07.00', '07.30', '08.00', '08.30', '09.00', '09.30', '10.00', '10.30', '11.00', '11.30', '12.00', '12.30', '13.00', '13.30', '14.00', '14.30', '15.00', '15.30', '16.00', '16.30', '17.00', '17.30', '18.00', '18.30', '19.00', '19.30', '20.00', '20.30', '21.00', '21.30', '22.00', '22.30', '23.00', '23.30', '00.00'];

@connect(state => ({
    timeSlots: state.timeSlots.toJS(),
    projects: state.projects.toJS()
}))

export default class CalendarSection extends React.Component {
    hourSize = 108

    state = {
        weekNumber: moment().week()
    }

    changeWeek = (dx) => {
        const newWeek = moment().week(this.state.weekNumber).add(dx, 'week').week();
            this.setState({
            weekNumber: newWeek
        });
    }

    pagerPrevious = () => {
        this.changeWeek(-1);
    }

    pagerNext = () => {
        this.changeWeek(1);
    }

    handleMovedTimeSlot = (id, newDate, oldDate) => {
        this.props.dispatch(TimeSlotActions.moveDay(id, newDate, oldDate));
    }

    handleNewTimeSlot = (project, date, start, duration) => {
        this.props.dispatch(TimeSlotActions.addTimeSlot(project, date, start, duration));
    }

    renderDays() {
        const actions = bindActionCreators(TimeSlotActions, this.props.dispatch);
        return dayNames.map((name, index) => {
            const startOfWeek = moment().week(this.state.weekNumber).startOf('week');
            const date = startOfWeek.add(index, 'days').format('DD-MM-YYYY');
            const timeSlots = this.props.timeSlots[date] || [];
            return (
                <DayColumn key={index} name={name} date={date} timeSlots={timeSlots} projects={this.props.projects} actions={actions} hourSize={this.hourSize} />
            );
        });
    }

    renderLabels() {
        return hours.map((hour, index) => {
            return (
                <span key={index}>{hour}</span>
            );
        });
    }

    render() {
        return (
            <section className="calendar-section">
                <div className="hours-labels">
                    {this.renderLabels()}
                </div>
                <div className="calendar">
                    <nav>
                        <ul className="pager">
                            <li className="previous"><a onClick={this.pagerPrevious}>Previous</a></li>
                            <li className="week-header"><h4>Week: {this.state.weekNumber}</h4></li>
                            <li className="next"><a onClick={this.pagerNext}>Next</a></li>
                        </ul>
                    </nav>
                    <ul className="week list-unstyled">
                        {this.renderDays()}
                    </ul>
                </div>
                <NewTimeSlotDragger hourSize={this.hourSize}></NewTimeSlotDragger>
            </section>
        );
    }
};
