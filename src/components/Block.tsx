import { CSSProperties, useContext, useMemo } from "react";
import { BlocksCntContext } from "../App";
import { Block as BlockProps } from "../types";
import style from "../style/Block.module.scss";

const width_range = 80; // at least 20%
const width_rem = 100 - width_range;

export default function Block(props: BlockProps) {
	const blocksCnt = useContext(BlocksCntContext);
	const [hue, width] = useMemo(() => {
		const hue = (360 / blocksCnt) * props.size;

		const width = props.size / (blocksCnt + 1) * width_range + width_rem; // + 1 so it won't be 100%

		return [
			hue,
			width
		];
	}, [blocksCnt]);

	console.log(width);

	return (
		<div
			className={style.block}
			style={{
				"--hue": hue,
				"--width": `${width}%`
			} as CSSProperties}
			draggable={true}
		></div>
	);
}
