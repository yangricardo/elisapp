import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles, Typography, TextField, Grid, Paper, Box, List, ListItem, ListItemText, Divider } from '@material-ui/core'
import { createMessage } from '../../actions/message'
import { getSimilarGroups,getGroupProcesses } from '../../actions/similarprocesses'
import ProcessTable from '../list-process/ProcessTable';

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
        this.state = {
            grupo:{}
        }
    }

    componentDidMount() {
        this.props.getSimilarGroups()
    }

    onListClick = item => {
        this.props.getGroupProcesses(item)
        this.setState({grupo:item})
    }

    render() {
        if(!this.props.isAuthenticated){
            this.props.createMessage({ loginRequired: "Login Required" });
            return <Redirect to="/login"/>
        }
        const { classes,similarGroups,listSimilar } = this.props;

        const BoxList = props => <Box 
                style={{maxHeight:1000, overflowY:'auto'}} boxShadow={2} borderRadius={10} 
                borderColor="primary.main" component={List} {...props}>
                    {props.children}
                </Box>

        return (
            <Grid container direction="row" 
            justify="flex-start"
            alignItems="stretch" 
            spacing={2}>
                <Grid item md={4}>
                    <Paper component={BoxList}  dense>
                        {
                            similarGroups.length ?
                            similarGroups.map((item,index)=>{
                            return (
                            <Fragment key={index} >
                                <ListItem button onClick={this.onListClick.bind(this, item)}>
                                    <ListItemText primary={
                                        <Typography variant="button">{item.descricao}</Typography>
                                    }/>
                                </ListItem>
                                <Divider component="li"  light />
                            </Fragment>
                            )}) : <ListItem><ListItemText>Não existem grupos criados</ListItemText></ListItem>
                        }
                    </Paper>
                </Grid>
                <Grid item md={8}>
                <ProcessTable isGroup group={this.state.grupo} groupSelected={this.state.groupSelected} />
                </Grid>
            </Grid>
        )
    }

}


const mapStateToProps = (state) => ({
    isAuthenticated: state.authReducer.isAuthenticated,
    similarGroups : state.similarProcessesReducer.similarGroups,
    listSimilar : state.similarProcessesReducer.listSimilar,
})

const mapDispatchToProps = {
    createMessage,
    getSimilarGroups,
    getGroupProcesses
}


export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(GroupProcessPage));