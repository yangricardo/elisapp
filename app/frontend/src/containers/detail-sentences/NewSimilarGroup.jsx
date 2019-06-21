import React, { Component, Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
   } from '@material-ui/core';

import { connect } from 'react-redux'
import { useTheme } from '@material-ui/core/styles';
import {addSimilarProcessesToGroup} from '../../actions/similarprocesses';
import CreatableSelect from 'react-select/creatable';
import { dialogComponents, useStyles } from '../../components/SelectComponents';
import { Add } from '@material-ui/icons';

const NewSimilarGroup = props => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const {similarProcesses, similarGroups, addSimilarProcessesToGroup} = props
    
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
            <Button variant="outlined" color="primary" disabled={similarProcesses.processo_base_tj === undefined} onClick={handleClickOpen}>
                <Add style={{marginRight:theme.spacing(1)}}/> Grupo Similar
            </Button>
            {
                similarProcesses.processo_base_tj !== undefined ?
                <Dialog open={open} onClose={handleClose} className={classes.dialog} aria-labelledby="form-dialog-title">
                    <DialogTitle variant='caption'>Salvar em Grupo Similar</DialogTitle>
                    <DialogContent className={classes.dialog} >
                        <DialogContentText >
                            Adicione os processos similares {similarProcesses.processo_base_tj} e {similarProcesses.processo_similar_tj} em um Grupo Similar.
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
                    <Button onClick={handleSubmitToSimilarGroup} disabled={selectedGroups[0] !== undefined || selectedGroups[0] !== null ? false : true} color="primary">
                        Enviar
                    </Button>
                    </DialogActions>
                </Dialog> : undefined
            }
        </Fragment>
    )

}

const mapStateToProps = (state) => ({
    similarGroups : state.similarProcessesReducer.similarGroups
})

const mapDispatchToProps = {
    addSimilarProcessesToGroup
}

export default connect(mapStateToProps, mapDispatchToProps)(NewSimilarGroup)
