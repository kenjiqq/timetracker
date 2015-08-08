import React, {PropTypes} from 'react';
import ProjectSelect from './ProjectSelect';

export default class SubProjectForm extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        subProject: PropTypes.object,
        actions: PropTypes.object.isRequired
    }

    state = {
        projectId: undefined,
        projectName: this.props.subProject && this.props.subProject.name || '',
        projectColor: this.props.subProject && this.props.subProject.color || ''
    }

    handleProjectNameChange = (event) => {
        this.setState({projectName: event.currentTarget.value});
    }

    handleProjectColorChange = (event) => {
        this.setState({projectColor: event.currentTarget.value});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const {projectId, projectCode, projectName, projectColor} = this.state;
        if(projectId) {
            this.props.actions.editSubProject(projectId, this.props.project.id, projectName, projectColor);
        } else {
            this.props.actions.addSubProject(this.props.project.id, projectName, projectColor);
        }
    }

    componentWillReceiveProps(newProps) {
        if(newProps.subProject !== this.props.subProject) {
            this.setState({
                projectId: newProps.subProject && newProps.subProject.id || undefined,
                projectName: newProps.subProject && newProps.subProject.name || '',
                projectColor: newProps.subProject && newProps.subProject.color || ''
            })
        }
    }

    render() {
        return (
            <form role="form" className="sub-project-form" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="subProjectNameField">Name</label>
                    <input type="text" className="form-control" id="subProjectNameField" value={this.state.projectName} onChange={this.handleProjectNameChange}></input>
                </div>
                <div className="form-group">
                    <label htmlFor="subProjectColorPicker">Color</label>
                    <input type="text" className="form-control" id="subProjectColorPicker" value={this.state.projectColor} onChange={this.handleProjectColorChange}></input>
                </div>
                <button type="Submit" className="btn btn-primary">{this.state.projectId ? 'Edit sub project' : 'Add sub project'}</button>
            </form>
        );
    }
}
