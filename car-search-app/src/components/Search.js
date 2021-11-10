import { useState } from "react";
import "./Search.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";
import turners from "../assets/Turners-Logo.gif";
function Search() {
  const [searchString, setSearchString] = useState("");
  const [displayedFormattedSearchString, setDisplayedFormattedSearchString] =
    useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault(); // fixes the submit refresh issue
    // Function that makes a dirty input string neat.
    const makeStringNeat = (string) => {
      let temp = string.replace(/[!,?,\-,;,%]/g, " ");
      let formattedString = temp.replace(/\s+/g, " ").trim();
      return formattedString;
    };
    const formattedString = makeStringNeat(searchString);
    setDisplayedFormattedSearchString(`You searched for: "${formattedString}"`);

    // This function adds a css class that displays the border around the search results
    function addClass() {
      document
        .getElementById("search-results")
        .classList.add("search-results-border");
    }
    addClass();

    // The Axios module which posts the users string to the backend before receiving a response
    axios
      .post("http://localhost:4000/search", {
        searchString: formattedString,
      })
      .then((response) => {
        if (response.status === 200) {
          setSearchString("");
          const rawData = response.data.result; // an array
          const rawDataFinal = response.data.result.results; // an array
          setSearchResults(rawDataFinal);
          rawData.matching_results
            ? setNoResults("")
            : setNoResults("no results buddy");
        }
      })
      .catch(() => {
        setSearchString("");
      });
  };

  // console.log(searchResults);
  return (
    <div className="App">
      <img className="logo" src={turners} alt="logo" />
      <form onSubmit={handleSubmit}>
        <div className="search-box">
          <TextField
            variant="outlined"
            size="small"
            type="text"
            placeholder="Search me"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
          <div className="btn">
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </div>
        </div>
      </form>
      <div>
        <div className="search-results-container">
          <div id="search-results">
            <div className="search-query">{displayedFormattedSearchString}</div>

            {noResults}
            {searchResults.map((result, i) => (
              <div key={i}>
                <h2 className="results-title"> {result.question}</h2>
                <p className="results-text">{result.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
