import { FunctionalComponent, h } from "preact";
import style from "./style.scss";
import { route } from "preact-router";

const Home: FunctionalComponent = () => {
    route("/spark", true);
    return <div class={style.home}></div>;
};

export default Home;
