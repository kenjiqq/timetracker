import React, {PropTypes, Component} from 'react';
import moment from 'moment';
import TimeSheetRow from './TimeSheetRow';

export default class Timesheet extends Component {
    static propTypes = {
        timeSlots: PropTypes.object.isRequired,
        projects: PropTypes.object.isRequired,
        subProjects: PropTypes.object.isRequired,
        week: PropTypes.number.isRequired
    }

    state = {
        report: []
    }

    static capsFirstLetter = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    generateReportData (timeSlots) {
        const report = Object.keys(timeSlots).reduce((report, date) => {
            const dateTimeSlots = timeSlots[date];
            dateTimeSlots.forEach(timeSlot => {
                const { project, subProject, duration, activity } = timeSlot;
                report[project] = report[project] || {};
                report[project][subProject] = report[project][subProject] || {};
                report[project][subProject][activity] = report[project][subProject][activity] || {};
                report[project][subProject][activity][date] = report[project][subProject][activity][date] || 0;
                report[project][subProject][activity][date] += duration;
            });
            return report;
        }, {});
        this.setState({
            report
        });
    }

    componentWillReceiveProps (newProps) {
        if (this.props.timeSlots !== newProps.timeSlots) {
            this.generateReportData(newProps.timeSlots);
        }
    }

    componentDidMount () {
        this.generateReportData(this.props.timeSlots);
    }

    renderWeekHeaders () {
        const startOfWeek = moment().week(this.props.week).startOf('week');
        return [0, 1, 1, 1, 1, 1, 1].map((inc, index) => {
            return (
                <th key={index}>{ Timesheet.capsFirstLetter(startOfWeek.add(inc, 'days').format('dddd DD-MM-YYYY')) }</th>
            );
        });
    }

    renderDayTotals () {
        const startOfWeek = moment().week(this.props.week).startOf('week');
        return [0, 1, 1, 1, 1, 1, 1].map((inc, index) => {
            const day = startOfWeek.add(inc, 'days').format('DD-MM-YYYY');
            const sum = this.props.timeSlots[day] && this.props.timeSlots[day].reduce((sum, timeSlot) => {
                return sum + timeSlot.duration;
            }, 0) || 0;
            return (
                <td key={index}>{ sum }</td>
            );
        });
    }

    renderProjectRows () {
        const rows = [];
        for (var projectId in this.state.report) {
            for (var subProjectId in this.state.report[projectId]) {
                for (var activity in this.state.report[projectId][subProjectId]) {
                    const project = this.props.projects[projectId];
                    const subProject = this.props.subProjects[subProjectId];
                    const label = project.name + ' ' + subProject.name + ' ' + activity;
                    rows.push(
                        <TimeSheetRow key={projectId + subProjectId + activity} week={this.props.week} daySums={this.state.report[projectId][subProjectId][activity]} name={label} />
                    );
                }
            }
        }
        return rows;
    }

    render () {
        return (
            <div className='timesheet'>
                <table className='table-bordered timesheet-table'>
                    <tbody>
                        <tr>
                            <th>Project</th>
                            { this.renderWeekHeaders() }
                        </tr>
                        { this.renderProjectRows() }
                        <tr>
                            <td>Total</td>
                            {this.renderDayTotals()}
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
