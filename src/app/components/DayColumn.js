'use strict';

var React = require('react/addons'),
    TimeBox = require('./TimeBox'),
    TimeSlotActions = require('../actions/TimeSlotActions'),
    interact = require('interact.js');

var DayColumn = React.createClass({
    getInitialState: function() {
        return {
            dropTarget: false,
            hourSize: 50
        };
    },
    componentDidMount: function () {
        var element = this.refs.day.getDOMNode();
        interact(element)
        .dropzone({
            accept: ['.timebox', '.project'],
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
                switch (event.relatedTarget.getAttribute('data-type')) {
                    case 'timebox':
                        var timeSlotId = parseInt(event.relatedTarget.getAttribute('data-id'));
                        var droppedTimeSlotDate = event.relatedTarget.getAttribute('data-date');
                        TimeSlotActions.moveDay(timeSlotId, droppedTimeSlotDate, this.props.date);
                        break;
                    case 'project':
                        var project = event.relatedTarget.getAttribute('data-id');
                        var zoneRect = event.target.getBoundingClientRect(),
                            dropRect = event.relatedTarget.getBoundingClientRect(),
                            offset   = dropRect.top - zoneRect.top,
                            duration = parseInt(offset / this.state.hourSize);

                        TimeSlotActions.addTimeSlot(project, this.props.date, duration, 1);
                        break;
                }
                this.setState({
                    dropTarget: false
                });
            }.bind(this)
        });
    },
    render: function() {
        if(this.props.timeSlots) {
            var timeNodes = this.props.timeSlots.map(function (timeSlot) {
                var project = this.props.projects[(timeSlot.project)];
                return (
                    <TimeBox key={timeSlot.id} date={this.props.date} timeSlot={timeSlot} color={project.color} name={project.name} hourSize={this.state.hourSize}/>
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
                <div className="header">
                    <div>{this.props.day}</div>
                    <div>{this.props.date}</div>
                </div>
                <ul className={classes} ref="day">
                    {timeNodes}
                </ul>
            </li>
        );
    }

});

module.exports = DayColumn;
