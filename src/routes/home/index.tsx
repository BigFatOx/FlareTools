import { FunctionalComponent, h } from "preact";
import style from "./style.scss";
import { Link, route } from "preact-router";

const Home: FunctionalComponent = () => {
    route("/spark", true);
    return (
        <div class={style.home}>
            <h1>Home Page</h1>
            <p>Nothing to see here.  You may be looking for the <Link href="/spark">Spark</Link></p>
        </div>
    );
};

export default Home;
