'use strict';

import React, { PropTypes, Component } from 'react';
import interact from 'interact.js';

export default class TimeBox extends Component {
    static propTypes = {
        hourSize: PropTypes.number.isRequired,
        timeSlot: PropTypes.object.isRequired,
        color: PropTypes.string,
        date: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        actions: PropTypes.object.isRequired
    }
    state = {
        posX: undefined,
        posY: undefined,
        resizeY: undefined,
        dragging: false
    }

    static formatTime(decimal) {
        const hrs = Math.floor(decimal)
        let min = Math.round(decimal  %1 * 60)
        min = min < 10 ? "0" + min : min.toString();
        return hrs + ":" + min;
    }

    componentDidMount() {
        this.mounted = true;
        const element = this.refs.box;
        interact(element)
        .draggable({
            snap: {
                targets: [
                    interact.createSnapGrid({ x: 1, y: this.props.hourSize/4 })
                ],
                offset: 'startCoords'
            },
        })
        .resizable({
            snap: {
                targets: [
                    interact.createSnapGrid({ x: 1, y: this.props.hourSize/4 })
                ],
                offset: 'startCoords'
            },
            axis: 'y',
        })
        .on('dragstart', (event) => {
            this.setState({
                posX: 0,
                posY: this.props.timeSlot.start * this.props.hourSize,
                dragging: true
            });
        })
        .on('dragmove', (event) => {
            this.setState({
                posX: this.state.posX + event.dx,
                posY: this.state.posY + event.dy
            });

        })
        .on('dragend', (event) => {
            if(this.mounted) {
                this.setState({
                    posX: undefined,
                    posY: undefined,
                    dragging: false
                });
            }
        })
        .on('resizestart', (event) => {
            this.setState({
                height: this.props.timeSlot.duration * this.props.hourSize,
                resizeY: event.target.getBoundingClientRect().top + (event.pageY - event.target.getBoundingClientRect().bottom)
            });
        })
        .on('resizemove', (event) => {
            const newHeight = event.pageY - this.state.resizeY;
            if(newHeight >= this.props.hourSize / 2) {
                this.setState({
                    height: newHeight
                });
            }
        })
        .on('resizeend', (event) => {
            this.props.actions.setDuration(this.props.timeSlot.id, this.props.date, this.state.height / this.props.hourSize);
            this.setState({
                height: undefined,
                resizeY: undefined
            });
        })

    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        const x = this.state.posX !== undefined ? this.state.posX : 0,
            y = this.state.posY !== undefined ? this.state.posY : this.props.timeSlot.start * this.props.hourSize,
            translateString = `translate(${x}px, ${y}px)`;
        const style = {
            backgroundColor: this.props.color ? this.props.color : 'red',
            WebkitTransform: translateString,
            transform: translateString,
            height: this.state.height !== undefined ? this.state.height : this.props.timeSlot.duration * this.props.hourSize,
            zIndex: this.state.dragging ? 2000 : undefined
        }
        const duration = this.state.height ? this.state.height / this.props.hourSize : this.props.timeSlot.duration;
        const classNames = `timebox ${duration === 0.5 ? 'small' : ''}`;
        return (
            <li className={classNames} ref="box" style={style} data-id={this.props.timeSlot.id} data-date={this.props.date} data-type="timebox">
                <div className="name">{this.props.name}</div>
                <div className="sub-project">{this.props.timeSlot.subProject}</div>
                <div className="bottom-bar">
                    <span className="duration">{TimeBox.formatTime(duration)}</span>
                    <span className="activity">{this.props.timeSlot.activity}</span>
                </div>
            </li>
        );
    }
};
