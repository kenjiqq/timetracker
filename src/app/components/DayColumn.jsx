'use strict';

var React = require('react/addons'),
    TimeBox = require('./TimeBox'),
    TimeSlotActions = require('../actions/TimeSlotActions');

var DayColumn = React.createClass({
    getInitialState: function() {
        return {
            dropTarget: false,
        };
    },
    componentDidMount: function () {
        var element = this.refs.day.getDOMNode();
        interact(element)
        .dropzone({
            accept: '.timebox',
            ondragenter: function (event) {
                this.setState({
                    dropTarget: true
                });
            }.bind(this),
            ondragleave: function (event) {
                this.setState({
                    dropTarget: false
                });
            }.bind(this),
            ondrop: function (event) {
                var droppedTimeSlotId = parseInt(event.relatedTarget.getAttribute('data-id'));
                var droppedTimeSlotDate = event.relatedTarget.getAttribute('data-date');
                this.setState({
                    dropTarget: false
                });
                TimeSlotActions.moveDay(droppedTimeSlotId, droppedTimeSlotDate, this.props.date);
            }.bind(this)
        })
    },
    render: function() {
        if(this.props.timeSlots) {
            var timeNodes = this.props.timeSlots.map(function (timeSlot) {
                return (
                    <TimeBox key={timeSlot.id} date={this.props.date} timeSlot={timeSlot} />
                );
            }.bind(this));
        }

        //Set classes
        var classSet = React.addons.classSet;
        var classes = classSet({
            'day': true,
            'list-unstyled': true,
            'drop-target': this.state.dropTarget,
        });
        return (
            <li className="day-column">
                <h4 className="header">{this.props.day}</h4>
                <ul className={classes} ref="day">
                    {timeNodes}
                </ul>
            </li>
        );
    }

});

module.exports = DayColumn;
