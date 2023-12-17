import React from 'react';
import ReactDOM from 'react-dom/client';

import { createStore, combineReducers  } from 'redux'
import { connect, Provider } from 'react-redux'
import { login } from './login/main'

function Main(myProperties){
    let myStore = createStore(
            (state = myProperties,action)=>{
                switch (action.type){
                    case "PILIH_DETAIL":
                        return {...state, index : action.index}
                        break;
                    case "INPUT_SEARCH_VALUE":
                        return {...state, searchValue : action.searchValue}
                        break;
                    default:
                        return {...state}
                        break;
                        
                }
            }
        );
	let root = ReactDOM.createRoot(document.list.getElementsByTagName("login")[0]);
	root.render(<Provider store={myStore}>
        <login/>
    </Provider>);
}
export default Main;