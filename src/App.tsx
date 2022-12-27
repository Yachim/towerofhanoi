import { createContext, useEffect, useMemo, useRef, useState } from 'react'
import { Tower } from './components';
import { Tower as TowerProps } from './types';
import "./style/App.global.scss";
import style from "./style/App.module.scss";;

const defaultBlocksCnt = 3;
const maxBlocksCnt = 20;
const minBlocksCnt = 3;
export const BlocksCntContext = createContext(defaultBlocksCnt);
export const WonContext = createContext(false);

function App() {
	const [blocksCnt, setBlocksCnt] = useState(defaultBlocksCnt);
	const cntEl = useRef<HTMLInputElement>(null);

	const [towers, setTowers] = useState<TowerProps[]>([
		{
			blocks: [
				{size: 1},
				{size: 2},
				{size: 3}
			],
			pos: 0
		},
		{
			blocks: [],
			pos: 1
		},
		{
			blocks: [],
			pos: 2
		}
	]);

	function applyAndRestart() {
		if (!cntEl.current) return;
		if (isNaN(cntEl.current.value as any)) {
			cntEl.current.value = defaultBlocksCnt.toString();
			return;
		}

		let newCnt = +(cntEl.current.value);
		newCnt = Math.min(Math.max(minBlocksCnt, newCnt), maxBlocksCnt);
		cntEl.current.value = newCnt.toString();

		setBlocksCnt(newCnt);
	}

	// restart after modifying blocksCnt
	useEffect(restart, [blocksCnt]);

	function restart() {
		const blocks = [];
		for (let i = 1; i <= blocksCnt; i++) {
			blocks.push({
				size: i
			});
		}

		setTowers([
			{
				blocks: blocks,
				pos: 0
			},
			{
				blocks: [],
				pos: 1
			},
			{
				blocks: [],
				pos: 2
			}
		]);

		setActiveTower(null);
		setAvailableTowers([]);
		setIsWon(false);
		setMoveCnt(0);
	}

	const [activeTower, setActiveTower] = useState<number | null>(null);
	const [availableTowers, setAvailableTowers] = useState<number[]>([]);

	useEffect(() => {
		// if none selected
		if (activeTower === null) {
			setAvailableTowers([]);
			return;
		}

		let available = [0, 1, 2];
		// remove active tower
		available.splice(activeTower, 1);

		available = available.filter((availableIndex, i) => {
			const tower = towers[availableIndex];
			
			// if tower does not contain blocks => skip
			if (tower.blocks.length === 0) return true;

			const activeTowerTopBlockSize = towers[activeTower].blocks[0].size;
			const towerTopBlockSize = tower.blocks[0].size;
			// if tower's top block's size is bigger than active's top block's size => valid => skip
			if (towerTopBlockSize > activeTowerTopBlockSize) return true;

			// if checks fail => invalid => remove from available towers
			return false;
		})

		setAvailableTowers(available);
	}, [activeTower]);

	const [moveCnt, setMoveCnt] = useState(0);

	const [isWon, setIsWon] = useState(false);

	function checkWon() {
		if (towers[0].blocks.length > 0) return;
		if (towers[1].blocks.length > 0) return;

		setIsWon(true);
	}

	function moveBlock(targetIndex: number) {
		const tower = towers[activeTower!];
		const targetTower = towers[targetIndex];

		const block = tower.blocks[0];
		tower.blocks.splice(0, 1);

		targetTower.blocks = [
			block,
			...targetTower.blocks
		];

		setTowers(towers);
		setMoveCnt((prev) => prev + 1);
		setActiveTower(null);
		checkWon();
	}

  	return (
		<div className="App">
			<div className={style["inputs-wrapper"]}>
				<div className={style.inputs}>
					<label htmlFor="tower-cnt">Number of blocks:</label>
					<input 
						id="tower-cnt"
						type="number" 
						ref={cntEl} 
						defaultValue={defaultBlocksCnt}
						min={minBlocksCnt}
						max={maxBlocksCnt}
					/>
					<button onClick={applyAndRestart}>Apply and restart</button>
					<button onClick={restart}>Restart</button>
					<button>Hint</button>
					<button>Undo</button>
					<button>Redo</button>
					<button>Solve</button>
				</div>

				<div className={style.inputs}>
					<p>Moves: {moveCnt}</p>
					<button>Show all</button>
				</div>
			</div>

			<BlocksCntContext.Provider value={blocksCnt}>
				<WonContext.Provider value={isWon}>
					<main className={`
						${style["game-area"]}
						${isWon ? style["game-area--won"] : ""}
					`}>
						{towers.map((tower, i) => (
							<Tower 
								key={i}
								{...tower} 
								available={availableTowers.includes(i)} 
								selected={activeTower === i}
								setSelected={setActiveTower}
								noneSelected={activeTower === null}
								moveBlockHere={() => {
									moveBlock(i);
								}}
							/>
						))}
					</main>
					{isWon && 
						<p className={style["gg-text"]}>GG!</p>
					}
				</WonContext.Provider>
			</BlocksCntContext.Provider>
    	</div>
  	);
}

export default App
