import { Tower as TowerProps } from "../types";
import { Block } from ".";
import style from "../style/Tower.module.scss";
import { Dispatch, SetStateAction, useMemo } from "react";

export default function Tower(props: TowerProps & {
	available: boolean;
	selected: boolean;
	setSelected: Dispatch<SetStateAction<number | null>>;
	moveBlockHere: () => void;
	noneSelected: boolean;
}) {
	return (
		<div 
			className={`
				${style.tower}
				${
					props.available || props.selected || props.noneSelected ? 
					style["tower--clickable"] : 
					""
				}
			`}
			onClick={() => {
				// if clicked second time => deselect
				if (props.selected) {
					props.setSelected(null);
				}
				// if clicked and not selected
				else {
					if (props.available) {
						// if available => move block
						props.moveBlockHere();
					}
					// if this tower does not contain any blocks
					else if (props.blocks.length === 0) return;
					else {
						// set this tower as selected
						props.setSelected(props.pos);
					}
				}
			}}
		>
			<div 
				className={`
					${style.stick} 
					${props.available ? style["tower--available"] : ""}
				`}
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
