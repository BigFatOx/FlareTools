import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";
import style from "./style.scss";

const Disclaimer: FunctionalComponent = () => {
    return (
        <div class={style.disclaimer}>
            <h1>Disclaimer</h1>
            <ul>
                <li>
                    <p>
                        Given an XRP Address, this tool will check for a
                        transaction on the XRP Ledger that contains a MessageKey
                        with an ETH Compatible address.
                    </p>
                </li>
                <li>
                    <p>
                        This tool is provided on a voluntary and best effort
                        basis. It is highly advised that you check other sources
                        and do your own verification.
                    </p>
                </li>
                <li>
                    <p>
                        This tool was created by me and I am not affilated with
                        Flare.Networks.
                    </p>
                </li>
                {/* <li>
                            <p>
                                Source code for this tool can be found on{" "}
                                <a href="https://github.com/bitsleft/FlareTools">
                                    Github
                                </a>{" "}
                                -{" "}
                                <a href="https://github.com/bitsleft/FlareTools/issues">
                                    Bug reports and feedback welcome
                                </a>
                            </p>
                        </li> */}
            </ul>

            <Link href="/">Back</Link>
        </div>
    );
};

export default Disclaimer;
