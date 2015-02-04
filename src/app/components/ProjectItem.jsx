var React = require('react');

var ProjectItem = React.createClass({
    getInitialState: function () {
        return {
            posX: 0,
            posY: 0
        };
    },
    componentDidMount: function () {
        var element = this.refs.item.getDOMNode();
        interact(element)
        .draggable({})
        .on('dragmove', function (event) {
            this.setState({
                posX: this.state.posX + event.dx,
                posY: this.state.posY + event.dy
            });
        }.bind(this))
        .on('dragend', function (event){
            this.setState({
                posX: 0,
                posY: 0
            });
        }.bind(this));
    },
    render: function() {
        var translateString = 'translate(' + this.state.posX + 'px, ' + this.state.posY + 'px)';
        var style = {
            backgroundColor: this.props.project.color,
            WebkitTransform: translateString,
            transform: translateString,
        }
        return (
            <li key={this.props.project.code} ref="item" className="project" style={style} data-id={this.props.project.code} data-type="project">
                <span>{this.props.project.name}</span>
            </li>
        );
    }

});

module.exports = ProjectItem;
