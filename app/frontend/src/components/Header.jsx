import React, { Fragment } from 'react'
import { LinearProgress, AppBar, Toolbar, Typography, IconButton, withStyles, MenuItem, Menu, Divider, CssBaseline,  MenuList  } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons'
import PropTypes from 'prop-types'
import { Link as LinkRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../actions/auth';
import classNames from 'classnames';
import Dashboard from './Dashboard';
import Login from '../containers/auth/Login';

const drawerWidth = 250;

const style = theme => ({
    root: {
        display: 'flex',
        zIndex: 1
    },
    grow: {
        flexGrow: 1 ,
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    title: {
        flexGrow: 1,
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        zIndex: 0,
        flexGrow: 1,
        padding: theme.spacing(2),
        height: '100vh',
        overflow: 'hidden'
    },
  });
class Header extends React.Component {

    state = {
        anchorEl: null,
    };

    // eslint-disable-next-line
    authLinks = (
        <MenuList>
            <Divider/>
            <MenuItem onClick={this.props.logout} >
                Logout
            </MenuItem>
        </MenuList>
    );

    
    guestLinks = (
        <MenuList>
            <MenuItem component={LinkRouter}  to="/login"  onClick={this.handleClose}>
                Login
            </MenuItem>
            <MenuItem component={LinkRouter} to="/register"  onClick={this.handleClose} >
                Register
            </MenuItem>
        </MenuList>
    );

    handleMenu = (event) => {
        this.setState({anchorEl:event.currentTarget})
    }

    handleClose = () => {
        this.setState({anchorEl:null})
    }
    
    render() {

        const {isAuthenticated, user} = this.props.auth
        const {anchorEl} = this.state
        const {classes} = this.props
        const open = Boolean(anchorEl)
        
        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar
                position="absolute"
                >
                <Toolbar className={classes.toolbar}>
                    <Typography variant="overline" color="inherit" className={classes.grow}>
                        Explorador de Litígios Similares
                    </Typography>
                    <Fragment>
                        <Typography variant="subtitle1" color="inherit" >{user ? `Welcome ${user.username}` : ""}</Typography>
                        <IconButton aria-owns={open ? 'menu-appbar' : undefined}
                                    aria-haspopup="true"
                                    onClick={this.handleMenu}
                                    color="inherit"
                        >
                            <AccountCircle/>
                        </IconButton>
                        <Menu   id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                                }}
                                transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                                }}
                                open={open}
                                onClose={this.handleClose}
                        >
                            { isAuthenticated ? this.authLinks : this.guestLinks }
                        </Menu>
                    </Fragment>
                </Toolbar>
                { this.props.isLoading ? <LinearProgress /> : undefined}
                </AppBar>
                <div className={classes.content}> 
                    <div className={classes.appBarSpacer} />
                    {/* { isAuthenticated ? <Dashboard>{this.props.children}</Dashboard> : this.props.children }                     */}
                    <Dashboard>{this.props.children}</Dashboard>
                </div>
            </div>
        )
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired
}


const mapStateToProps = (state) => ({
  auth: state.authReducer,
  isLoading : state.loadingReducer.isLoading
})

const mapDispatchToProps = {
  logout
}

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(style)(Header));