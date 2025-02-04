import LookupInnerInput from "./LookupInnerInput.jsx";

const LookupInner = ({ onDomainChange }) => {
  console.log({ onDomainChange });
  return (
    <div id="lookup-inner" className="lookup-inner">
      <LookupInnerInput onDomainChange={onDomainChange} />
      <br />
    </div>
  );
};
export default LookupInner;
