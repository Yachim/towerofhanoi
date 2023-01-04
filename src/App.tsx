import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Tower } from './components';
import { Tower as TowerProps } from './types';
import "./style/App.global.scss";
import style from "./style/App.module.scss";;

const defaultBlocksCnt = 3;
const maxBlocksCnt = 10;
const minBlocksCnt = 3;
export const BlocksCntContext = createContext(defaultBlocksCnt);
export const WonContext = createContext(false);
export const ShowNumberContext = createContext(true);

const defaultTowers: [TowerProps, TowerProps, TowerProps] = [
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

		setMoves([[
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
		]]);

		setActiveTower(null);
		setAvailableTowers([]);
		setIsWon(false);
		setMoveCnt(0);
		setCurrentMove(0);
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

		available = available.filter((availableIndex) => {
			const tower = moves[currentMove][availableIndex];
			
			// if tower does not contain blocks => skip
			if (tower.blocks.length === 0) return true;

			const activeTowerTopBlockSize = moves[currentMove][activeTower].blocks[0].size;
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

	const [moves, setMoves] = useState<[TowerProps, TowerProps, TowerProps][]>([defaultTowers]);
	const [currentMove, setCurrentMove] = useState(0);

	useEffect(() => {
		if (moves[currentMove][0].blocks.length > 0) return;
		if (moves[currentMove][1].blocks.length > 0) return;

		setIsWon(true);
	}, [moves, currentMove]);

	function moveBlock(targetIndex: number) {
		// deep clone
		const towers: [TowerProps, TowerProps, TowerProps] = JSON.parse(JSON.stringify(moves[currentMove]));

		const tower = towers[activeTower!];
		const targetTower = towers[targetIndex];

		const block = tower.blocks[0];
		tower.blocks.splice(0, 1);

		targetTower.blocks = [
			block,
			...targetTower.blocks
		];

		setMoveCnt((prev) => prev + 1);
		setActiveTower(null);
		setMoves((prev) => [
			...prev.slice(0, currentMove + 1),
			towers
		]);
		setCurrentMove((prev) => prev + 1);
	}

	const minimumMoves = useMemo(() => {
		let sum = 0;
		for (let i = 1; i <= blocksCnt; i++) {
			sum *= 2;
			sum += 1;
		}
		return sum;
	}, [blocksCnt]);

	const handleKeyPress = useCallback((e: KeyboardEvent) => {
		if (isWon) return;

		if (["u", "e", "U", "E"].includes(e.key)) {
			if (["u", "U"].includes(e.key)) undo();
			else if (["e", "E"].includes(e.key)) redo();

			return;
		};

		if (!["1", "2", "3"].includes(e.key)) return;
		const key = +e.key - 1;

		if (activeTower === null) {
			if (moves[currentMove][key].blocks.length === 0) return;
			setActiveTower(key);
		}
		else {
			if (activeTower === key) {
				setActiveTower(null);
			}
			else if (!availableTowers.includes(key)) return;
			else {
				moveBlock(key);
			}
		}	
	}, [availableTowers, activeTower, moves, currentMove]);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyPress);

		return () => document.removeEventListener("keydown", handleKeyPress);
	}, [handleKeyPress]);

	const [showNumbers, setShowNumbers] = useState(true);

	function undo() {
		if (currentMove === 0) return;
		if (isWon) setIsWon(false);
		setActiveTower(null);

		setCurrentMove((prev) => prev - 1);
	}

	function redo() {
		if (currentMove === moves.length - 1 || isWon) return;
		setActiveTower(null);

		setCurrentMove((prev) => prev + 1);
	}

  	return (
		<div className="App">
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
				<button onClick={undo}>Undo</button>
				<button onClick={redo}>Redo</button>
			</div>

			<ShowNumberContext.Provider value={showNumbers}>
				<BlocksCntContext.Provider value={blocksCnt}>
					<WonContext.Provider value={isWon}>
						<main className={`
							${style["game-area"]}
							${isWon ? style["game-area--won"] : ""}
						`}>
							{moves[currentMove].map((tower, i) => (
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
			</ShowNumberContext.Provider>

			<div className={style["bottom-wrapper"]}>
				<div className={style.inputs}>
					<label htmlFor="show-numbers">Show numbers</label>
					<input 
						id="show-numbers" 
						type="checkbox" 
						checked={showNumbers}
						onChange={() => setShowNumbers(prev => !prev)}
					/>
				</div>

				<div className={style.inputs}>
					<p>Moves: {currentMove}/{moveCnt} (minumum: {minimumMoves})</p>
					<button>Show all</button>
				</div>
			</div>
    	</div>
  	);
}

export default App
