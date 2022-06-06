import React, { useState } from "react";
// so hear we pass history as prop that the reason when we click on search button we get history in blurr one.
// so when we submit the search button with history object we are pushing the browser url with search word that happens with searchHandler on shubmit.
// to change the value of keyword / to appear the text on the input field we are typing and changing with onChange handler so what ever value we typed it should
// come in search field.
const Search = ({ history }) => {
  const [keyword, setKeyword] = useState("");
  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/search/${keyword}`);
    } else {
      history.push("/");
    }
  };
  return (
    <form onSubmit={searchHandler}>
      <div className="input-group">
        <input
          type="text"
          id="search_field"
          className="form-control"
          placeholder="Enter Product Name ..."
          onChange={(e) => setKeyword(e.target.value)}
        />
        <div className="input-group-append">
          <button id="search_btn" className="btn">
            <i className="fa fa-search" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </form>
  );
};

export default Search;
