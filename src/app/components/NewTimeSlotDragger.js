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

    show(project, subProject, activity, color, startX, startY) {
        this.isShown = true;
        this.pos = {
            x: startX,
            y: startY,
        }
        this.props = {
            project, subProject, activity, color
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

    static show(project, subProject, activity, color, startX, startY) {
        manager.show(project, subProject, activity, color, startX, startY);
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

    posDiffX = 0;
    posDiffY = 0;

    showListener = () => {
        const el = ReactDOM.findDOMNode(this.refs.dragger);
        const elRect = el.getBoundingClientRect();
        this.posDiffX = elRect.left + (elRect.right - elRect.left) / 2;
        this.posDiffY = elRect.top;
        const pos = {
            x:  manager.getPos().x - this.posDiffX,
            y:  manager.getPos().y - this.posDiffY
        }

        this.setState({
            isShown: true,
            props: manager.getProps(),
            pos
        })
    }

    moveListener = () => {
        const dragPos = manager.getPos();
        const pos = {
            x: dragPos.x - this.posDiffX,
            y: dragPos.y - this.posDiffY
        }
        this.setState({
            pos
        })
    }

    hideListener = () => {
        this.setState({
            isShown: false,
            pos: {}
        })
    }

    componentDidMount() {
        manager.on(SHOW_EVENT, this.showListener);
        manager.on(HIDE_EVENT, this.hideListener);
        manager.on(MOVE_EVENT, this.moveListener);
    }

    componentWillUnmount() {
        manager.removeListener(SHOW_EVENT, this.showListener);
        manager.removeListener(HIDE_EVENT, this.hideListener);
        manager.removeListener(MOVE_EVENT, this.moveListener);
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
