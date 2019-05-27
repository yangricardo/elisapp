import React, { Fragment } from 'react'
import { AppBar, Toolbar, Typography, IconButton, withStyles, MenuItem, Menu, Divider, List, Drawer, CssBaseline, ListItem, ListItemIcon, ListItemText, MenuList  } from '@material-ui/core';
import { AccountCircle, ChevronLeft, ChevronRight } from '@material-ui/icons'
import PropTypes from 'prop-types'
import { Link as LinkRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../actions/auth';
import classNames from 'classnames';
import { mainListItems, secondaryListItems } from './listItems';

const drawerWidth = 250;

const style = theme => ({
    root: {
        display: 'flex',
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
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    menuButtonLink: { textDecoration: 'none', display: 'block' },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        height: '100vh',
        overflow: 'auto',
    },
  });
class Header extends React.Component {

    state = {
        open: false,
        anchorEl: null,
    };

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
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
            <MenuItem component={LinkRouter}  to="/login" className={this.props.classes.menuButtonLink} onClick={this.handleClose}>
                Login
            </MenuItem>
            <MenuItem component={LinkRouter} to="/register" className={this.props.classes.menuButtonLink} onClick={this.handleClose} >
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

        const {anchorEl} = this.state
        const {classes} = this.props
        const {isAuthenticated, user} = this.props.auth
        const open = Boolean(anchorEl)
        
        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar
                position="absolute"
                className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
                >
                <Toolbar className={classes.toolbar}>
                    <Typography variant="caption" color="inherit" className={classes.grow}>
                        Elis
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
                </AppBar>
                <Drawer
                    variant="permanent"
                    classes={{
                        paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
                    }}
                    open={this.state.open}
                    >
                    <div className={classes.toolbar} />
                    <Divider />
                    <List>{mainListItems}</List>
                    <Divider />
                    <List>
                    <ListItem button onClick={this.state.open ? this.handleDrawerOpen : this.handleDrawerClose }>
                        <ListItemIcon>
                            <ChevronRight/>
                        </ListItemIcon>
                        <ListItemText primary="Recolher Menu" />
                    </ListItem>
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} />
                    {this.props.children}
                </main>
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
  auth: state.authReducer
})

const mapDispatchToProps = {
  logout
}

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(style)(Header));