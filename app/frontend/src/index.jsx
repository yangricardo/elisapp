import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Routes from './routes.js';
import store from './store.js';
import { SnackbarProvider } from 'notistack'
import { loadUser } from './actions/auth.js';


export default class App extends Component {

  componentDidMount(){
    store.dispatch(loadUser())
  }

  render() {
    return (
      <Provider store={ store }>
        <SnackbarProvider>
          <Routes/>
        </SnackbarProvider>
      </Provider>
    )
  }
}


ReactDOM.render((
  <App/>
), document.getElementById('react-app'));