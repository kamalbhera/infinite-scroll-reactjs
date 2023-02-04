import { useState, useRef, useCallback } from "react";
import "./App.css";

import useSearch from "./hooks/useSearch";

function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const handleSearch = (event) => {
    setPage(1);
    setQuery(event.target.value);
  };

  const { data, hasMore, loading, error } = useSearch(query, page);

  const observer = useRef();
  const lastDataElemRef = useCallback(
    (node) => {
      // console.log(node);
      if (loading) {
        return;
      }
      if (observer.current) {
        observer.current.disconnect(); // unobserve?
      }
      // disconnect(): void;
      // observe(target: Element): void;
      // takeRecords(): IntersectionObserverEntry[];
      // unobserve(target: Element): void;
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("LAST ELEM IS VISIBLE");
          setPage((page) => page + 1);
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore]
  );

  return (
    <div className="App">
      {/* <label htmlFor="searchBox"> Search </label> */}
      <input
        id="searchBox"
        type="text"
        value={query}
        onChange={(event) => handleSearch(event)}
      />
      <div className="container">
        {data.map((elem, index) => {
          if (data.length - 1 === index) {
            // last elem
            return (
              <div ref={lastDataElemRef} key={index}>
                <span>{elem.title}</span>
                <span>{elem.author}</span>
              </div>
            );
          } else {
            // other elems
            return (
              <div key={index} className="bookCard">
                <span>{elem.title}</span>
                <span>{elem.author}</span>
              </div>
            );
          }
        })}
      </div>

      {/* <div>{loading && "Loading ..."}</div>
      <div>{error && "An unexpected server error occured"}</div> */}
      {loading ? <div>{loading && "Loading ..."}</div> : null}
      {error ? (
        <div>{error && "An unexpected server error occured"}</div>
      ) : null}
    </div>
  );
}

export default App;
