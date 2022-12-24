import { CSSProperties, useContext, useMemo } from "react";
import { BlocksCntContext } from "../App";
import { Block as BlockProps } from "../types";
import style from "../style/block.module.scss";

export default function Block(props: BlockProps) {
	const blocksCnt = useContext(BlocksCntContext);
	const hue = useMemo(() => {
		return (360 / blocksCnt) * props.size;
	}, []);

	return (
		<div
			className={style.block}
			style={{"--hue": hue.toString()} as CSSProperties}
		></div>
	)
}
