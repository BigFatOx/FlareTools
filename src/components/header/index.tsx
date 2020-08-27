import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";
import * as style from "./style.scss";

const Header: FunctionalComponent = () => {
    return (
        <header class={style.header}>
            <h1>
                <i class="material-icons">construction</i> FlareTools
            </h1>
            <nav>
                {/* <Link activeClassName={style.active} href="/">
                    Home
                </Link>
                <Link activeClassName={style.active} href="/stats">
                    XRP/Spark Stats
                </Link> */}

                <Link activeClassName={style.active} href="/spark">
                    Spark
                </Link>
            </nav>
        </header>
    );
};

export default Header;
