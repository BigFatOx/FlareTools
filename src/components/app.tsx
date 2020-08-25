import { FunctionalComponent, h } from "preact";
import { Route, Router, RouterOnChangeArgs, route } from "preact-router";

import Home from "../routes/home";
import Spark from "../routes/spark";
import NotFoundPage from "../routes/notfound";
import Header from "./header";
import Disclaimer from "../routes/disclaimer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ((module as any).hot) {
    // tslint:disable-next-line:no-var-requires
    require("preact/debug");
}

const App: FunctionalComponent = () => {
    let currentUrl: string;
    const handleRoute = (e: RouterOnChangeArgs) => {
        currentUrl = e.url;
    };

    return (
        <div id="app">
            <Header />
            <Router onChange={handleRoute}>
                <Route path="/" component={Home} />
                <Route path="/disclaimer" component={Disclaimer} />
                <Route path="/spark" component={Spark} />
                <Route path="/spark/:xrpAddress" component={Spark} />
                <NotFoundPage default />
            </Router>
        </div>
    );
};

export default App;
