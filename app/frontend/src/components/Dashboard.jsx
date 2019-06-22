import React from 'react';
import { connect } from 'react-redux'
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { mainListItems } from './listItems';
import { ChevronRight, ChevronLeft } from '@material-ui/icons';

const drawerWidth = 250;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        overflowY: 'auto',
        height: '100vh',
        width: 'auto',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        marginRight: 0
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(7) + 1,
        },
    },
    content: {
        width: '100vw',
        height: '100vh',
        paddingTop: theme.spacing(1),
        overflowX: 'hidden',
        zIndex: 0
    },
}));

function Dashboard(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    function handleDrawerOpen() {
        setOpen(true);
    }

    function handleDrawerClose() {
        setOpen(false);
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            {
                props.isAuthenticated ?
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                    open={open}
                >
                    <Toolbar />
                    <Divider />
                    <List>{mainListItems}</List>
                    <Divider />
                    <ListItem button onClick={open == false ? handleDrawerOpen : handleDrawerClose} >
                        <ListItemIcon>
                            {open ? <ChevronLeft /> : <ChevronRight />}
                        </ListItemIcon>
                        <ListItemText primary="Recolher menu" />
                    </ListItem>
                </Drawer> : undefined
            }
            <main className={classes.content} >{props.children}</main>
        </div>
    );
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.authReducer.isAuthenticated,
    isLoading : state.loadingReducer.isLoading
  })
  
  const mapDispatchToProps = {
    
  }
  
export default connect(mapStateToProps,mapDispatchToProps)(Dashboard)