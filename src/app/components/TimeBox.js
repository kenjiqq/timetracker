'use strict';

import React, { PropTypes, Component } from 'react';
import interact from 'interact.js';

export class TimeBox extends Component {
    static propTypes = {
        hourSize: PropTypes.number.isRequired,
        color: PropTypes.string,
        project: PropTypes.string.isRequired,
        duration: PropTypes.number.isRequired,
        subProject: PropTypes.string.isRequired,
        activity: PropTypes.string.isRequired
    }

    static formatTime (decimal) {
        const hrs = Math.floor(decimal);
        let min = Math.round(decimal % 1 * 60);
        min = min < 10 ? '0' + min : min.toString();
        return hrs + ':' + min;
    }

    render () {
        const style = {
            backgroundColor: this.props.color ? this.props.color : 'red',
            height: this.props.duration * this.props.hourSize
        };
        const classNames = `timebox ${this.props.duration === 0.5 ? 'small' : ''}`;
        return (
            <div className={classNames} style={style}>
                <div className='name'>{this.props.project}</div>
                <div className='sub-project'>{this.props.subProject}</div>
                <div className='bottom-bar'>
                    <span className='duration'>{TimeBox.formatTime(this.props.duration)}</span>
                    <span className='activity'>{this.props.activity}</span>
                </div>
            </div>
        );
    }
}

export class TimeBoxExisting extends Component {
    static propTypes = {
        ...TimeBox.propTypes,
        date: PropTypes.string.isRequired,
        id: PropTypes.string,
        setDuration: PropTypes.func.isRequired,
        start: PropTypes.number.isRequired,
        hourSize: PropTypes.number.isRequired,
        duration: PropTypes.number.isRequired
    }

    state = {
        posX: undefined,
        posY: undefined,
        resizeY: undefined,
        dragging: false
    }

    componentDidMount () {
        this.mounted = true;
        const element = this.refs.box;
        interact(element)
        .draggable({
            snap: {
                targets: [
                    interact.createSnapGrid({ x: 1, y: this.props.hourSize / 4 })
                ],
                offset: 'startCoords'
            }
        })
        .resizable({
            snap: {
                targets: [
                    interact.createSnapGrid({ x: 1, y: this.props.hourSize / 4 })
                ],
                offset: 'startCoords'
            },
            axis: 'y'
        })
        .on('dragstart', (event) => {
            this.setState({
                posX: 0,
                posY: this.props.start * this.props.hourSize,
                dragging: true
            });
        })
        .on('dragmove', event => {
            this.setState({
                posX: this.state.posX + event.dx,
                posY: this.state.posY + event.dy
            });
        })
        .on('dragend', (event) => {
            if (this.mounted) {
                this.setState({
                    posX: undefined,
                    posY: undefined,
                    dragging: false
                });
            }
        })
        .on('resizestart', (event) => {
            this.setState({
                duration: this.props.duration,
                resizeY: event.target.getBoundingClientRect().top + (event.pageY - event.target.getBoundingClientRect().bottom)
            });
        })
        .on('resizemove', (event) => {
            const newHeight = event.pageY - this.state.resizeY;
            if (newHeight >= this.props.hourSize / 2) {
                this.setState({
                    duration: newHeight / this.props.hourSize
                });
            }
        })
        .on('resizeend', (event) => {
            this.props.setDuration(this.props.id, this.props.date, this.state.duration);
            this.setState({
                duration: undefined,
                resizeY: undefined
            });
        });
    }

    componentWillUnmount () {
        this.mounted = false;
    }

    render () {
        const {duration, start, date, id, ...rest} = this.props;
        const x = this.state.posX !== undefined ? this.state.posX : 0;
        const y = this.state.posY !== undefined ? this.state.posY : start * this.props.hourSize;
        const translateString = `translate(${x}px, ${y}px)`;

        const style = {
            WebkitTransform: translateString,
            transform: translateString,
            zIndex: this.state.dragging ? 2000 : undefined
        };

        const dataAttrs = {
            'data-id': id,
            'data-date': date,
            'data-type': 'timebox'
        };

        return (
            <li ref='box' className='timebox-container' style={style} {...dataAttrs}>
                <TimeBox {...rest} duration={this.state.duration || duration} />
            </li>
        );
    }
};
