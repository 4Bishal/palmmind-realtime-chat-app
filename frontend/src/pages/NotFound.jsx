import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .nf-root {
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: #f5f3ef;
                    font-family: 'DM Sans', sans-serif;
                    gap: 0;
                    user-select: none;
                }

                .nf-code {
                    font-family: 'Instrument Serif', serif;
                    font-size: clamp(6rem, 20vw, 10rem);
                    color: #e8e4dc;
                    line-height: 1;
                    letter-spacing: -0.04em;
                }

                .nf-divider {
                    width: 32px;
                    height: 1px;
                    background: #c9c4bb;
                    margin: 1.5rem 0;
                }

                .nf-title {
                    font-size: 0.9375rem;
                    font-weight: 500;
                    color: #1a1916;
                    letter-spacing: 0.01em;
                }

                .nf-sub {
                    font-size: 0.8125rem;
                    color: #9a9589;
                    font-weight: 300;
                    margin-top: 0.4rem;
                }

                .nf-btn {
                    margin-top: 2.25rem;
                    padding: 0.6rem 1.4rem;
                    background: #1a1916;
                    color: #f5f3ef;
                    border: none;
                    border-radius: 10px;
                    font-size: 0.8125rem;
                    font-family: 'DM Sans', sans-serif;
                    font-weight: 500;
                    cursor: pointer;
                    transition: opacity 0.15s;
                }
                .nf-btn:hover { opacity: 0.78; }
            `}</style>

            <div className="nf-root">
                <p className="nf-code">404</p>
                <div className="nf-divider" />
                <p className="nf-title">Page not found</p>
                <p className="nf-sub">The page you're looking for doesn't exist.</p>
                <button className="nf-btn" onClick={() => navigate("/")}>
                    Go home
                </button>
            </div>
        </>
    );
}