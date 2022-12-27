import { createContext, useEffect, useMemo, useRef, useState } from 'react'
import { Tower } from './components';
import { Tower as TowerProps } from './types';
import "./style/App.global.scss";
import style from "./style/App.module.scss";;

const defaultBlocksCnt = 3;
const maxBlocksCnt = 20;
const minBlocksCnt = 3;
export const BlocksCntContext = createContext(defaultBlocksCnt);

const defaultTowers: TowerProps[] = [
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
];

function App() {
	const [blocksCnt, setBlocksCnt] = useState(defaultBlocksCnt);
	const cntEl = useRef<HTMLInputElement>(null);

	const [towers, setTowers] = useState<TowerProps[]>(defaultTowers);

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
		let blocks = [];
		for (let i = 1; i <= blocksCnt; i++) {
			blocks.push({
				size: i
			});
		}

		setTowers(defaultTowers);
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

		available.forEach((availableIndex, i) => {
			const tower = towers[availableIndex];
			
			// if tower does not contain blocks => skip
			if (tower.blocks.length === 0) return;

			const activeTowerTopBlock = towers[activeTower].blocks[0];
			const towerTopBlock = tower.blocks[0];
			// if tower's top block's size is bigger than active's top block's size => valid => skip
			if (towerTopBlock > activeTowerTopBlock) return;

			// if checks fail => invalid => remove from available towers
			available.splice(i, 1);
		})

		setAvailableTowers(available);
	}, [activeTower]);

	const [moveCnt, setMoveCnt] = useState(0);

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
				<main className={style["game-area"]}>
					{towers.map((tower, i) => (
						<Tower 
							{...tower} 
							available={availableTowers.includes(i)} 
							selected={activeTower === i}
							setSelected={setActiveTower}
						/>
					))}
				</main>
			</BlocksCntContext.Provider>
    	</div>
  	);
}

export default App
