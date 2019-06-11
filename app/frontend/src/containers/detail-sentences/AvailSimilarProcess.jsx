import React, { Fragment, useState } from 'react'
import {Typography,Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box} from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';
import { connect } from 'react-redux'
import {submitRating} from '../../actions/similarprocesses'
const AvailSimilarProcess = props => {
    
    const [open, setOpen] = useState(false);
    const [inicial, setInicial] = useState(5);
    const [contestacao, setContestacao] = useState(5);
    const [sentenca, setSentenca] = useState(5);
    const [comment, setComment] = useState('')
    const {searchedProcess, similarProcess} = props
    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    const handleSetInicial = (e, value) => {
        setInicial(value);
    };
    const handleSetContestacao = (e, value) => {
        setContestacao(value);
    };
    const handleSetSentenca = (e, value) => {
        setSentenca(value);
    };
    const handleSetComment = (e) => {
        setComment(e.target.value);
    };

    const handleSubmitRating = (e) =>{
        const {submitRating} = props
        const similar = searchedProcess.processos_similares.filter(similar =>{
            return similar.processo_similar_tj === similarProcess.processo_tj
        })[0]
        submitRating(similar, inicial, contestacao, sentenca, comment)
        handleClose()
    }

    
    return (
        <Fragment>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Avaliar Similaridade
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle variant='caption'>Avaliar Taxa de Similaridade</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Deixe a sua opinião com relação a similaridade entre os processos {searchedProcess.processo_tj} e {similarProcess.processo_tj}
                </DialogContentText>
                <Box mb={1.5}>
                    <Typography variant='caption' style={{padding: '5px 0px',}}>De 0 a 10, o quanto considera a similaridade adequada para o documento da Petição Inicial? {inicial}</Typography>
                    <Slider 
                        value={inicial}
                        min={0}
                        max={10}
                        step={1}
                        onChange={handleSetInicial}
                    />
                </Box>
                <Box mb={1.5}>
                <Typography variant='caption' style={{padding: '5px 0px',}}>De 0 a 10, o quanto considera a similaridade adequada para o documento da Contestação? {contestacao}</Typography>
                <Slider 
                    value={contestacao}
                    min={0}
                    max={10}
                    step={1}
                    onChange={handleSetContestacao}
                    mb={1.5}
                />
                </Box>
                <Box mb={1.5}>
                <Typography variant='caption' style={{padding: '5px 0px',}}>De 0 a 10, o quanto considera a similaridade adequada para os textos das sentenças? {sentenca}</Typography>
                <Slider 
                    value={sentenca}
                    min={0}
                    max={10}
                    step={1}
                    onChange={handleSetSentenca}
                    mb={1.5}
                />
                </Box>
                <Box mb={1.5}>
                <Typography variant='caption'>Comentários</Typography>
                <TextField
                    value={comment}
                    onChange={handleSetComment}
                    autoFocus
                    variant="outlined"
                    multiline
                    rowsMax="4"
                    fullWidth
                />
                </Box>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleSubmitRating} color="primary">
                    Enviar
                </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )

}

const mapStateToProps = (state) => ({
    token : state.authReducer.token,
    isAuthenticated: state.authReducer.isAuthenticated,
    searchedProcess : state.similarProcessesReducer.searchedProcess,
    similarProcess : state.similarProcessesReducer.similarProcess,
})

const mapDispatchToProps = {
    submitRating
}

export default connect(mapStateToProps, mapDispatchToProps)(AvailSimilarProcess)