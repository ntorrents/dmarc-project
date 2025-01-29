import "./Intro.css";

function Intro() {
    return (
        <div className="intro">
            <div className="container">
                <div className="row">
                    <div className="intro-content">
                        <h1>
                            Protect Your Email With{" "}
                            <span className="safe">SAFE</span>
                            DMARC
                        </h1>
                        <p>
                            Block phishing, business email compromise,
                            ransomware, spam, and improve email deliverability
                        </p>
                        <button>SIGN UP FREE</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Intro;
