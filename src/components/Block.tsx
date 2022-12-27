import { CSSProperties, useContext, useMemo } from "react";
import { BlocksCntContext } from "../App";
import { Block as BlockProps } from "../types";
import style from "../style/Block.module.scss";

const width_range = 80; // at least 20%
const width_rem = 100 - width_range;

export default function Block(props: BlockProps & {
	selected: boolean;
}) {
	const blocksCnt = useContext(BlocksCntContext);

	const hue = useMemo(() => (
		(360 / blocksCnt) * props.size
	), [blocksCnt, props.size]);

	const width = useMemo(() => (
		props.size / (blocksCnt + 1) * width_range + width_rem
	), [blocksCnt, props.size]);

	return (
		<div
			className={`
				${style.block} 
				${props.selected ? style["block--selected"] : ""}
			`}
			style={{
				"--hue": hue,
				"--width": `${width}%`
			} as CSSProperties}
		></div>
	);
}
