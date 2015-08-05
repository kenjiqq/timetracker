import {EventEmitter} from 'events';
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { TimeBox } from './TimeBox';

const SHOW_EVENT = 'show';
const HIDE_EVENT = 'hide';
const MOVE_EVENT = 'move';

class Manager extends EventEmitter {
    props = {}
    pos = {}
    isShown = false

    show(project, subProject, activity, startX, startY) {
        this.isShown = true;
        this.pos = {
            x: startX,
            y: startY,
        }
        this.props = {
            project, subProject, activity
        }
        this.emit(SHOW_EVENT);
    }

    hide() {
        this.isShown = false;
        this.pos = {};
        this.props = {};
        this.emit(HIDE_EVENT);
    }

    move(dx, dy) {
        this.pos.x += dx;
        this.pos.y += dy;
        this.emit(MOVE_EVENT);
    }

    getProps() {
        return this.props;
    }

    getPos() {
        return this.pos;
    }
}

const manager = new Manager();

export default class NewTimeSlotDragger extends React.Component {
    static propTypes = {
        hourSize: PropTypes.number.isRequired
    }
    state = {
        isShown: false,
        props: {},
        pos: {}
    }

    static show(project, subProject, activity, startX, startY) {
        manager.show(project, subProject, activity, startX, startY);
    }

    static hide() {
        manager.hide();
    }

    static move(dx, dy) {
        manager.move(dx, dy);
    }

    static getPos() {
        return manager.getPos();
    }

    componentDidMount() {
        let posDiffX = 0;
        let posDiffY = 0;

        manager.on(SHOW_EVENT, () => {
            const el = ReactDOM.findDOMNode(this.refs.dragger);
            const elRect = el.getBoundingClientRect();
            posDiffX = elRect.left + (elRect.right - elRect.left) / 2;
            posDiffY = elRect.top;
            const pos = {
                x:  manager.getPos().x - posDiffX,
                y:  manager.getPos().y - posDiffY
            }

            this.setState({
                isShown: true,
                props: manager.getProps(),
                pos
            })
        });

        manager.on(HIDE_EVENT, () => {
            this.setState({
                isShown: false,
                pos: {}
            })
        });

        manager.on(MOVE_EVENT, () => {
            const dragPos = manager.getPos();
            const pos = {
                x: dragPos.x - posDiffX,
                y: dragPos.y - posDiffY
            }
            this.setState({
                pos
            })
        });
    }

    renderIfShown() {
        if(this.state.isShown) {
            return (
                <TimeBox {...this.state.props} duration={0.5} hourSize={this.props.hourSize}></TimeBox>
            )
        }
    }

    render() {
        const translateString = `translate(${this.state.pos.x || 0}px, ${this.state.pos.y || 0}px)`;
        const style = {
            WebkitTransform: translateString,
            transform: translateString,
            zIndex: 2000
        }
        return (
            <div ref="dragger" className="newtimeslot-container" style={style}>
                { this.renderIfShown() }
            </div>
        )
    }
}
