'use strict';

import React, { PropTypes, Component } from 'react';
import {TimeBoxExisting} from './TimeBox';
import interact from 'interact.js';
import classnames from 'classnames';
import NewTimeSlotDragger from './NewTimeSlotDragger';

export default class DayColumn extends Component {
    static propTypes = {
        date: PropTypes.string.isRequired,
        timeSlots: PropTypes.array.isRequired,
        projects: PropTypes.object.isRequired,
        subProjects: PropTypes.object.isRequired,
        name: PropTypes.string.isRequired,
        moveDay: PropTypes.func.isRequired,
        addTimeSlot: PropTypes.func.isRequired,
        deleteTimeSlot: PropTypes.func.isRequired,
        setStartHour: PropTypes.func.isRequired,
        setDuration: PropTypes.func.isRequired,
        hourSize: PropTypes.number.isRequired
    }

    state = {
        dropTarget: false
    }

    calcStartTime (dropEl, dragEl) {
        const zoneRect = dragEl.getBoundingClientRect();
        const dropRect = dropEl.getBoundingClientRect();
        const offset = dropRect.top - zoneRect.top;
        return Math.round((offset / this.props.hourSize) * 4) / 4;
    }

    calcStartTimeFromCoords (ypos, dropEl) {
        const dropRect = dropEl.getBoundingClientRect();
        const offset = ypos - dropRect.top;
        return Math.round((offset / this.props.hourSize) * 4) / 4;
    }

    componentDidMount () {
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
                    const timeSlotId = event.relatedTarget.getAttribute('data-id');
                    const droppedTimeSlotDate = event.relatedTarget.getAttribute('data-date');
                    droppedTimeSlotDate !== this.props.date
                        ? this.props.moveDay(timeSlotId, droppedTimeSlotDate, this.props.date, this.calcStartTime(event.relatedTarget, event.target))
                        : this.props.setStartHour(timeSlotId, this.props.date, this.calcStartTime(event.relatedTarget, event.target));
                    break;
                case 'new-timeslot':
                    const project = event.relatedTarget.getAttribute('data-project');
                    const subProject = event.relatedTarget.getAttribute('data-subproject');
                    const activity = event.relatedTarget.getAttribute('data-activity');
                    const startTime = this.calcStartTimeFromCoords(NewTimeSlotDragger.getPos().y, event.target);

                    this.props.addTimeSlot(project, subProject, activity, this.props.date, startTime, 1);
                    break;
                }
                this.setState({
                    dropTarget: false
                });
            }
        });
    }

    render () {
        const timeNodes = this.props.timeSlots.map((timeSlot) => {
            const project = this.props.projects[timeSlot.project] || {};
            const subProject = this.props.subProjects[timeSlot.subProject] || {};
            const props = {
                date: this.props.date,
                project: project.name,
                subProject: subProject.name,
                color: subProject.color || project.color,
                hourSize: this.props.hourSize,
                activity: timeSlot.activity,
                duration: timeSlot.duration,
                start: timeSlot.start,
                id: timeSlot.id,
                setDuration: this.props.setDuration,
                deleteTimeSlot: this.props.deleteTimeSlot
            };
            return (
                <TimeBoxExisting key={timeSlot.id} {...props} />
            );
        });

        // Set classes
        const classes = classnames({
            'day': true,
            'list-unstyled': true,
            'drop-target': this.state.dropTarget
        });
        return (
            <li className='day-column'>
                <div className='header'>
                    <div>{this.props.name}</div>
                    <div>{this.props.date}</div>
                </div>
                <ul className={classes} ref='day'>
                    {timeNodes}
                </ul>
            </li>
        );
    }
};
