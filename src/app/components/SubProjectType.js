import React, {PropTypes} from 'react';
import interact from 'interact.js';

export default class SubProjectType extends React.Component {

    static propTypes = {
        name: PropTypes.string.isRequired,
        project: PropTypes.string.isRequired,
        subProject: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired
    }

    state = {
        posX: 0,
        posY: 0,
        dragging: false
    }

    componentDidMount() {
        const element = this.refs.item;
        interact(element)
        .draggable({})
        .on('dragstart', event => {
            this.setState({
                dragging: true
            });
        })
        .on('dragmove', event => {
            this.setState({
                posX: this.state.posX + event.dx,
                posY: this.state.posY + event.dy
            });
        })
        .on('dragend', event => {
            this.setState({
                posX: 0,
                posY: 0,
                dragging: false
            });
        })
    }

    render() {
        const {posX, posY} = this.state;
        const translateString = `translate(${posX}px, ${posY}px)`;
        const style = {
            backgroundColor: this.props.color,
            WebkitTransform: translateString,
            transform: translateString,
        }
        const dataAttrs = {
            'data-project': this.props.project,
            'data-subproject': this.props.subProject,
            'data-type': 'new-timeslot',
            'data-activity': this.props.name
        }
        return (
            <li className="project-activity" style={style} ref="item" {...dataAttrs}>{this.props.name}</li>
        )
    }
}
