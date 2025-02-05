import React, { useState, useEffect, useRef } from "react";

const LookupInnerInput = ({ onDomainChange }) => {
  const [domain, setDomain] = useState("");

  // Focus on the input when the component mounts
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div id="lookup-inner-input" className="lookup-inner-input">
      <label>
        Enter a domain name:
        <br />
      </label>
      <input
        id="domain"
        ref={inputRef}
        type="text"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onDomainChange(domain);
          }
        }}
      />
      <button
        onClick={() => {
          //   let domain = { domain };
          onDomainChange(domain);
        }}
      >
        WhoIs
      </button>
    </div>
  );
};
export default LookupInnerInput;
