import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios';
import { buildTokenHeader } from '../../actions/auth';
import {cyan, indigo, common} from '@material-ui/core/colors/';
import { Info } from '@material-ui/icons';
import { withStyles, makeStyles, createMuiTheme, Paper , Chip, Tooltip, Box, Fab, Grid, Typography, List, ListItem, ListItemText, ListItemIcon, Divider } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { returnError } from '../../actions/message';
import { setSearchedProcess } from '../../actions/similarprocesses';

export const detailProcessTheme = createMuiTheme({
    palette: {
        primary: {
            main: indigo[500],
            contrastText: common.white,
        },
        secondary: {
            main: cyan[800],
            contrastText: common.white,
        },
        default : {
            main : common.white
        }
    },
});

export const processLabelTheme = createMuiTheme({
    palette: {
        primary: {
            main: "#fff",
        },
        secondary: {
            main: "#fff",
        },
        default : {
            main : "#fff"
        }
    },
});
  
export const BorderBox = props => {
    return (
        <Box bgcolor={`${props.bgcolor}.main`} borderRadius={10}>
            {props.children}
        </Box>
    );
}

export const SectionBox = props => {
    return (
        <Box p={1}>{props.children}</Box>
    );
}


export const HtmlTooltip = withStyles(theme => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 600,
      fontSize: theme.typography.pxToRem(22),
      '& b': {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
  }))(Tooltip);

export const ButtonToolTip = props => {
    const disable = props.text.length === 0
    return (
        <div>
            <HtmlTooltip 
                disableHoverListener={disable.toString()}
                title={
                    <Fragment>
                        {props.text.split("\n").map((item, key) => {
                            return  <Typography color="inherit" key={key}>
                                        {item}<br/>
                                    </Typography>})
                  }</Fragment> 
                }
                placement="bottom"
            >
                <Fab variant="extended" disable={disable.toString()} size="small" color={props.bgcolor}>
                    <Info/>&nbsp;{props.button}
                </Fab>
            </HtmlTooltip>
        </div>
    )
}

export const ProcessLabel = props => {
    return (
        <ThemeProvider theme={processLabelTheme}>
            <Grid container direction="column" justify="center" alignItems="center" spacing={0}>
                <Grid item><Typography color="primary" variant="caption">Código {props.cnj?'CNJ':'TJ'}</Typography></Grid>
                <Grid item><Typography color="primary" variant="button">{props.cod}</Typography></Grid>
            </Grid>
        </ThemeProvider>
    );
}

const useSimilarListStyles = makeStyles(theme => ({
    root: {
        overflowY: 'auto',
        width: '100%',
        height: 400,
        backgroundColor: theme.palette.background.paper,
    },
}));

const SimilarList = props => {
    const {similarProcesses, token,setSearchedProcess} = props
    const classes = useSimilarListStyles();
    const getSimilarProcess = (similarProcessURL) => {
        axios.get(similarProcessURL, buildTokenHeader(token))
        .then(res => {
            const { results } = res.data
            if (results.hasOwnProperty('id')){
                setSearchedProcess(results);
            }
        })
        .catch(err => returnError(err.response.data, err.response.status));
    }
    
    return (
        <Paper className={classes.root}>
            <List dense>
                { similarProcesses.map((item,index)=>{
                    return (
                    <ListItem key={index} button onClick={getSimilarProcess(item[1])}>
                        <ListItemIcon>
                            <Chip size="small" label={`${item[0]}%`}/>
                        </ListItemIcon>
                        <ListItemText primary={item[2]} />
                    </ListItem>
                )})
                }
            </List>
        </Paper>
    )
}


const mapStateToProps = (state) => ({
    token : state.authReducer.token,
})

const mapDispatchToProps = {
    setSearchedProcess,
    returnError
}

export default connect(mapStateToProps, mapDispatchToProps)(SimilarList)
