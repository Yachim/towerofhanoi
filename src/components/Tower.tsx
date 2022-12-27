import { Tower as TowerProps } from "../types";
import { Block } from ".";
import style from "../style/Tower.module.scss";
import { Dispatch, SetStateAction } from "react";

export default function Tower(props: TowerProps & {
	available: boolean;
	selected: boolean;
	setSelected: Dispatch<SetStateAction<0 | 1 | 2 | null>>;
}) {

	return (
		<div 
			className={style.tower}
			onClick={() => {
				if (props.selected) {
					//TODO: transfer block

					props.setSelected(null);
				}
				else {
					if (props.blocks.length === 0) return;

					props.setSelected(props.pos)
				}
			}}
		>
			<div 
				className={style.stick} 
			></div>
			<div className={style.blocks}>
				{props.blocks.map((block, i) => 
					<Block 
						key={i} 
						{...block} 
						selected={props.selected && i === 0}
					/>
				)}
				<div 
					className={`
						${style.base} 
						${props.available ? style["tower--available"] : ""}
					`}
				></div>
			</div>
		</div>
	);
}
