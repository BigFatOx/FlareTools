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
        ethAddress: "",
        messageKey: "",
        messageKeyValid: false,
        ethAddressValid: false,
        xrpAddressValid: false,
        towo: {
            success: false,
            xrplAddress: "",
            flareAddress: "",
            xrpBalance: 0,
            sparkClaim: 0
        }

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

            await this.getTowoResults();

            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            const api = new ripple.RippleAPI({
                server: 'wss://s2.ripple.com/'
            });

            await api.connect();
            const info = await api.getSettings(this.state.xrpAddressInput);

            console.log(this.state.xrpAddressInput + ' ' + info)
            //const balances = await api.getBalances(this.state.xrpAddressInput, [{ ledgerVersion: 601555980 }]);


            //console.log(balances);

            api.disconnect();

            this.setState({
                haveResults: true
            });

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

            const messageKey = info.messageKey;


            // const messageKey = "02000000000000000000000000415F8315C9948AD91E2CCE5B8583A36DA431FB61";
            this.setState({
                messageKey: messageKey,
                messageKeyValid: false,
                ethAddressValid: false,
                ethAddress: "NOT FOUND",
            });
            if (messageKey === null || messageKey === undefined) {
                throw 'XRP account NOT linked to Spark';
            }

            // Message Key format: 02000000000000000000000000XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
            const ethAddress = messageKey.replace(/^02[0]{24}/g, "0x");



            if (ethAddress) {
                // ETH address format: 0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                const ethAddressMatch = ethAddress.match(/^0x[A-F0-9]{40}$/g);
                if (
                    ethAddressMatch !== null &&
                    ethAddressMatch.length === 1
                ) {

                    if (ethAddressMatch[0] === this.state.towo.flareAddress) {
                        this.setState({
                            ethAddressValid: true,
                            ethAddress: ethAddressMatch[0],
                            messageKeyValid: true,
                        });
                    } else {
                        console.log('TowoLabs flare address does not match messagekey flare address');
                    }

                }
            }

        } catch (e) {
            this.setState({ error: e });
        }
        this.setState({ loading: false });
    };

    async getTowoResults() {
        const response = await fetch(`https://api.towo.io/v2/spark/info/${this.state.xrpAddressInput}`);
        const towo = await response.json();
        console.log(towo);
        this.setState({
            towo: towo,
        });
    }

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

                <form>
                    <div class="mdl-textfield mdl-js-textfield" style="width:100%">
                        <label>Enter your XRP wallet address</label>
                        <input
                            type="text"
                            name="xrpAddressInput"
                            value={state.xrpAddressInput}
                            onInput={linkState(this, "xrpAddressInput")}
                            placeholder="rXXXX..."
                        ></input>
                        <button onClick={this.changeRoute} class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                            <i class="material-icons">search</i>
                        </button>
                    </div>


                </form>

                <div className={style.results}>
                    <div className={state.haveResults || state.loading || state.error ? "" : style.hide}>
                        <div >
                            <table>
                                <tr>
                                    <td>
                                        {state.ethAddressValid && state.haveResults ? this.makeIcon(true) :
                                            state.loading ? (
                                                <div class={style.loading}>
                                                    Loading...
                                                </div>
                                            ) : this.makeIcon(false)
                                        }
                                    </td>
                                    <td colSpan={2}>
                                        {state.error ? (
                                            <h4 class={style.red}>{state.error}</h4>
                                        ) :
                                            state.ethAddressValid && state.haveResults ? (
                                                <h4 class={style.green}>
                                                    Congratulations, you're all
                                                    set
                                                </h4>
                                            ) : state.haveResults ? (
                                                <h4 class={style.red}>
                                                    XRP account NOT linked to Spark
                                                </h4>
                                            ) : null}
                                    </td>
                                </tr>
                                <tr className={!state.haveResults ? style.hide : ""}>
                                    <td>{this.makeIcon(state.xrpAddressValid)}</td>
                                    <td>XRP Address</td>
                                    <td>
                                        <div class={style.panel}>
                                            <span>{state.xrpAddress}</span>
                                        </div>
                                    </td>
                                </tr>

                                <tr className={!state.haveResults ? style.hide : ""}>
                                    <td>{this.makeIcon(state.messageKeyValid)}</td>
                                    <td>Message Key</td>
                                    <td>
                                        <div class={style.panel}>
                                            <span>{state.messageKey}</span>
                                            <ul className={state.messageKeyValid || state.messageKey === "NOT FOUND" ? style.hide : style.error}>
                                                <li>Invalid Message Key</li>
                                                <li class={style.bullet}>Check that it starts with 02 followed by 24 zeros</li>
                                                <li class={style.bullet}>Followed by 40 UPPPERCASE characters, A-F and 0-9</li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                                <tr className={!state.haveResults ? style.hide : ""}>
                                    <td>{this.makeIcon(state.ethAddressValid)}</td>
                                    <td>Flare Address</td>
                                    <td>
                                        <div class={style.panel}>
                                            <span>{state.ethAddress}</span>
                                            {/* <ul className={!state.ethAddressValid ? style.hide : style.ok}>
                                                <li>Uppercase</li>
                                                <li>Only A-F and 0-9 values</li>
                                                <li>Length is 40</li>
                                            </ul> */}
                                        </div>
                                        {/* {state.ethAddressValid ? (
                                            <a href={`https://etherscan.io/address/${state.ethAddress}`}>{state.ethAddress}</a>
                                        ) : (
                                                state.ethAddress
                                            )} */}

                                    </td>
                                </tr>
                                <tr className={!state.haveResults || state.error ? style.hide : ""}>
                                    <td>{this.makeIcon(state.towo.xrpBalance > 0)}</td>
                                    <td>XRP Balance at Snapshot</td>
                                    <td>
                                        <div class={style.panel}>
                                            <span>{state.towo.xrpBalance}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className={!state.haveResults || state.error ? style.hide : ""}>
                                    <td>{this.makeIcon(state.towo.sparkClaim > 0)}</td>
                                    <td>Spark Claim</td>
                                    <td>
                                        <div class={style.panel}>
                                            <span>{state.towo.sparkClaim}</span>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            {!state.ethAddressValid && state.haveResults ? (
                                <p class={style.center}>
                                    You do not have a valid <b>Flare Address</b>. See{" "}
                                    <a href="https://forum.flaretalk.com/t/how-to-make-your-spark-claim-from-your-xrp-account/18">
                                        How to claim your Spark Tokens
                                    </a>{" "}
                                    and enable your account, then come back to verify that it's linked properly.
                                </p>
                            ) : null}
                        </div>
                    </div>
                </div>
                <h3>Visit <a href="https://forum.flaretalk.com">FlareTalk.com</a> to join the discussion and learn about Flare Networks!</h3>
                <div class={style.links}>
                    <p>
                        List of exchanges that support the Flare Drop {" "}
                        <a href="https://forum.flaretalk.com/t/list-of-exchanges-that-support-the-flare-networks-spark-token-drop/19">XRP/Spark Exchanges</a>
                    </p>
                    <p>
                        Compatible wallets to claim Spark Token {" "}
                        <a href="https://shop.ledger.com/?r=ecdc3f9965ab">Ledger Nano</a> |{" "}
                        <a href="https://xumm.app/">XUMM</a>
                    </p>
                    <p>
                        For Ledger Nano users, account can be signed using {" "}
                        <a href="https://www.xrptoolkit.com/">XRPToolkit</a>
                    </p>
                    <p>
                        Official Flare Networks information and FAQs {" "}
                        <a href="https://flare.ghost.io/claiming-spark-faq/">Flare Networks</a>
                    </p>
                </div>

                <div class={style.footer}>
                    <p>
                        Created By @Anthony_Barry_ | <a href="/disclaimer">Disclaimer</a>
                    </p>
                </div>
            </div>
        );
    }
}
