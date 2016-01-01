import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DayColumn from '../components/DayColumn';
import moment from 'moment';
import TimeSlotActions from '../actions/TimeSlotActions';
import CalendarActions from '../actions/CalendarActions';
import NewTimeSlotDragger from '../components/NewTimeSlotDragger';
import {calendarSelector} from '../selectors/calendarSelectors';
import {projectsSelector, subProjectsSelector} from '../selectors/projectSelectors';
import {timeSlotsByDateSelector} from '../selectors/timeslotSelectors';

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const hours = ['00.00', '00.30', '01.00', '01.30', '02.00', '02.30', '03.00', '03.30', '04.00', '04.30', '05.00', '05.30', '06.00', '06.30', '07.00', '07.30', '08.00', '08.30', '09.00', '09.30', '10.00', '10.30', '11.00', '11.30', '12.00', '12.30', '13.00', '13.30', '14.00', '14.30', '15.00', '15.30', '16.00', '16.30', '17.00', '17.30', '18.00', '18.30', '19.00', '19.30', '20.00', '20.30', '21.00', '21.30', '22.00', '22.30', '23.00', '23.30', '00.00'];

class CalendarSection extends React.Component {
    static propTypes = {
        calendar: PropTypes.object.isRequired,
        timeSlots: PropTypes.object.isRequired,
        projects: PropTypes.object.isRequired,
        subProjects: PropTypes.object.isRequired,
        moveDay: PropTypes.func.isRequired,
        addTimeSlot: PropTypes.func.isRequired,
        deleteTimeSlot: PropTypes.func.isRequired,
        setStartHour: PropTypes.func.isRequired,
        setDuration: PropTypes.func.isRequired,
        changeWeek: PropTypes.func.isRequired
    }

    hourSize = 108

    changeWeek = (dx) => {
        const newWeek = moment().week(this.props.calendar.week).add(dx, 'week').week();
        this.props.changeWeek(newWeek);
    }

    pagerPrevious = () => {
        this.changeWeek(-1);
    }

    pagerNext = () => {
        this.changeWeek(1);
    }

    handleMovedTimeSlot = (id, newDate, oldDate) => {
        this.props.moveDay(id, newDate, oldDate);
    }

    handleNewTimeSlot = (project, date, start, duration) => {
        this.props.addTimeSlot(project, date, start, duration);
    }

    renderDays () {
        return dayNames.map((name, index) => {
            const startOfWeek = moment().week(this.props.calendar.week).startOf('week');
            const date = startOfWeek.add(index, 'days').format('DD-MM-YYYY');
            const timeSlots = this.props.timeSlots[date] || [];
            const actions = {
                moveDay: this.props.moveDay,
                addTimeSlot: this.props.addTimeSlot,
                deleteTimeSlot: this.props.deleteTimeSlot,
                setStartHour: this.props.setStartHour,
                setDuration: this.props.setDuration
            };
            const props = {
                key: index,
                name,
                date,
                timeSlots,
                projects: this.props.projects,
                subProjects: this.props.subProjects,
                hourSize: this.hourSize
            };
            return (
                <DayColumn {...props} {...actions} />
            );
        });
    }

    renderLabels () {
        return hours.map((hour, index) => {
            return (
                <span key={index}>{hour}</span>
            );
        });
    }

    render () {
        return (
            <section className='calendar-section'>
                <div className='hours-labels'>
                    {this.renderLabels()}
                </div>
                <div className='calendar'>
                    <nav>
                        <ul className='pager'>
                            <li className='previous'><a onClick={this.pagerPrevious}>Previous</a></li>
                            <li className='week-header'><h4>Week: {this.props.calendar.week}</h4></li>
                            <li className='next'><a onClick={this.pagerNext}>Next</a></li>
                        </ul>
                    </nav>
                    <ul className='week list-unstyled'>
                        {this.renderDays()}
                    </ul>
                </div>
                <NewTimeSlotDragger hourSize={this.hourSize} />
            </section>
        );
    }
};

function selectState (state) {
    return Object.assign(
        {},
        timeSlotsByDateSelector(state),
        projectsSelector(state),
        subProjectsSelector(state),
        calendarSelector(state)
    );
}

export default connect(selectState, Object.assign({}, TimeSlotActions, CalendarActions))(CalendarSection);
