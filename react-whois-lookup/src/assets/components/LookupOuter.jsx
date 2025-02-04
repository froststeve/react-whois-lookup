import LookupTitle from "./LookupTitle.jsx";
import LookupInner from "./LookupInner.jsx";
import LookupResults from "./LookupResults.jsx";
import { useState } from "react";

const LookupOuter = () => {
  const [domain, setDomain] = useState([]);
  const handleDomain = (newDomain) => {
    setDomain(newDomain);
  };

  return (
    <div id="lookup-outer" className="lookup">
      <LookupTitle />
      <LookupInner onDomainChange={handleDomain} />
      <LookupResults domain={domain} />
      <br />
    </div>
  );
};
export default LookupOuter;
