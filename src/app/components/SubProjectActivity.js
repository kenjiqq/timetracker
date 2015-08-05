import React, {PropTypes} from 'react';
import interact from 'interact.js';
import NewTimeSlotDragger from './NewTimeSlotDragger';


export default class SubProjectActivity extends React.Component {

    static propTypes = {
        name: PropTypes.string.isRequired,
        project: PropTypes.string.isRequired,
        subProject: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired
    }

    componentDidMount() {
        const element = this.refs.item;
        interact(element)
        .draggable({})
        .on('dragstart', event => {
            NewTimeSlotDragger.show(this.props.project, this.props.subProject, this.props.name, event.pageX, event.pageY);
        })
        .on('dragmove', event => {
            NewTimeSlotDragger.move(event.dx, event.dy);
        })
        .on('dragend', event => {
            NewTimeSlotDragger.hide();
        })
    }

    render() {
        const style = {
            backgroundColor: this.props.color,
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
