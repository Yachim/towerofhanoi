import { Tower as TowerProps } from "../types";
import { Block } from ".";

export default function Tower(props: TowerProps) {
	return (
		<div>
			{props.blocks.map((block, i) => 
				<Block key={i} {...block}/>
			)}
		</div>
	)
}
