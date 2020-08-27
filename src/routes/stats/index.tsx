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

const Stats: FunctionalComponent<Props> = (props: Props) => {

    const [myTest, setMyTest] = useState<MyTest>({ user: "Coming", value: "Soon" });

    return (
        <div class={style.stats}>
            <h1>Stats {myTest.user} {myTest.value}</h1>
        </div>
    );
};


export default Stats;