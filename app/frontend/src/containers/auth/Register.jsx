import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles, CssBaseline, Paper, FormControl, InputLabel, Input, Typography, Link, Button } from '@material-ui/core';
import { Link as LinkRouter, Redirect } from 'react-router-dom'
import { register } from '../../actions/auth';
import { createMessage } from '../../actions/message';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(400 + theme.spacing(6))]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(16),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        marginTop: theme.spacing(3),
    },
})



class Register extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        register: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool
    }

    state = {
        username:"",
        email:"",
        password:"",
        password2:"",
    }


    onSubmit = e => {
        e.preventDefault();
        const { username, email, password, password2 } = this.state;
        if (password !== password2) {
          this.props.createMessage({ passwordNotMatch: "Passwords do not match" });
        } else {
          const newUser = {
            username,
            password,
            email
          };
          this.props.register(newUser);
        }
    };
    
    onChange = e => this.setState({ [e.target.name]: e.target.value });

    render() {
        if(this.props.isAuthenticated){
            return <Redirect to="/leads"/>
        }
        const {username, email, password, password2} = this.state
        const {classes} = this.props
        return (
        <main className={classes.main}>
            <CssBaseline/>
            <Paper className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <form onSubmit={this.onSubmit} className={classes.form}>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="username">Username</InputLabel>
                        <Input  id="username" 
                                name="username" 
                                autoComplete="username" 
                                autoFocus
                                onChange={this.onChange}
                                value={username}/>
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input  id="email" 
                                name="email" 
                                autoComplete="email" 
                                onChange={this.onChange}
                                value={email}/>
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input  name="password"
                                type="password"
                                id="password"
                                autoComplete="password"
                                onChange={this.onChange}
                                value={password}/>
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="password2"> Confirm Password</InputLabel>
                        <Input  name="password2"
                                type="password"
                                id="password2"
                                onChange={this.onChange}
                                value={password2}/>
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign in
                    </Button>
                    <Typography>
                        Already have an account? <LinkRouter to="/login">Login</LinkRouter>
                    </Typography>
                </form>    
            </Paper>
        </main>
        )
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.authReducer.isAuthenticated
})

export default connect(mapStateToProps, { register, createMessage })(withStyles(styles)(Register))
