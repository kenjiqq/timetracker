'use strict';

import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import TimeBox from './TimeBox';
import interact from 'interact.js';
import classnames from 'classnames';

export default class DayColumn extends Component {
    static propTypes = {
        date: PropTypes.string.isRequired,
        timeSlots: PropTypes.array.isRequired,
        projects: PropTypes.array.isRequired,
        name: PropTypes.string.isRequired,
        actions: PropTypes.object.isRequired
    }

    state = {
        dropTarget: false,
        hourSize: 108
    }

    calcStartTime(dropEl, dragEl) {
        const zoneRect = dragEl.getBoundingClientRect(),
        dropRect = dropEl.getBoundingClientRect(),
        offset = dropRect.top - zoneRect.top;
        return Math.round((offset / this.state.hourSize) * 4) / 4;
    }

    calcStartPosition(dropEl, clickPos) {
        const dropRect = dropEl.getBoundingClientRect(),
        offset = clickPos - dropRect.top,
        quarterSize = this.state.hourSize / 4;
        return (quarterSize * Math.floor(offset / quarterSize)) + dropRect.top;
    }

    componentDidMount() {
        const element = this.refs.day;
        interact(element)
        .dropzone({
            accept: ['.timebox', '.sub-project-type'],
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
                        droppedTimeSlotDate !== this.props.date ?
                            this.props.actions.moveDay(timeSlotId, droppedTimeSlotDate, this.props.date, this.calcStartTime(event.relatedTarget,  event.target)) :
                            this.props.actions.setStartHour(timeSlotId, this.props.date, this.calcStartTime(event.relatedTarget,  event.target));
                        break;
                    case 'new-timeslot':
                        const project = event.relatedTarget.getAttribute('data-project');
                        const subProject = event.relatedTarget.getAttribute('data-subproject');
                        const activity = event.relatedTarget.getAttribute('data-activity');
                        this.props.actions.addTimeSlot(project, subProject, activity, this.props.date, this.calcStartTime(event.relatedTarget, event.target), 1);
                        break;
                }
                this.setState({
                    dropTarget: false
                });
            }
        });
    }

    render() {
        const timeNodes = this.props.timeSlots.map((timeSlot) => {
            const project = this.props.projects.find(project => timeSlot.project === project.code);
            return (
                <TimeBox key={timeSlot.id} date={this.props.date} timeSlot={timeSlot} {...project} hourSize={this.state.hourSize} actions={this.props.actions} />
            );
        });

        //Set classes
        const classes = classnames({
            'day': true,
            'list-unstyled': true,
            'drop-target': this.state.dropTarget,
        });
        return (
            <li className="day-column">
                <div className="header">
                    <div>{this.props.name}</div>
                    <div>{this.props.date}</div>
                </div>
                <ul className={classes} ref="day">
                    {timeNodes}
                </ul>
            </li>
        );
    }
};
