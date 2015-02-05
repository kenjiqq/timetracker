var React = require('react'),
    ProjectItem = require('./ProjectItem');

var ProjectList = React.createClass({

    render: function() {
        var projectNodes = this.props.projects.map(function (project) {
            return (
                <ProjectItem key={project.code} project={project} />
            );
        }.bind(this));

        return (
            <div className="projects">
                <h4 className="header">Projects</h4>
                <ul className="project-list list-unstyled">
                    {projectNodes}
                </ul>
            </div>
        );
    }

});

module.exports = ProjectList;
