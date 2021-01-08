import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";
import * as style from "./style.scss";

const Header: FunctionalComponent = () => {
    return (
        <header class={style.header}>
            <h1>
                <Link href="/">
                    <img src="/assets/flare-tools-logo.svg" width="25"></img>
                    {"   "}flaretools
                </Link>
            </h1>
            <nav>
                {/* <Link activeClassName={style.active} href="/">
                    Home
                </Link>
                <Link activeClassName={style.active} href="/stats">
                    Stats
                </Link> */}

                <Link activeClassName={style.active} href="/spark">
                    Spark
                </Link>
            </nav>
        </header>
    );
};

export default Header;
