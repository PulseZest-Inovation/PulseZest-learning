import React from 'react';

const Footer = () => {
    const footerStyle = {
        backgroundColor: '#333', // Dark background
        color: '#fff', // Light text color
        padding: '40px 20px',
        textAlign: 'center',
        position: 'relative',
        bottom: 0,
        width: '100%',
        boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow for separation
    };

    const footerTitleStyle = {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
    };

    const footerTextStyle = {
        fontSize: '16px',
        marginBottom: '20px',
    };

    const footerLinkStyle = {
        color: '#1e90ff',
        textDecoration: 'none',
        fontWeight: '500',
        transition: 'color 0.3s ease',
    };

    const footerLinkHoverStyle = {
        color: '#63a4ff',
    };

    const socialIconsContainerStyle = {
        marginTop: '20px',
    };

    const socialIconStyle = {
        color: '#fff',
        fontSize: '24px',
        margin: '0 10px',
        transition: 'color 0.3s ease',
    };

    const socialIconHoverStyle = {
        color: '#1e90ff',
    };

    return (
        <footer style={footerStyle}>
            <div style={footerTitleStyle}>Footer Title</div>
            <div style={footerTextStyle}>
                <p>Your Company &copy; {new Date().getFullYear()}</p>
                <p>Some additional information or tagline goes here.</p>
            </div>
            <div>
                <a
                    href="#"
                    style={footerLinkStyle}
                    onMouseOver={(e) => e.currentTarget.style.color = footerLinkHoverStyle.color}
                    onMouseOut={(e) => e.currentTarget.style.color = footerLinkStyle.color}
                >
                    Privacy Policy
                </a>
                {' | '}
                <a
                    href="#"
                    style={footerLinkStyle}
                    onMouseOver={(e) => e.currentTarget.style.color = footerLinkHoverStyle.color}
                    onMouseOut={(e) => e.currentTarget.style.color = footerLinkStyle.color}
                >
                    Terms of Service
                </a>
            </div>
            <div style={socialIconsContainerStyle}>
                <a
                    href="#"
                    style={socialIconStyle}
                    onMouseOver={(e) => e.currentTarget.style.color = socialIconHoverStyle.color}
                    onMouseOut={(e) => e.currentTarget.style.color = socialIconStyle.color}
                >
                    <i className="fa fa-facebook"></i>
                </a>
                <a
                    href="#"
                    style={socialIconStyle}
                    onMouseOver={(e) => e.currentTarget.style.color = socialIconHoverStyle.color}
                    onMouseOut={(e) => e.currentTarget.style.color = socialIconStyle.color}
                >
                    <i className="fa fa-twitter"></i>
                </a>
                <a
                    href="#"
                    style={socialIconStyle}
                    onMouseOver={(e) => e.currentTarget.style.color = socialIconHoverStyle.color}
                    onMouseOut={(e) => e.currentTarget.style.color = socialIconStyle.color}
                >
                    <i className="fa fa-linkedin"></i>
                </a>
            </div>
        </footer>
    );
};

export default Footer;
