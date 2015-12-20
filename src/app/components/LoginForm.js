import React from 'react';
import Ref from '../constants/AsyncAdapter';
import classnames from 'classnames';

export default class ProjectForm extends React.Component {
    state = {
        username: '',
        password: '',
        authError: false
    }

    handleUsernameChange = (event) => {
        this.setState({username: event.currentTarget.value});
    }

    handlePasswordChange = (event) => {
        this.setState({password: event.currentTarget.value});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        Ref.authWithPassword({
            email: this.state.username,
            password: this.state.password
        }, (error, authData) => {
            this.setState({authError: error});
        });
    }

    render () {
        const wrapperClasses = classnames({
            'login-form-wrapper': true,
            'has-error': this.state.authError
        });
        return (
            <div className={wrapperClasses}>
                <span className='help-block'>{this.state.authError && this.state.authError.toString()}</span>
                <form role='form' className='login-form' onSubmit={this.handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor='userNameField'>Username</label>
                        <input type='email' className='form-control' id='userNameField' value={this.state.username} onChange={this.handleUsernameChange}></input>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='passwordField'>Password</label>
                        <input type='password' className='form-control' id='passwordField' value={this.state.password} onChange={this.handlePasswordChange}></input>
                    </div>
                    <button type='Submit' className='btn btn-primary btn-block'>Login</button>
                </form>
            </div>
        );
    }
}
