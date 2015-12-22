import React, { PropTypes } from 'react';
import ProjectForm from '../components/ProjectForm';
import SubProjectForm from '../components/SubProjectForm';
import ProjectSelect from '../components/ProjectSelect';
import ProjectActions from '../actions/ProjectActions';
import { connect } from 'react-redux';
import { projectsListComputedSelector } from '../selectors/projectSelectors';

class EditProjectSection extends React.Component {
    static propTypes = {
        projects: PropTypes.array.isRequired,
        editSubProject: PropTypes.func.isRequired,
        addSubProject: PropTypes.func.isRequired,
        addProject: PropTypes.func.isRequired,
        editProject: PropTypes.func.isRequired
    }

    state = {
        activeProject: undefined,
        activeSubProject: undefined
    }

    handleProjectSelect = project => {
        this.setState({
            activeProject: project !== 'new' ? project : undefined
        });
    }
    handleSubProjectSelect = project => {
        this.setState({
            activeSubProject: project !== 'new' ? project : undefined
        });
    }

    renderSubProjectForm () {
        if (this.state.activeProject) {
            const subActions = {
                editSubProject: this.props.editSubProject,
                addSubProject: this.props.addSubProject
            };
            return (
                <div>
                    <h3>Select Sub Project</h3>
                    <ProjectSelect projects={this.state.activeProject.subProjects} onSelect={this.handleSubProjectSelect} />
                    <h4>Sub Project Info</h4>
                    <SubProjectForm project={this.state.activeProject} subProject={this.state.activeSubProject} {...subActions} />
                </div>
            );
        }
    }

    render () {
        const formActions = {
            addProject: this.props.addProject,
            editProject: this.props.editProject
        };
        return (
            <div className='editproject-section'>
                <h3>Select Project</h3>
                <ProjectSelect projects={this.props.projects} onSelect={this.handleProjectSelect} />
                <h4>Project Info</h4>
                <ProjectForm project={this.state.activeProject} {...formActions} />
                { this.renderSubProjectForm() }
            </div>

        );
    }
};

export default connect(projectsListComputedSelector, ProjectActions)(EditProjectSection);
