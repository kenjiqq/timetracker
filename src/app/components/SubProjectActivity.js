import React, {PropTypes} from 'react';
import interact from 'interact.js';
import NewTimeSlotDragger from './NewTimeSlotDragger';


export default class SubProjectActivity extends React.Component {

    static propTypes = {
        name: PropTypes.string.isRequired,
        project: PropTypes.object.isRequired,
        subProject: PropTypes.object.isRequired,
    }

    componentDidMount() {
        const element = this.refs.item;
        interact(element)
        .draggable({})
        .on('dragstart', event => {
            NewTimeSlotDragger.show(this.props.project.name, this.props.subProject.name, this.props.name, this.props.subProject.color || this.props.project.color, event.pageX, event.pageY);
        })
        .on('dragmove', event => {
            NewTimeSlotDragger.move(event.dx, event.dy);
        })
        .on('dragend', event => {
            NewTimeSlotDragger.hide();
        })
    }

    render() {
        const dataAttrs = {
            'data-project': this.props.project.id,
            'data-subproject': this.props.subProject.id,
            'data-type': 'new-timeslot',
            'data-activity': this.props.name
        }
        return (
            <li className="project-activity" ref="item" {...dataAttrs}>{this.props.name}</li>
        )
    }
}
