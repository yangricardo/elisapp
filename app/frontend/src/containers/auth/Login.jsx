import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles, CssBaseline, Paper, FormControl, InputLabel, Input, Typography, Link, Button } from '@material-ui/core';
import { Link as LinkRouter, Redirect } from 'react-router-dom'
import { login } from '../../actions/auth';

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
        marginTop: theme.spacing(20),
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



class Login extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        login: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool
    }

    state = {
        username:"",
        password:"",
    }


    onSubmit = e => {
        e.preventDefault();
        this.props.login(this.state.username, this.state.password)
    }

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {
        if(this.props.isAuthenticated){
            return <Redirect to="/buscarprocesso"/>
        }
        const {username, password} = this.state
        const {classes} = this.props
        return (
        <main className={classes.main}>
            <CssBaseline/>
            <Paper className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Login
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
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input  name="password"
                                type="password"
                                id="password"
                                autoComplete="password"
                                onChange={this.onChange}
                                value={password}/>
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
                        Don't have an account? <LinkRouter to="/register">Register</LinkRouter>
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

export default connect(mapStateToProps, {login})(withStyles(styles)(Login))
