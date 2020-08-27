import { h, Component } from "preact";
import linkState from "linkstate";
import style from "./style.scss";
import { route } from "preact-router";

interface Props {
    xrpAddress: string;
}

export default class Spark extends Component<Props> {
    state = {
        loading: false,
        haveResults: false,
        error: "",
        xrpAddress: "",
        xrpAddressInput: "",
        xrpBalance: 0,
        ethAddress: "",
        messageKey: "",
        messageKeyValid: false,
        ethAddressValid: false,
        xrpAddressValid: false
    };

    constructor(props: any) {
        super();
        if (props.xrpAddress) {
            this.state.xrpAddress = props.xrpAddress;
            this.state.xrpAddressInput = props.xrpAddress;
            this.checkMessageKey();
        }
    }

    setStateInvalid() {
        this.setState({
            error: "Error fetching transactions",
            loading: false,
            haveResults: false,
            ethAddressValid: false,
            ethAddress: "",
            messageKeyValid: false,
            messageKey: "",
            xrpAddressValid: false
        });
    }

    componentDidCatch(error: any, errorInfo: any): void {
        this.setStateInvalid();
    }

    changeRoute = (e: any): void => {
        e.preventDefault();
        if (
            this.state.xrpAddressInput &&
            this.state.xrpAddressInput.length > 0
        ) {
            route(`/spark/${this.state.xrpAddressInput}`, true);
            this.checkMessageKey();
        }
    };

    checkMessageKey = async () => {
        // https://data.ripple.com/v2/accounts/{address}/transactions?type=AccountSet&result=tesSUCCESS&limit=5
        try {
            this.setState({
                loading: true,
                haveResults: false,
                error: false,
                messageKeyValid: false,
                ethAddressValid: false,
                xrpAddressValid: true
            });

            if (this.state.xrpAddressInput === null) {
                this.setStateInvalid();
                throw "Invalid XRP Address";
            }
            // eslint-disable-next-line prettier/prettier
            const validAddress = this.state.xrpAddressInput
                .match(/^r[A-HJ-NP-Za-km-z1-9]{24,34}$|^X[A-HJ-NP-Za-km-z1-9]{46}$|^T[A-HJ-NP-Za-km-z1-9]{46}$/g);

            if (validAddress === null) {
                this.setStateInvalid();
                throw "Invalid XRP Address";
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            const api = new ripple.RippleAPI({
                server: "wss://s2.ripple.com/"
            });

            await api.connect();
            const info = await api.getTransactions(this.state.xrpAddressInput, {
                types: ["settings"],
                limit: 30
            });

            this.setState({ haveResults: true });
            if (info === null || info === undefined) {
                this.setState({
                    ethAddressValid: false,
                    ethAddress: "",
                    messageKeyValid: false,
                    messageKey: ""
                });
                return;
            }
            this.setState({
                xrpAddress: this.state.xrpAddressInput,
                xrpAddressValid: true,
                loading: false
            });

            if (info.length === 0) {
                this.setState({
                    ethAddressValid: false,
                    ethAddress: "NOT FOUND",
                    messageKeyValid: false,
                    messageKey: "NOT FOUND"
                });
                return;
            }

            info.forEach((element: any) => {
                const messageKey = element.specification.messageKey;
                // Message Key format: 02000000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                const ethAddress = messageKey.replace(/^02[0]{24}/g, "0x");

                if (ethAddress) {
                    // ETH address format: 0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                    const ethAddressMatch = ethAddress.match(/^0x[a-fA-F0-9]{40}$/g);
                    if (
                        ethAddressMatch !== null &&
                        ethAddressMatch.length === 1
                    ) {
                        this.setState({
                            ethAddressValid: true,
                            ethAddress: ethAddressMatch[0],
                            messageKeyValid: true,
                            messageKey: messageKey
                        });
                    }
                }
            });
        } catch (e) {
            this.setState({ error: e });
        }
        this.setState({ loading: false });
    };

    makeIcon(valid: boolean) {
        if (valid) return <span class={style.green}><i class="material-icons">check_circle</i></span>;
        else return <span class={style.red}><i class="material-icons">error</i></span>;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    render(_props: any, state: any) {
        return (
            <div class={style.spark}>
                <h1>
                    Check your claim for the <span>Spark Token</span>
                </h1>
                {/* <Button>Hello World</Button> */}
                <p class={style.label}>Enter your XRP wallet address</p>
                <form>
                    <div class="mdl-textfield mdl-js-textfield" style="width:100%">
                        <input
                            type="text"
                            name="xrpAddressInput"
                            value={state.xrpAddressInput}
                            onInput={linkState(this, "xrpAddressInput")}
                            placeholder="rXXXX..."
                        ></input>
                        <button onClick={this.changeRoute} class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                            Check
                        </button>
                    </div>


                </form>
                <div class={style.results}>
                    {state.loading ? (
                        <div class={style.loading}>
                            <div class="mdl-spinner mdl-js-spinner is-active"></div>
                        </div>
                    ) : state.error ? (
                        <div class={style.error}>{state.error}</div>
                    ) : state.ethAddressValid && state.haveResults ? (
                        <h4 class={style.green}>
                            {this.makeIcon(true)} Congratulations, you're all
                            set
                        </h4>
                    ) : state.haveResults ? (
                        <h4 class={style.red}>
                            {this.makeIcon(false)}{"  "} XRP account NOT linked to Spark

                        </h4>
                    ) : null}

                    {state.haveResults ? (
                        <div>
                            <table>
                                <tr className={state.xrpAddressValid ? "valid" : "notvalid"}>
                                    <td>{this.makeIcon(state.xrpAddressValid)}</td>
                                    <td>XRP Address</td>
                                    <td>
                                        <b>{state.xrpAddress}</b>
                                    </td>
                                </tr>
                                <tr className={state.messageKeyValid ? "valid" : "notvalid"}>
                                    <td>{this.makeIcon(state.messageKeyValid)}</td>
                                    <td>Message Key</td>
                                    <td>
                                        <b>{state.messageKey}</b>
                                    </td>
                                </tr>
                                <tr className={state.ethAddressValid ? "valid" : "notvalid"}>
                                    <td>{this.makeIcon(state.ethAddressValid)}</td>
                                    <td>Linked Address</td>
                                    <td>
                                        <b>
                                            {state.ethAddressValid ? (
                                                <a href={`https://etherscan.io/address/${state.ethAddress}`}>{state.ethAddress}</a>
                                            ) : (
                                                    state.ethAddress
                                                )}
                                        </b>
                                    </td>
                                </tr>
                            </table>
                            {!state.ethAddressValid ? (
                                <p class={style.center}>
                                    {this.makeIcon(false)}<br />
                                    Your account <span style="text-decoration: underline">will not</span> receive <b>Spark Tokens</b>. See{" "}
                                    <a href="https://coil.com/p/wietse/Prepare-for-claiming-your-Spark-token-Flare-Networks-a-tool-for-XUMM-XRPToolkit/NkXJQUqpi">
                                        How to claim your Spark Tokens
                                    </a>{" "}
                                    and enable your account, then come back to verify that it's linked properly.
                                </p>
                            ) : null}
                        </div>
                    ) : (
                            <div></div>
                        )}
                </div>
                <div class={style.links}>
                    <p>
                        Compatible wallets to claim Spark Token:{" "}
                        <a href="https://shop.ledger.com/?r=ecdc3f9965ab">Ledger Nano</a> |{" "}
                        <a href="https://xumm.app/">XUMM</a>
                    </p>
                    <p>
                        For Ledger Nano users, account can be signed using {" "}
                        <a href="https://www.xrptoolkit.com/">XRPToolkit</a>
                    </p>
                </div>
                <div class={style.footer}>
                    <p>
                        Created By @Anthony_Barry_ - <a href="/disclaimer">Disclaimer</a>
                    </p>
                </div>
            </div>
        );
    }
}
