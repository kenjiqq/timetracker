'use strict';

import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import {TimeBoxExisting} from './TimeBox';
import interact from 'interact.js';
import classnames from 'classnames';
import NewTimeSlotDragger from './NewTimeSlotDragger';

export default class DayColumn extends Component {
    static propTypes = {
        date: PropTypes.string.isRequired,
        timeSlots: PropTypes.array.isRequired,
        projects: PropTypes.array.isRequired,
        name: PropTypes.string.isRequired,
        actions: PropTypes.object.isRequired,
        hourSize: PropTypes.number.isRequired
    }

    state = {
        dropTarget: false,
    }

    calcStartTime(dropEl, dragEl) {
        const zoneRect = dragEl.getBoundingClientRect(),
        dropRect = dropEl.getBoundingClientRect(),
        offset = dropRect.top - zoneRect.top;
        return Math.round((offset / this.props.hourSize) * 4) / 4;
    }

    calcStartTimeFromCoords(ypos, dropEl) {
        const dropRect = dropEl.getBoundingClientRect(),
        offset = ypos - dropRect.top;
        return Math.round((offset / this.props.hourSize) * 4) / 4;
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
                        const startTime = this.calcStartTimeFromCoords(NewTimeSlotDragger.getPos().y, event.target);

                        this.props.actions.addTimeSlot(project, subProject, activity, this.props.date, startTime, 1);
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
            const {name, ...restProject} = this.props.projects.find(project => timeSlot.project === project.code);
            return (
                <TimeBoxExisting key={timeSlot.id} date={this.props.date} {...timeSlot} {...restProject} project={name} hourSize={this.props.hourSize} actions={this.props.actions} />
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
