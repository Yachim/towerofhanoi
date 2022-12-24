import { Tower as TowerProps } from "../types";
import { Block } from ".";
import style from "../style/Tower.module.scss";

export default function Tower(props: TowerProps) {
	return (
		<div className={style.tower}>
			<div className={style.stick}></div>
			<div className={style.blocks}>
				{props.blocks.map((block, i) => 
					<Block key={i} {...block}/>
				)}
				<div className={style.base}></div>
			</div>
		</div>
	);
}
