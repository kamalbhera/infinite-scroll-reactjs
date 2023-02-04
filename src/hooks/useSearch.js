import { useState, useEffect } from "react";
import axios from "axios";

const useSearch = (query, page) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setData([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel; // for storing function to cancel axios request

    const options = {
      method: "GET",
      url: "http://openlibrary.org/search.json",
      params: { q: query, page: page },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    };
    (async () => {
      try {
        const fetchedLibraryData = await axios(options);
        console.log(fetchedLibraryData);
        // setData((prevData) => [
        //   ...prevData,
        //   ...fetchedLibraryData.data.docs.map((elem) => elem.title),
        // ]);

        // concatenating array of book titles with previous
        // setData((prevData) => [
        //   ...new Set([
        //     ...prevData,
        //     ...fetchedLibraryData.data.docs.map((elem) => elem.title),
        //   ]),
        // ]);
        const dataArr = [];

        if (fetchedLibraryData.data.docs) {
          fetchedLibraryData.data.docs.forEach((elem) =>
            dataArr.push({
              title: elem.title,
              author: elem.author_name,
            })
          );
        }

        setData((prevData) => [...prevData, ...dataArr]);
        setHasMore(fetchedLibraryData.data.docs.length > 0); // ? suspect
        setLoading(false);
      } catch (err) {
        if (axios.isCancel(err)) {
          return;
        } else {
          setError(true);
          console.log(err);
        }
      }
    })();

    return () => cancel();
  }, [query, page]);

  return { data, hasMore, loading, error };
};

export default useSearch;
