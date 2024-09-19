import React from 'react';
import './Footer.css'; // making sure the styles are being correctly imported
 
const Footer: React.FC = () => {
    return (
<footer>
<div className="footercontent">
<div className="footersection about">
<h2>About Us</h2>
<p>Epam Systems India Private Limited, Flat No .101 Lumbini Towers, Punjagutta (Opp Nims Hospital), Hyderabad, Telangana, India</p>
</div>
<div className="footersection link">
<h2>Quick Links</h2>
<ul>
<li><a href="/about">About Us</a></li>
<li><a href="/contact">Contact</a></li>
<li><a href="/terms">Terms of Service</a></li>
</ul>
</div>
<div className="footersection social">
<h2>Social Media</h2>
<a href="#">
<img src="https://classicrock995.com/wp-content/uploads/2020/11/Facebook-logo.png" alt="Facebook" style={{ width: 30 }} />
</a>
<a href="#">
<img src="https://i.pinimg.com/originals/6a/39/8e/6a398e2bffd61024b7fa8c6eaf6a4e62.png" alt="Twitter" style={{ width: 20 }} />
</a>
<a href="#">
<img src="https://vectorseek.com/wp-content/uploads/2023/07/Twitter-X-Logo-Vector-01-2.jpg" alt="Instagram" style={{ width: 20 }} />
</a>
</div>
</div>
<div className="footerbottom">
&copy; recipeapp.com | Designed by MasterChef's
</div>
</footer>

    );
};
 
export default Footer;