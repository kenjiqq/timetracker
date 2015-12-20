import React, {PropTypes} from 'react';

export default class ProjectForm extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        addProject: PropTypes.func.isRequired,
        editProject: PropTypes.func.isRequired
    }

    state = {
        projectId: undefined,
        projectName: this.props.project && this.props.project.name || '',
        projectCode: this.props.project && this.props.project.code || '',
        projectColor: this.props.project && this.props.project.color || ''
    }

    handleProjectNameChange = (event) => {
        this.setState({projectName: event.currentTarget.value});
    }

    handleProjectCodeChange = (event) => {
        this.setState({projectCode: event.currentTarget.value});
    }

    handleProjectColorChange = (event) => {
        this.setState({projectColor: event.currentTarget.value});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const {projectId, projectCode, projectName, projectColor} = this.state;
        if (projectId) {
            this.props.editProject(projectId, projectCode, projectName, projectColor);
        } else {
            this.props.addProject(projectCode, projectName, projectColor);
        }
    }

    componentWillReceiveProps (newProps) {
        if (newProps.project !== this.props.project) {
            this.setState({
                projectId: newProps.project && newProps.project.id || undefined,
                projectName: newProps.project && newProps.project.name || '',
                projectCode: newProps.project && newProps.project.code || '',
                projectColor: newProps.project && newProps.project.color || ''
            });
        }
    }

    render () {
        return (
            <form role='form' className='project-form' onSubmit={this.handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='projectCodeField'>Code</label>
                    <input type='text' className='form-control' id='projectCodeField' value={this.state.projectCode} onChange={this.handleProjectCodeChange}></input>
                </div>
                <div className='form-group'>
                    <label htmlFor='projectNameField'>Name</label>
                    <input type='text' className='form-control' id='projectNameField' value={this.state.projectName} onChange={this.handleProjectNameChange}></input>
                </div>
                <div className='form-group'>
                    <label htmlFor='projectColorPicker'>Color</label>
                    <input type='text' className='form-control' id='projectColorPicker' value={this.state.projectColor} onChange={this.handleProjectColorChange}></input>
                </div>
                <button type='Submit' className='btn btn-primary'>{this.state.projectId ? 'Edit project' : 'Add project'}</button>
            </form>
        );
    }
}
