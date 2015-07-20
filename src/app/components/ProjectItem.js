import React from 'react';
import interact from 'interact.js';

export default class ProjectItem extends React.Component {
    state = {
        posX: 0,
        posY: 0,
        dragging: false
    }
    componentDidMount() {
        const element = this.refs.item;
        interact(element)
        .draggable({})
        .on('dragstart', (event) => {
            this.setState({
                dragging: true
            })
        })
        .on('dragmove', (event) => {
            this.setState({
                posX: this.state.posX + event.dx,
                posY: this.state.posY + event.dy
            });
        })
        .on('dragend', (event) => {
            this.setState({
                posX: 0,
                posY: 0,
                dragging: false
            });
        });
    }
    render() {
        const {posX, posY} = this.state;
        const {project} = this.props;
        const translateString = `translate(${posX}px, ${posY}px)`;
        const style = {
            backgroundColor: project.color,
            WebkitTransform: translateString,
            transform: translateString,
            zIndex:  this.state.dragging ? 2000 : undefined
        };
        return (
            <li key={project.code} ref="item" className="project" style={style} data-id={project.code} data-type="project">
                <span>{project.name}</span>
            </li>
        );
    }
}
