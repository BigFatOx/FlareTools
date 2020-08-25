import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";
import style from "./style.scss";

const Disclaimer: FunctionalComponent = () => {
    return (
        <div class={style.disclaimer}>
            <h1>Disclaimer</h1>
            <ul>
                <li>
                    flare.tools is an independent tool that is not in anyway
                    affilated with Flare Networks
                </li>
            </ul>
            <Link href="/">
                <h4>Back to Home</h4>
            </Link>
        </div>
    );
};

export default Disclaimer;
