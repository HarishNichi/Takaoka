import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html lang="en">
                <Head>
                    <title>Telenet</title>
                    <meta charSet="UTF-8" />
                    <meta name="description" content="The ultimate collection of design-agnostic, flexible and accessible React UI Components." />
                    <meta name="robots" content="index, follow" />
                    <meta name="viewport" content="initial-scale=1, width=device-width" />
                    <link rel="icon" href="data:," />
                    {/* <meta property="og:type" content="website"></meta>
                    <meta property="og:title" content="Sakai by PrimeReact | Free Admin Template for NextJS"></meta>
                    <meta property="og:url" content="https://www.primefaces.org/sakai-react"></meta>
                    <meta property="og:description" content="The ultimate collection of design-agnostic, flexible and accessible React UI Components." />
                    <meta property="og:image" content="https://www.primefaces.org/static/social/sakai-nextjs.png"></meta>
                    <meta property="og:ttl" content="604800"></meta> */}
                   
                    <link id="theme-css" href={`/themes/default/theme.css`} rel="stylesheet"></link>
                    
                    {/* Skip Links for Accessibility */}
                    <style dangerouslySetInnerHTML={{
                        __html: `
                            .skip-link {
                                position: absolute;
                                top: -40px;
                                left: 6px;
                                background: #000;
                                color: white;
                                padding: 8px;
                                text-decoration: none;
                                border-radius: 4px;
                                z-index: 10000;
                                opacity: 0;
                                visibility: hidden;
                                transition: opacity 0.3s, visibility 0.3s;
                            }
                            .skip-link:focus {
                                top: 6px;
                                opacity: 1;
                                visibility: visible;
                            }
                        `
                    }} />
                </Head>
                <body>
                    {/* Skip Links */}
                    <a href="#main-content" className="skip-link">
                        Skip to main content
                    </a>
                    <a href="#main-navigation" className="skip-link">
                        Skip to navigation
                    </a>
                    
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
