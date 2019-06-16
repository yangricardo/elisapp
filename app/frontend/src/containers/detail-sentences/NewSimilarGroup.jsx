import React, { Component, Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import {Typography,Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box} from '@material-ui/core';
import Select from 'react-select'
import { connect } from 'react-redux'

const NewSimilarGroup = props => {
    
    const [open, setOpen] = useState(false);
    const {similarProcesses} = props

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    const handleSubmitToSimilarGroup = (e) =>{
        handleClose()
    }
    return (
        <Fragment>
            <Button variant="outlined" color="primary" disabled={similarProcesses.processo_base_tj === undefined} onClick={handleClickOpen}>
                Salvar para Análise
            </Button>
            {
                similarProcesses.processo_base_tj !== undefined ?
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle variant='caption'>Salvar para Análise</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Adicione os processos similares {similarProcesses.processo_base_tj} e {similarProcesses.processo_similar_tj} em grupo para análise posterior
                    </DialogContentText>
                        <Select>
                            
                        </Select>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmitToSimilarGroup} color="primary">
                        Enviar
                    </Button>
                    </DialogActions>
                </Dialog> : undefined
            }
        </Fragment>
    )

}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(NewSimilarGroup)
