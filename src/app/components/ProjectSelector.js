import {EventEmitter} from 'events';
import React, {PropTypes} from 'react';
import ProjectItem from './ProjectItem';

const OPEN_EVENT = 'open';
const CLOSE_EVENT = 'close';

class Manager extends EventEmitter {
    pos = {
        x: 0,
        y: 0
    }

    isOpen = false

    open(x, y) {
        this.isOpen = true;
        this.pos.x = x;
        this.pos.y = y;
        this.emit(OPEN_EVENT);
    }

    close() {
        this.isOpen = false;
        this.pos.x = 0;
        this.pos.y = 0;
        this.emit(CLOSE_EVENT);
    }

    getPos() {
        return this.pos;
    }
}
const manager = new Manager();

export default class ProjectSelector extends React.Component {
    static propTypes = {
        projects: PropTypes.array.isRequired
    }

    state = {
        isOpen: false,
        x: 0,
        y: 0
    }
    static open(x, y) {
        manager.open(x, y);
    }

    static close() {
        manager.close();
    }

    componentDidMount() {
        manager.on(OPEN_EVENT, () => {
            const {x, y} = manager.getPos();
            this.setState({
                isOpen: true,
                x,
                y
            })
        });

        manager.on(CLOSE_EVENT, () => {
            this.setState({
                isOpen: false
            })
        });
    }

    closeButtonClick() {
        manager.close();
    }

    renderProjects() {
        return this.props.projects.map(project => {
            return (
                <ProjectItem key={project.code} project={project}></ProjectItem>
            )
        })
    }

    render() {
        const style ={
            left: this.state.x,
            top: this.state.y
        }
        return (
            <dialog className="project-selector" style={style} open={this.state.isOpen}>
                <h4>Choose project</h4>
                <div className="project-list panel-group">
                    {this.renderProjects()}
                </div>
                <button onClick={this.closeButtonClick}>Close</button>
            </dialog>
        );
    }
}
