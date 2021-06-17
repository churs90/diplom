import React, { useState } from 'react';
import './../styles/components/Search.scss';

let Search = (props) => {
    const [searchText, setSearchText] = useState("");

    let onChangeSearchText = (e) => {
        setSearchText(e.target.value);
    }

let searchClick = () => {
        props.filterUsers(searchText);
    }

  return (
      <header className="App-header">
          <input placeholder={"Search"} type="text" onChange={onChangeSearchText} value={searchText}/>
          <button onClick={searchClick}>Найти</button>
      </header>
  );
}

export default Search;
