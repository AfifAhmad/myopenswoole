import Information from  "./pelayanan/info";

import React from 'react';
import ReactDOM from 'react-dom/client';

import { createStore, combineReducers  } from 'redux'
import { connect  } from 'react-redux'

import { Provider } from 'react-redux'


let myStore = createStore(
        (state = {},action)=>{
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
function HighLighting(oldText, searchText)  {
	const regex = new RegExp(searchText, 'gi');
	let text = oldText;
	text = text.replace(/(<mark class="highlight">|<\/mark>)/gim, '');
	const newText = text.replace(regex, '<mark class="highlight">$&</mark>');
	return newText;
}
function Item (props){
	let currentIndex = props.mainIndex;
	let search = props.searchValue;
	let persyaratanJsx = [];
	let sistemMekanismeJsx = [];
	for (var i=0; i < props.item.persyaratan.length; i++) {
		persyaratanJsx.push(<li key={i}>{props.item.persyaratan[i]}</li>)
	}	
	for (var i=0; i < props.item.sistem_mekanisme.length; i++) {
		sistemMekanismeJsx.push(<li key={i}>{props.item.sistem_mekanisme[i]}</li>)
	}	
	let jenisLayanan = props.item.jenis_layanan;
	let isDisplayed = true;
	if(search && search.length > 1){
		isDisplayed = props.item.jenis_layanan.toLowerCase().includes(search.toLowerCase());
		if(isDisplayed){
			jenisLayanan = HighLighting(props.item.jenis_layanan, search);
		}
	}
	return ( isDisplayed ?
		<div className="layanan-list">
			<div dangerouslySetInnerHTML={{__html: jenisLayanan}}
				onClick={()=>{
					let newIndex = null;
					if((!currentIndex&&currentIndex!==0)|| currentIndex!==props.index){
						newIndex = props.index
					}
					props.pilihDetail(newIndex);
				}}
				style={
					{
						cursor : "pointer"
					}
				}
			></div>
			<div className="keterangan" style={
				{
					display : (currentIndex === props.index) ? "block" : "none"
				}
			}>
				<div>
					<div>
						<b>Dasar Hukum</b>
						<br/>
						{props.item.dasar_hukum}
					</div>
					<div>
						<b>Persayaratan</b>
						<br/>
						<ul>{persyaratanJsx}</ul>
					</div>
					<div>
						<b>Sistem Mekanisme</b>
						<br/>
						<ul>{sistemMekanismeJsx}</ul>
					</div>
					<div>
						<b>Jangka Waktu</b>
						<br/>
						{props.item.jangka_waktu}
					</div>
					<div>
						<b>Produk Pelayanan</b>
						<br/>
						{props.item.produk_pelayanan}
					</div>
					<div>
						<b>Biaya</b>
						<br/>
						<b>Tidak Dipungut Biaya</b>
					</div>
				</div>
			</div>
		</div> : null
	);
}
const mapStateToProps = (state) => {
  return {
    mainIndex: state.index,
    searchValue: state.searchValue
  };
};

const mapDispatchToPropsDetail = {
    pilihDetail : (val)=>{
        return {
            index : val,
            type : "PILIH_DETAIL"
        }
        
    }
};

var ItemReact = connect(mapStateToProps, mapDispatchToPropsDetail)(Item);

function Container(props){
    React.Component.call(this, props);
    this.render = function(){
        let rows = [];
        for (var i=0; i < Information.length; i++) {
            rows.push(<ItemReact item={Information[i]} index={i} key={i}/>);
        }	
        return <React.Fragment>
                <div><input 
                onInput={
                    (e)=>{
                        this.props.inputSearchValue(e.target.value);
                    }
                }
                placeholder="Cari Pelayanan" className="form-control" type="text"/></div>
                <div>{rows}</div>
            </React.Fragment>
       
    
    }
}
Container.prototype = Object.create(React.Component.prototype);
const mapDispatchToProps = {
    inputSearchValue : (val)=>{
        return {
            searchValue : val,
            type : "INPUT_SEARCH_VALUE"
        }
        
    }
};

var ContainerReact = connect(null, mapDispatchToProps)(Container);


function MainReact(){
    return (<Provider store={myStore}>
        <ContainerReact/>
    </Provider> )
}

function Main(){
	let root = ReactDOM.createRoot(document.getElementById("section-news").children[0]);
	root.render(<MainReact />);
}
export default Main;