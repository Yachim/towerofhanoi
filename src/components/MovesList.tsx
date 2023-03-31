import { faArrowRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction } from "react";
import { Move, Moves } from "../App";
import style from "../style/MovesList.module.scss";

function diffMoves(m1: Move, m2: Move): {
	sourceTower: number;
	targetTower: number;
	blockSize: number;
} {
	const tower1InitialCnt = m1[0].blocks.length;
	const tower2InitialCnt = m1[1].blocks.length;
	const tower3InitialCnt = m1[2].blocks.length;

	const tower1AfterCnt = m2[0].blocks.length;
	const tower2AfterCnt = m2[1].blocks.length;
	const tower3AfterCnt = m2[2].blocks.length;

	let sourceTower = -1;
	let targetTower = -1;

	if (tower1InitialCnt > tower1AfterCnt) {
		sourceTower = 0;
	}
	else if (tower1AfterCnt > tower1InitialCnt) {
		targetTower = 0;
	}

	if (tower2InitialCnt > tower2AfterCnt) {
		sourceTower = 1;
	}
	else if (tower2AfterCnt > tower2InitialCnt) {
		targetTower = 1;
	}

	if (tower3InitialCnt > tower3AfterCnt) {
		sourceTower = 2;
	}
	else if (tower3AfterCnt > tower3InitialCnt) {
		targetTower = 2;
	}

	if (sourceTower === -1 || targetTower === -1) {
		throw "Source tower of target tower must be set";
	}

	let blockSize = m1[sourceTower].blocks[0].size;

	return {
		sourceTower: sourceTower + 1,
		targetTower: targetTower + 1,
		blockSize
	};
}

export default function MovesList(props: {
	closeFunc: Dispatch<SetStateAction<boolean>>;
	moves: Moves;
	shown: boolean;
}) {
	return (
		<div className={style.wrapper} data-visible={props.shown}>
			<p className={style.heading}>
				Moves
				<button onClick={() => props.closeFunc(false)} className={style["close-button"]}>
					<FontAwesomeIcon icon={faXmark} />
				</button>
			</p>

			{props.moves.length === 1 ?
				<p className={style["no-moves-yet"]}>No moves yet</p>
				:
				<ol>
					{props.moves.slice(1).map((_, i) => {
						const { sourceTower, targetTower, blockSize } = diffMoves(props.moves[i], props.moves[i + 1]);

						return (
							<li key={i}>
								<span>
									Tower #{sourceTower}, size {blockSize}
									<FontAwesomeIcon className={style.arrow} icon={faArrowRight} />
									Tower #{targetTower}
								</span>
							</li>
						)
					})}
				</ol>}
		</div>
	);
}
