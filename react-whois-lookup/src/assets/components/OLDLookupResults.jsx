import React, { useEffect, useState } from "react";

const LookupResults = ({ domain }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  function getApiKey() {
    // Check Local Storage
    let ApiLayerApiKey = localStorage.getItem("ApiLayerApiKey");

    // If not there, check .env
    if (ApiLayerApiKey === null) {
      ApiLayerApiKey = import.meta.env.VITE_APILAYER_API_KEY;
      console.log(`.env = ${ApiLayerApiKey}`);
    }
    if (!ApiLayerApiKey) {
      console.log("a ask user for Key");
    }

    if (ApiLayerApiKey === null) {
      console.log("b ask user for Key");
    }

    if (ApiLayerApiKey != null) {
      //   localStorage.setItem("ApiLayerApiKey", JSON.stringify(ApiLayerApiKey));
      localStorage.setItem("ApiLayerApiKey", ApiLayerApiKey);
    } else {
      console.log("ask user for Keyn");
    }

    return ApiLayerApiKey;
  }

  function stripUrl(domain = "lklkl", subdomain = false) {
    let url = domain;
    console.log(`url = ${url}`);
    let strippedUrl = url.replace(/(^\w+:|^)\/\//, "");
    if (subdomain) {
      strippedUrl = strippedUrl.replace("www.", "");
    }
    console.log(`old = ${domain} new = ${strippedUrl}`);

    return strippedUrl;
  }

  function FetchApiData(apiKey, strippedUrl) {
    // useEffect(() => {
    //   let apiData = "";
    let myHeaders = new Headers();
    myHeaders.append("apikey", apiKey);
    let requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: myHeaders,
    };

    fetch(`${apiUrl}${strippedUrl}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setData(result);
        setLoading(false);
        console.log(result);
        // apiData = result;
      })
      .catch((error) => {
        console.log("error", error);
        setLoading(false);
        // apiData = error;
      });

    // return;
  }

  //MAIN -------------------
  if (domain === null || domain === undefined || domain.length <= 0) {
    return null;
  }

  const apiUrl = "https://api.apilayer.com/whois/query?domain=";
  // const apiKey = import.meta.env.VITE_APILAYER_API_KEY;

  // Get the API Key
  const apiKey = getApiKey();

  // Have we got a key?
  if (!apiKey || apiKey.length <= 0) {
    return (
      <>
        <h2>Missing API Key</h2>
        Get one at <a href="https://apilayer.com/"> apilayer </a>
      </>
    );
  }
  console.log(`apiKey = ${apiKey}`);

  // Format the domain
  const strippedUrl = stripUrl(domain);
  if (!strippedUrl || strippedUrl.length <= 0 || !strippedUrl.includes(".")) {
    return (
      <>
        <h2>Bad domain</h2>
        <p>{domain}</p>
      </>
    );
  }

  // If we get here, we can do the fetch

  useEffect(() => {
    let apiData = FetchApiData(apiKey, strippedUrl);
  }, [apiKey, strippedUrl]);

  if (loading) {
    return <p>Waiting...</p>;
  }

  return (
    <div>
      <h1>API Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
//   if (apiData && apiData.length > 0) {
//     return (
//       <>
//         <div id="lookup-results" className="lookup-results">
//           <h2>Results</h2>
//           <p>Results for {domain}</p>
//           <p>{apiData}</p>
//         </div>
//       </>
//     );
//   }

//   return (
//     <div id="lookup-results" className="lookup-results">
//       <h2>Results</h2>

//       <p>Results for {domain}</p>
//       {/* <p>Results for {strippedUrl}</p> */}
//       <p>{apiData}</p>
//       <br />
//     </div>
//   );
// };

//   let apiResults = "waiting";
//   if (domain.length > 0) {
//     console.log(`domain = ${domain}`);

//     console.log(`strippedUrl = ${strippedUrl}`);
export default LookupResults;
