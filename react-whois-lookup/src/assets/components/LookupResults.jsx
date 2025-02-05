import { useEffect, useState } from "react";

// **************************************************************************
// LookupResults
// **************************************************************************
function LookupResults({ domain }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [loggedOn, setLoggedOn] = useState(false);
  const [apiKey, setApiKey] = useState(null);

  // **************************************************************************
  // getApiKey
  // **************************************************************************
  function getApiKey() {
    let isLoggedOn = false;
    let ApiLayerApiKey = null;

    setApiKey(ApiLayerApiKey);
    setLoggedOn(isLoggedOn);

    // Check Local Storage
    ApiLayerApiKey = localStorage.getItem("ApiLayarApiKey");
    // console.log(`ApiLayerApiKey from Local Storage = ${ApiLayerApiKey}`);

    // If not there, check .env
    if (!ApiLayerApiKey || ApiLayerApiKey === null) {
      ApiLayerApiKey = import.meta.env.VITE_APILAYER_API_KEY;
      //   console.log(`ApiLayerApiKey from .env = ${ApiLayerApiKey}`);
    }

    // If not there, get from user
    if (!ApiLayerApiKey || ApiLayerApiKey === null) {
      const userApi = prompt(
        "You must provide a valid API key to use this feature."
      );
      if (userApi && userApi.length > 0) {
        ApiLayerApiKey = userApi;
        // console.log(`ApiLayerApiKey from user = ${ApiLayerApiKey}`);
      }
    }

    // If not there, set notLoggedIn, otherwise, set loggedIn
    if (!ApiLayerApiKey || ApiLayerApiKey === null) {
      isLoggedOn = false;
      setLoggedOn(isLoggedOn);
    } else {
      localStorage.setItem("ApiLayerApiKey", ApiLayerApiKey);
      setApiKey(ApiLayerApiKey);
      isLoggedOn = true;
      setLoggedOn(isLoggedOn);
    }

    return ApiLayerApiKey;
  }

  // **************************************************************************
  // stripUrl
  // **************************************************************************
  function stripUrl(domain = "dummy", subdomain = false) {
    let url = domain;
    let strippedUrl = url.replace(/(^\w+:|^)\/\/|\/.*$/g, "");
    if (subdomain) {
      strippedUrl = strippedUrl.replace("www.", "");
    }

    return strippedUrl;
  }

  // **************************************************************************
  // fetchApiData
  // **************************************************************************
  function fetchApiData(apiKey, strippedUrl) {
    // Set up headers
    let myHeaders = new Headers();
    myHeaders.append("apikey", apiKey);
    let requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: myHeaders,
    };

    // Fetch data from the API
    setLoading(true);
    setError(false);
    setData(null);
    fetch(
      `https://api.apilayer.com/whois/query?domain=${strippedUrl}`,
      requestOptions
    )
      .then((response) => {
        return response.json().then((data) => {
          if (!response.ok) {
            const error = new Error(`HTTP error! status: ${response.status}`);
            error.data = data;
            error.status = response.status;
            throw error;
          }
          return data;
        });
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setData(error.data || null); // Still set the data if available
        setLoading(false);
        setError(true);
        if (error.status === 401) {
          setApiKey(null);
          setLoggedOn(false);
        }
      });
  }

  // **************************************************************************
  // END OF FUNCTIONS
  // **************************************************************************

  // **************************************************************************
  // *** MAIN *** MAIN *** MAIN *** MAIN *** MAIN *** MAIN *** MAIN *** MAIN **
  // **************************************************************************

  useEffect(() => {
    // Get the API Key
    if (!loggedOn) {
      setApiKey(getApiKey());
    } else {
      // Only run the functions if we actually have a domain
      if (domain === null || domain === undefined || domain.length <= 0) {
        // Do nothing and carry on
      } else {
        // Get the domain
        const subdomain = true;
        const strippedUrl = stripUrl(domain, subdomain);
        // Get the data
        fetchApiData(apiKey, strippedUrl);
      }
    }
  }, [domain, apiKey, loggedOn]);

  // **************************************************************************
  // Conditional Returns
  // **************************************************************************

  if (!loggedOn) {
    return (
      <>
        <div className="lookup-results">
          <h2>No API key found</h2>
          <p>You must provide a valid API key to use this feature.</p>
          <br />
        </div>
      </>
    );
  }

  if (domain === null || domain === undefined || domain.length <= 0) {
    return (
      <>
        <div className="lookup-results">
          <h3>Which TLDs are supported?</h3>
          <p>
            TLDs currently supported are as follows: .com .me .net .org .sh .io
            .co .club .biz .mobi .info .us .domains .cloud .fr .au .ru .uk .nl
            .fi .br .hr .ee .ca .sk .se .no .cz .it .in .icu .top .xyz .cn .cf
            .hk .sg .pt .site .kz .si .ae .do .yoga .xxx .ws .work .wiki .watch
            .wtf .world .website .vip .ly .dev .network .company .page .rs .run
            .science .sex .shop .solutions .so .studio .style .tech .travel .vc
            .pub .pro .app .press .ooo .de
          </p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="lookup-results">
          <h2>Error</h2>
          <p>
            There was an error fetching the data for <strong>{domain}</strong>
            <br />
            Please try again later.
          </p>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <div className="lookup-results">
          <h2>Waiting...</h2>
          <p>Please be patient</p>
        </div>
      </>
    );
  }

  // **************************************************************************
  // Final return...
  // **************************************************************************
  return (
    <div className="lookup-results">
      <h2>Results</h2>
      <p>
        Results for <strong>{domain}</strong>
      </p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <br />
      <br />
      <br />
    </div>
  );
}

export default LookupResults;
