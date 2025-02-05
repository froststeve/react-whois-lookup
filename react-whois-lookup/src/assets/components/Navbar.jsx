import logo from "../images/logo.png";

function Navbar() {
  return (
    <div id="navbar" className="navbar">
      <img
        id="logo"
        // src="/src/assets/images/logo.png"
        src={logo}
        height="100%"
        alt="logo"
      />
    </div>
  );
}
export default Navbar;
