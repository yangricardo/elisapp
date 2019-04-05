import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { TextField, withStyles, Button, Paper, Typography } from '@material-ui/core';
import { ArrowRight } from '@material-ui/icons';
import PropTypes from 'prop-types'
import { addLead } from '../actions/leads';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  papper: {
    paddingRight: theme.spacing.unit * 2,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

export class Form extends Component {

  state = {
    name: '',
    email: '',
    message: ''
  }

  static propTypes = {
    addLead: PropTypes.func.isRequired
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  onSubmit = e => {
    e.preventDefault();
    const {name, email, message} = this.state;
    const lead = { name, email, message }
    this.props.addLead(lead);
    this.setState({name:'',email:'',message:''})
  }
  
  render() {
    const { classes } = this.props;
    const { name, email, message} = this.state;
    return (
      <Fragment>
        <Typography variant="h4">Add Lead</Typography>
        <Paper className={classes.papper} >
          <form onSubmit={this.onSubmit}>
          <TextField
            id="name"
            label="Name"
            className={classes.textField}
            value={name}
            onChange={this.handleChange('name')}
            margin="normal"
            fullWidth
            />
          <TextField
            id="email"
            label="Email"
            className={classes.textField}
            value={email}
            onChange={this.handleChange('email')}
            type="email"
            name="email"
            autoComplete="email"
            margin="normal"
            fullWidth
            />
          <TextField
            id="message"
            label="Message"
            className={classes.textField}
            value={message}
            onChange={this.handleChange('message')}
            margin="normal"
            fullWidth
            />
          <Button variant="contained" size="large" fullWidth color="primary" className={classes.button} type="submit">
            Send
            <ArrowRight/>
          </Button>
          </form>
        </Paper>
      </Fragment>
    )
  }
}

Form.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(null,{addLead})(withStyles(styles)(Form));
