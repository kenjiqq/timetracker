import React, {PropTypes} from 'react';
import SubProjectItem from './SubProjectItem';

export default class ProjectItem extends React.Component {
    static propTypes = {
        project: PropTypes.object.isRequired
    }

    state = {
        expanded: false
    }

    toggleProject  = () => {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    renderExpanded() {
        return this.props.project.subProjects.map(subProject => {
            return (
                <li key={subProject.name} className="list-group-item reset-padding">
                    <SubProjectItem subProject={subProject} defaultColor={this.props.project.color} project={this.props.project.code}></SubProjectItem>
                </li>
            )
        });
    }

    render() {
        const projctStyle = {
            backgroundColor: this.props.project.color
        }
        return (
            <div className="project panel panel-default">
                <div style={projctStyle} className="panel-heading" onClick={this.toggleProject}>
                    <h5 className="panel-title">{this.props.project.name}</h5>
                </div>
                <div className={`panel-collapse collapse ${ this.state.expanded ? 'in' : ''}`}>
                    <ul className="sub-projects list-group">
                        {this.renderExpanded()}
                    </ul>
                </div>
            </div>
        );
    }
}
