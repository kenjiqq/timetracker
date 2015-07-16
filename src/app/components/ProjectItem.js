import React from 'react';
import interact from 'interact.js';

export default class ProjectItem extends React.Component {
    state = {
        posX: 0,
        posY: 0
    }
    componentDidMount() {
        const element = this.refs.item;
        interact(element)
        .draggable({})
        .on('dragmove', (event) => {
            this.setState({
                posX: this.state.posX + event.dx,
                posY: this.state.posY + event.dy
            });
        })
        .on('dragend', (event) => {
            this.setState({
                posX: 0,
                posY: 0
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
            transform: translateString
        };
        return (
            <li key={project.code} ref="item" className="project" style={style} data-id={project.code} data-type="project">
                <span>{project.name}</span>
            </li>
        );
    }
}
