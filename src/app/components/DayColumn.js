'use strict';

import React from 'react';
import TimeBox from './TimeBox';
import TimeSlotActions from '../actions/TimeSlotActions';
import interact from 'interact.js';
import classnames from 'classnames';

export default class DayColumn extends React.Component {
    state = {
        dropTarget: false,
        hourSize: 50
    }
    componentDidMount() {
        const element = this.refs.day;
        interact(element)
        .dropzone({
            accept: ['.timebox', '.project'],
            ondragenter: (event) => {
                this.setState({
                    dropTarget: true
                });
            },
            ondragleave: (event) => {
                this.setState({
                    dropTarget: false
                });
            },
            ondrop: (event) => {
                switch (event.relatedTarget.getAttribute('data-type')) {
                    case 'timebox':
                        const timeSlotId = parseInt(event.relatedTarget.getAttribute('data-id'));
                        const droppedTimeSlotDate = event.relatedTarget.getAttribute('data-date');
                        TimeSlotActions.moveDay(timeSlotId, droppedTimeSlotDate, this.props.date);
                        break;
                    case 'project':
                        const project = event.relatedTarget.getAttribute('data-id');
                        const zoneRect = event.target.getBoundingClientRect(),
                            dropRect = event.relatedTarget.getBoundingClientRect(),
                            offset   = dropRect.top - zoneRect.top,
                            duration = parseInt(offset / this.state.hourSize);

                        TimeSlotActions.addTimeSlot(project, this.props.date, duration, 1);
                        break;
                }
                this.setState({
                    dropTarget: false
                });
            }
        });
    }
    render() {
        let timeNodes;
        if(this.props.timeSlots) {
            timeNodes = this.props.timeSlots.map((timeSlot) => {
                const project = this.props.projects[(timeSlot.project)];
                return (
                    <TimeBox key={timeSlot.id} date={this.props.date} timeSlot={timeSlot} {...project} hourSize={this.state.hourSize}/>
                );
            });
        }

        //Set classes
        const classes = classnames({
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
};
