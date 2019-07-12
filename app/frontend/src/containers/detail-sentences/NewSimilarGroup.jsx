import React, { Component, Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
   } from '@material-ui/core';
import { connect } from 'react-redux'
import { useTheme } from '@material-ui/core/styles';
import {addSimilarProcessesToGroup, openGroupDialog} from '../../actions/similarprocesses';
import CreatableSelect from 'react-select/creatable';
import { dialogComponents, useStyles } from '../../components/SelectComponents';

const NewSimilarGroup = props => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const {similarProcesses, similarGroups, addSimilarProcessesToGroup,onOpen,onClose, hideButton} = props
    
    const toSelectSuggestions = similarGroups.map(suggestion => ({
        value: suggestion.id,
        label: suggestion.descricao,
        data: suggestion
    }));
    const [selectedGroups, setSelectedGroups] = useState([]);
   
    const handleSelectChange = (newValue) => {
        setSelectedGroups(newValue)
    };
      
    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        if (hideButton) props.openGroupDialog()
        setSelectedGroups([]);
    }

    const handleSubmitToSimilarGroup = (e) =>{
        addSimilarProcessesToGroup(similarProcesses,selectedGroups)
        handleClose()
    }


    const selectStyles = {
        input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
            font: 'inherit',
        },
        }),
    };
      
    return (
        <Fragment>
            {
                props.hideButton ? undefined :

                <Button variant="outlined" style={{display:'flex', flexGrow:1}} color="primary" 
                    disabled={similarProcesses.processo_base_tj === undefined} 
                    onClick={handleClickOpen}
                >
                    Adicionar em Grupo
                </Button>
            }
            {
                similarProcesses.processo_base_tj !== undefined || similarProcesses[0] !== undefined ?
                <Dialog open={hideButton? props.openDialog : open} onClose={handleClose} className={classes.dialog} aria-labelledby="form-dialog-title">
                    <DialogTitle variant='caption'>Salvar em Grupo Similar</DialogTitle>
                    <DialogContent className={classes.dialog} >
                        <DialogContentText >
                            Adicione os processos similares em um Grupo Similar.
                        </DialogContentText>
                        <CreatableSelect
                            isMulti
                            placeholder='Crie ou selecione...'
                            TextFieldProps={{
                              label: 'Grupos de Processos Similares',
                              variant: 'outlined',
                              InputLabelProps: {
                                htmlFor: 'react-select-single',
                                shrink: true,
                              }
                            }}
                            onChange={handleSelectChange}
                            options={toSelectSuggestions}
                            classes={classes}
                            styles={selectStyles}
                            components={dialogComponents}
                            value={selectedGroups}
                            formatCreateLabel={function(inputValue) {
                                return 'Criar grupo "'.concat(inputValue, '"');
                              }}
                            noOptionsMessage={function() {
                              return 'Digite o nome de um novo grupo e clique "enter"';
							}}
                        />
                    </DialogContent>
                    <DialogActions >
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmitToSimilarGroup} disabled={selectedGroups!==null ? selectedGroups.length === 0 : true } color="primary">
                        Enviar
                    </Button>
                    </DialogActions>
                </Dialog> : undefined
            }
        </Fragment>
    )

}

const mapStateToProps = (state) => ({
    similarGroups : state.similarProcessesReducer.similarGroups,
    openDialog : state.similarProcessesReducer.openGroupDialog
})

const mapDispatchToProps = {
    addSimilarProcessesToGroup,
    openGroupDialog
}

export default connect(mapStateToProps, mapDispatchToProps)(NewSimilarGroup)
