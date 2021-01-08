import { h, FunctionalComponent } from "preact";
import { useState } from "preact/hooks";
import style from "./style.scss";



interface Props {
    user: string;
}

interface MyTest {
    user: string;
    value: string;
}


const getRippleData = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const api = new ripple.RippleAPI({
        server: "wss://s2.ripple.com/"
    });

    await api.connect();
    const info = await api.getTransactions({
        types: ["settings"],
        limit: 30
    });

    console.log(info);

}

const Stats: FunctionalComponent<Props> = (props: Props) => {

    const [myTest, setMyTest] = useState<MyTest>({ user: "Coming", value: "Soon" });


    getRippleData();


    return (
        <div class={style.stats}>
            <h1>Stats {myTest.user} {myTest.value}</h1>
        </div>
    );
};


export default Stats;