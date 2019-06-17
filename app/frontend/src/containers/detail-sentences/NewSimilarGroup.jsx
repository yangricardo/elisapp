import React, { Component, Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx';
import {MenuItem,Paper ,Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Typography, TextField,Chip} from '@material-ui/core';

import { connect } from 'react-redux'
import { emphasize, makeStyles, useTheme } from '@material-ui/core/styles';
import {addSimilarProcessesToGroup} from '../../actions/similarprocesses';
import CreatableSelect from 'react-select/creatable';
import { Cancel } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    root: {
      zIndex:0,
      overflow:'visible'
    },
    input: {
      display: 'flex',
      padding: 0,
      height: 'auto',
    },
    valueContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flex: 1,
      alignItems: 'center',
      overflow: 'hidden',
    },
    chip: {
      margin: theme.spacing(0.5, 0.25),
    },
    chipFocused: {
      backgroundColor: emphasize(
        theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
        0.08,
      ),
    },
    noOptionsMessage: {
      padding: theme.spacing(1, 2),
    },
    singleValue: {
      fontSize: 16,
    },
    placeholder: {
      position: 'absolute',
      left: 2,
      bottom: 6,
      fontSize: 16,
    },
    paper: {
        zIndex: 1,
        maxHeight:300,
        overflow:'visible',
        overflowY:'auto',
        marginTop: theme.spacing(1),
        left:0, right: 0
    },
    divider: {
      height: theme.spacing(2),
    },
  }));
  
  function NoOptionsMessage(props) {
    return (
      <Typography
        color="textSecondary"
        className={props.selectProps.classes.noOptionsMessage}
        {...props.innerProps}
      >
        {props.children}
      </Typography>
    );
  }
  
  NoOptionsMessage.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    selectProps: PropTypes.object.isRequired,
  };
  
  function inputComponent({ inputRef, ...props }) {
    return <div ref={inputRef} {...props} />;
  }
  
  inputComponent.propTypes = {
    inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  };
  
  function Control(props) {
    const {
      children,
      innerProps,
      innerRef,
      selectProps: { classes, TextFieldProps },
    } = props;
  
    return (
      <TextField
        fullWidth
        InputProps={{
          inputComponent,
          inputProps: {
            className: classes.input,
            ref: innerRef,
            children,
            ...innerProps,
          },
        }}
        {...TextFieldProps}
      />
    );
  }
  
  Control.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    selectProps: PropTypes.object.isRequired,
  };
  
  function Option(props) {
    return (
      <MenuItem
        ref={props.innerRef}
        selected={props.isFocused}
        component="div"
        style={{
          fontWeight: props.isSelected ? 500 : 400,
        }}
        {...props.innerProps}
      >
        {props.children}
      </MenuItem>
    );
  }
  
  Option.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    isFocused: PropTypes.bool,
    isSelected: PropTypes.bool,
  };
  
  function Placeholder(props) {
    return (
      <Typography
        color="textSecondary"
        className={props.selectProps.classes.placeholder}
        {...props.innerProps}
      >
        {props.children}
      </Typography>
    );
  }
  
  Placeholder.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    selectProps: PropTypes.object.isRequired,
  };
  
  function SingleValue(props) {
    return (
      <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
        {props.children}
      </Typography>
    );
  }
  
  SingleValue.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    selectProps: PropTypes.object.isRequired,
  };
  
  function ValueContainer(props) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
  }
  
  ValueContainer.propTypes = {
    children: PropTypes.node,
    selectProps: PropTypes.object.isRequired,
  };
  
  function MultiValue(props) {
    return (
      <Chip
        tabIndex={-1}
        label={props.children}
        className={clsx(props.selectProps.classes.chip, {
          [props.selectProps.classes.chipFocused]: props.isFocused,
        })}
        onDelete={props.removeProps.onClick}
        deleteIcon={<Cancel {...props.removeProps} />}
      />
    );
  }
  
  MultiValue.propTypes = {
    children: PropTypes.node,
    isFocused: PropTypes.bool,
    removeProps: PropTypes.object.isRequired,
    selectProps: PropTypes.object.isRequired,
  };
  
  function Menu(props) {
    return (
      <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
        {props.children}
      </Paper>
    );
  }
  
  Menu.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    selectProps: PropTypes.object,
  };
  const components = {
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    ValueContainer,
  };
  


const NewSimilarGroup = props => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const {similarProcesses, similarGroups, addSimilarProcessesToGroup} = props
    
    const toSelectSuggestions = similarGroups.map(suggestion => ({
        value: suggestion,
        label: suggestion.descricao,
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
                Salvar em Grupo sob Análise
            </Button>
            {
                similarProcesses.processo_base_tj !== undefined ?
                <Dialog open={open} onClose={handleClose} className={classes.root} aria-labelledby="form-dialog-title">
                    <DialogTitle variant='caption'>Salvar em Grupo sob Análise</DialogTitle>
                    <DialogContent className={classes.root}>
                        <DialogContentText >
                            Adicione os processos similares {similarProcesses.processo_base_tj} e {similarProcesses.processo_similar_tj} em um Grupo sob Análise.
                        </DialogContentText>
                        <CreatableSelect
                            isMulti
                            placeholder='Crie ou selecione...'
                            onChange={handleSelectChange}
                            options={toSelectSuggestions}
                            classes={classes}
                            styles={selectStyles}
                            components={components}
                            value={selectedGroups}
                            formatCreateLabel={function(inputValue) {
                                return 'Criar grupo "'.concat(inputValue, '"');
                              }}
                        />
                    </DialogContent>
                    <DialogActions className={classes.root}>
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
    similarGroups : state.similarProcessesReducer.similarGroups
})

const mapDispatchToProps = {
    addSimilarProcessesToGroup
}

export default connect(mapStateToProps, mapDispatchToProps)(NewSimilarGroup)
