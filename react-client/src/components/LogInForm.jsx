import React from 'react';
import { RaisedButton, FlatButton, Dialog, TextField } from 'material-ui';
import { Redirect } from 'react-router';

import { Link } from 'react-router-dom';
// import helpers from '../helpers.jsx';
const axios = require('axios');

export default class LogInForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '', 
      password: '',
      open: false,
      signedIn: false,
      errTitle: '',
      errBody: ''
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.submitCreds = this.submitCreds.bind(this);
  }

  submitCreds() {
    const that = this;
    const credObj = {username: this.state.username, password: this.state.password};
    const url = '/login';
  
    if (!(this.state.username && this.state.password)) {
      this.handleOpen('Login Error', 'Username and Password can\'t be blank');
    } else {
      axios.post(url, credObj)
        .then((response) => {
          if (response.status === 200) {
            window.localStorage.accessToken = response.data.token;
            this.setState({signedIn: true});
          }
        })
        .catch((error) => {
          console.log(error);
          this.handleOpen('Login Error', 'Incorrect Username or Password');
        });
    }
  }

  componentDidMount() {
    window.localStorage.removeItem('accessToken');
  }

  setUsername(e) {
    this.setState({username: e.target.value});
  }

  setPassword(e) {
    this.setState({password: e.target.value});
  }

  handleOpen(errTitle, errBody) {
    this.setState({ 
      open: true,
      errTitle,
      errBody 
    });
  };

  handleClose() {
    this.setState({ open: false });
  };
  
  render(){

    const actions = [
      <FlatButton
        label="OK"
        primary={true}
        onClick={this.handleClose.bind(this)}
      />,
    ];
    return (
      <div id="login">

        {this.state.signedIn === true ? <Redirect to="/" /> : ''}

        <Dialog
          title={this.state.errTitle}
          actions={actions}
          modal={true}
          open={this.state.open}
        >
          {this.state.errBody}
        </Dialog>
        
        <h2>Login</h2>
          <div>
            <TextField
              hintText="Email"
              id="username" 
              onChange={this.setUsername.bind(this)} 
              value={this.state.username} 
              type="text" 
              name="username"
            />
          </div>
          <div>
            <TextField
              hintText="Password" 
              id="password" 
              onChange={this.setPassword.bind(this)} 
              value={this.state.password} 
              type="password" 
              name="password"/>
          </div>
          <div>
            <RaisedButton
              onClick={this.submitCreds.bind(this)} 
              value="Login"
            > Login
            </RaisedButton>
          </div>
          <br></br>
          <Link to="/signup" style={{textDecoration: 'none'}}>
            Not a user? Sign up here.
          </Link>
      </div>
    );
  }
} 


