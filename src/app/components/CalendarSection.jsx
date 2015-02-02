var React = require('react'),
    DayColumn = require('./DayColumn'),
    TimeSlotStore = require('../stores/TimeSlotStore');

var dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function getStoreState() {
    var week = [];
    dayNames.forEach(function(dayName, i) {
        var startOfWeek = moment().startOf('week');
        var date = startOfWeek.add(i, 'days').format('DD-MM-YYYY');
        week.push({
            name: dayName,
            date: date,
            timeSlots: TimeSlotStore.getTimeSlotsForDate(date)
        });
    });
    return {
        week: week
    }
}

var CalendarSection = React.createClass({
    mixins: [TimeSlotStore.mixin],
    getInitialState: function() {
        return getStoreState();
    },

    storeDidChange: function() {
        this.setState(getStoreState());
    },

    render: function() {
        var dayNodes = this.state.week.map(function (day) {
            return (
                <DayColumn key={day.date} day={day.name} date={day.date} timeSlots={day.timeSlots} />
            );
        });
        return (
            <section className="calendar">
                <ul className="week list-unstyled">
                    {dayNodes}
                </ul>
            </section>
        );
    }
});

module.exports = CalendarSection;
