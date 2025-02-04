const Footer = () => {
  let copyrightYear = new Date().getFullYear();
  return (
    <div id="footer" className="footer">
      <div id="copyright">
        &copy;{copyrightYear}{" "}
        <a href="https://www.linkedin.com/in/stevefrostuk/">Steve Frost</a>
      </div>
    </div>
  );
};
export default Footer;
