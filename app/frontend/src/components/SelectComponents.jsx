import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx';
import {MenuItem,Paper,Typography, TextField,Chip} from '@material-ui/core';
import Select from 'react-select';
import { emphasize, makeStyles, useTheme } from '@material-ui/core/styles';
import { Cancel } from '@material-ui/icons';

export const useStyles = makeStyles(theme => ({
    root: {
        zIndex:0,
    },
    dialog: {
        zIndex:0,
        display:'flex',
        flex:1,
        flexGrow:1,
        flexDirection:'column',
        flexWrap: 'wrap',
        height: 'auto',
    },
    input: {
        display: 'flex',
        padding: 10,
        zIndex:0,
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
        fontSize: 16,
    },
    dialogPaper: {
        zIndex: 0,
        maxHeight:300,
        position: 'absolute',
        overflowY:'auto',
        marginTop: theme.spacing(1),
        left:0, right: 0
    },
    paper: {
        zIndex: 1000,
        maxHeight:300,
        position: 'absolute',
        overflow:'visible',
        overflowY:'auto',
        marginTop: theme.spacing(1),
        left:0, right: 0
    },
    divider: {
    height: theme.spacing(2),
    },
}));

export function NoOptionsMessage(props) {
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

export function inputComponent({ inputRef, ...props }) {
    return <div ref={inputRef} {...props} />;
}

inputComponent.propTypes = {
    inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

export function Control(props) {
    const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, TextFieldProps },
    } = props;

    return (
    <TextField
        fullWidth
        variant='outlined'
        type="search"
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

export function Option(props) {
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

export function Placeholder(props) {
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

export function SingleValue(props) {
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

export function ValueContainer(props) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

ValueContainer.propTypes = {
    children: PropTypes.node,
    selectProps: PropTypes.object.isRequired,
};

export function MultiValue(props) {
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

export function Menu(props) {
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


export function DialogMenu(props) {
    return (
    <Paper square className={props.selectProps.classes.dialogPaper} {...props.innerProps}>
        {props.children}
    </Paper>
    );
}

DialogMenu.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    selectProps: PropTypes.object,
};

export const dialogComponents = {
    Control,
    DialogMenu,
    SingleValue,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    ValueContainer,
};

export const components = {
    Control,
    Menu,
    SingleValue,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    ValueContainer,
};

export const FilterSelect = (props) => {
    const classes = useStyles();
    const theme = useTheme();

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
        <Select
            TextFieldProps={{
                label: props.label,
                variant: 'outlined',
                InputLabelProps: {
                htmlFor: props.htmlFor,
                shrink: true,
                }
            }}
            isClearable
            onChange={props.onChange}
            onInputChange={props.onInputChange}
            options={props.options}
            classes={classes}
            styles={selectStyles}
            components={components}
            value={props.value}  
            noOptionsMessage={function() {
                return 'Obtendo sugestões de acordo com as buscas ou opções inexistentes...';
              }}
        />
    )
}
FilterSelect.propTypes = {
    label : PropTypes.string,
    htmlFor : PropTypes.string,
    onChange : PropTypes.func,
    onInputChange : PropTypes.func,
    options : PropTypes.array,
    value : PropTypes.object,
};