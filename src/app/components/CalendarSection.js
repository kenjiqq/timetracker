import React from 'react';
import DayColumn from './DayColumn';
import TimeSlotStore from '../stores/TimeSlotStore';
import ProjectStore from '../stores/ProjectStore';
import moment from 'moment';

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const hours = ['00.00', '00.30', '01.00', '01.30', '02.00', '02.30', '03.00', '03.30', '04.00', '04.30', '05.00', '05.30', '06.00', '06.30', '07.00', '07.30', '08.00', '08.30', '09.00', '09.30', '10.00', '10.30', '11.00', '11.30', '12.00', '12.30', '13.00', '13.30', '14.00', '14.30', '15.00', '15.30', '16.00', '16.30', '17.00', '17.30', '18.00', '18.30', '19.00', '19.30', '20.00', '20.30', '21.00', '21.30', '22.00', '22.30', '23.00', '23.30', '00.00'];

function getWeek(number) {
    return dayNames.map((dayName, i) => {
        const startOfWeek = moment().week(number).startOf('week');
        const date = startOfWeek.add(i, 'days').format('DD-MM-YYYY');
        return {
            name: dayName,
            date: date,
            timeSlots: TimeSlotStore.getTimeSlotsForDate(date)
        };
    });
}

function getStoreState(weekNumber) {
    return {
        week: getWeek(weekNumber),
        projects: ProjectStore.getAll()
    };
}

var CalendarSection = React.createClass({
    mixins: [TimeSlotStore.mixin, ProjectStore.mixin],
    getInitialState() {
        const weekNumber = moment().week();
        const state = getStoreState(weekNumber);
        state.weekNumber = weekNumber;
        return state;
    },

    storeDidChange() {
        this.setState(getStoreState(this.state.weekNumber));
    },

    changeWeek(dx) {
        const newWeek = moment().week(this.state.weekNumber).add(dx, 'week').week();
        this.setState({
            weekNumber: newWeek,
            week: getWeek(newWeek)
        });
    },

    pagerPrevious() {
        this.changeWeek(-1);
    },

    pagerNext() {
        this.changeWeek(1);
    },

    renderDays() {
        return this.state.week.map((day, index) => {
            return (
                <DayColumn key={index} day={day.name} date={day.date} timeSlots={day.timeSlots} projects={this.state.projects}/>
            );
        });
    },

    renderLabels() {
        return hours.map((hour, index) => {
            return (
                <span key={index}>{hour}</span>
            );
        });
    },

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
            </section>
        );
    }
});

module.exports = CalendarSection;
