'use strict';

import React from 'react';
import TimeSlotActions from '../actions/TimeSlotActions';
import interact from 'interact.js';

export default class TimeBox extends React.Component {
    state = {
        posX: undefined,
        posY: undefined,
    }
    componentDidMount() {
        const element = this.refs.box;
        interact(element)
        .draggable({
            snap: {
                targets: [
                    interact.createSnapGrid({ x: 1, y: this.props.hourSize/2 })
                ],
                offset: 'startCoords'
            },
        })
        .resizable({
            snap: {
                targets: [
                    interact.createSnapGrid({ x: 1, y: this.props.hourSize/2 })
                ],
                offset: 'startCoords'
            },
            axis: 'y'
        })
        .on('dragstart', (event) => {
            this.setState({
                posX: 0,
                posY: this.props.timeSlot.startHour * this.props.hourSize
            });
        })
        .on('dragmove', (event) => {
            this.setState({
                posX: this.state.posX + event.dx,
                posY: this.state.posY + event.dy
            });
        })
        .on('dragend', (event) => {
            TimeSlotActions.setStartHour(this.props.timeSlot.id, this.state.posY / this.props.hourSize);
            this.setState({
                posX: undefined,
                posY: undefined
            });
        })
        .on('resizestart', (event) => {
            this.setState({
                height: this.props.timeSlot.duration * this.props.hourSize
            });
        })
        .on('resizemove', (event) => {
            this.setState({
                height: this.state.height + event.dy
            });
        })
        .on('resizeend', (event) => {
            TimeSlotActions.setDuration(this.props.timeSlot.id, this.state.height / this.props.hourSize);
            this.setState({
                height: undefined
            });
        })
    }
    render() {
        const x = this.state.posX !== undefined ? this.state.posX : 0,
            y = this.state.posY !== undefined ? this.state.posY : this.props.timeSlot.startHour * this.props.hourSize,
            translateString = `translate(${x}px, ${y}px)`;
        const style = {
            backgroundColor: this.props.color ? this.props.color : 'red',
            WebkitTransform: translateString,
            transform: translateString,
            height: this.state.height !== undefined ? this.state.height : this.props.timeSlot.duration * this.props.hourSize
        }
        const duration = this.state.height ? this.state.height / this.props.hourSize : this.props.timeSlot.duration;
        return (
            <li className="timebox" ref="box" style={style} data-id={this.props.timeSlot.id} data-date={this.props.date} data-type="timebox">
                <h4>{this.props.name}</h4>
                <div>Duration: {duration}</div>
            </li>
        );
    }
};
