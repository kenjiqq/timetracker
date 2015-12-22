import {createSelector} from 'reselect';

export const projectsSelector = createSelector(
    [state => state.projects],
    projects => ({projects: projects.toJS()})
);
export const subProjectsSelector = createSelector(
    [state => state.subProjects],
    subProjects => ({subProjects: subProjects.toJS()})
);

export const projectsListComputedSelector = createSelector(
    [projectsSelector, subProjectsSelector],
    ({projects}, {subProjects}) => {
        return {
            projects: Object.values(projects).map(project => ({
                ...project,
                subProjects: project.subProjects.map(id => ({id, ...subProjects[id]}))
            }))
        };
    }
);
