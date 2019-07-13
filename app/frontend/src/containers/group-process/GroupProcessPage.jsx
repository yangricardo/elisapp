import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles, Typography, TextField, Grid, Paper, Box, List, ListItem, ListItemText, Divider } from '@material-ui/core'
import { createMessage } from '../../actions/message'
import { getSimilarGroups,getGroupProcesses } from '../../actions/similarprocesses'

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
})

class GroupProcessPage extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        this.props.getSimilarGroups()
    }

    onListClick = item => {
        this.props.getGroupProcesses(item)
    }

    render() {
        if(!this.props.isAuthenticated){
            this.props.createMessage({ loginRequired: "Login Required" });
            return <Redirect to="/login"/>
        }
        const { classes,similarGroups } = this.props;

        const BoxList = props => <Box 
                style={{maxHeight:500, overflowY:'auto'}} boxShadow={2} borderRadius={10} 
                borderColor="primary.main" component={List} {...props}>
                    {props.children}
                </Box>

        return (
            <Grid container direction="column" 
            justify="flex-start"
            alignItems="stretch" 
            spacing={2}>
                <Grid item md={4}>
                    <Paper component={BoxList}  dense>
                        {similarGroups.map((item,index)=>{
                        return (
                        <Fragment key={index} >
                            <ListItem button onClick={this.onListClick.bind(this, item)}>
                                <ListItemText primary={
                                    <Typography variant="button">{item.descricao}</Typography>
                                }/>
                            </ListItem>
                            <Divider component="li"  light />
                        </Fragment>
                        )})}
                    </Paper>
                </Grid>
                <Grid item md={8}>

                </Grid>
            </Grid>
        )
    }

}


const mapStateToProps = (state) => ({
    isAuthenticated: state.authReducer.isAuthenticated,
    similarGroups : state.similarProcessesReducer.similarGroups
})

const mapDispatchToProps = {
    createMessage,
    getSimilarGroups,
    getGroupProcesses
}


export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(GroupProcessPage));