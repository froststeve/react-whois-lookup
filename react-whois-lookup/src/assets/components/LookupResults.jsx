import React, { useEffect, useState } from "react";

// **************************************************************************
// LookupResults
// **************************************************************************
function LookupResults({ domain }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  console.log(`LOOKUPRESULTS: domain = ${domain}`);
  console.log(`LOOKUPRESULTS: loading = ${loading}`);

  // **************************************************************************
  // getApiKey
  // **************************************************************************
  function getApiKey() {
    // Check Local Storage
    let ApiLayerApiKey = localStorage.getItem("ApiLayerApiKey");
    // console.log(`ApiLayerApiKey from Local Storage = ${ApiLayerApiKey}`);

    // If not there, check .env
    if (ApiLayerApiKey === null) {
      ApiLayerApiKey = import.meta.env.VITE_APILAYER_API_KEY;
      //   console.log(`ApiLayerApiKey from .env = ${ApiLayerApiKey}`);
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

  // **************************************************************************
  // stripUrl
  // **************************************************************************
  function stripUrl(domain = "dummy", subdomain = false) {
    let url = domain;
    // console.log(`stripUrl pre url = ${url}`);
    // let strippedUrl = url.replace(/(^\w+:|^)\/\//, "");
    let strippedUrl = url.replace(/(^\w+:|^)\/\/|\/.*$/g, "");
    if (subdomain) {
      strippedUrl = strippedUrl.replace("www.", "");
    }
    console.log(`old = ${domain} new = ${strippedUrl}`);

    return strippedUrl;
  }

  // **************************************************************************
  // fetchApiData
  // **************************************************************************
  function fetchApiData(apiKey, strippedUrl) {
    // Set up headers
    console.log("in fetchApiData");
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
      });
  }

  // **************************************************************************
  // END OF FUNCTIONS
  // **************************************************************************

  // **************************************************************************
  // *** MAIN *** MAIN *** MAIN *** MAIN *** MAIN *** MAIN *** MAIN *** MAIN **
  // **************************************************************************

  useEffect(() => {
    // Only run the functions if we actually have a domain
    if (domain === null || domain === undefined || domain.length <= 0) {
      //   console.log("no domain");
    } else {
      // Get the API Key
      const apiKey = getApiKey();
      // Get the domain
      const strippedUrl = stripUrl(domain);
      // Get the data
      fetchApiData(apiKey, strippedUrl);
    }
  }, [domain]);

  // **************************************************************************
  // Conditional Returns
  // **************************************************************************

  if (domain === null || domain === undefined || domain.length <= 0) {
    return (
      <>
        <div>
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
        <h2>Error</h2>
        <p>
          There was an error fetching the data for <strong>{domain}</strong>
          <br />
          Please try again later.
        </p>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </>
    );
  }

  console.log(`loading (if) = ${loading}`);
  if (loading) {
    return (
      <>
        <h2>Waiting...</h2>
        <p>Please be patient</p>
      </>
    );
  }

  // **************************************************************************
  // Final return...
  // **************************************************************************
  return (
    <div>
      <h2>Results</h2>
      <p>
        Results for <strong>{domain}</strong>
      </p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default LookupResults;
