import { createContext, useEffect, useRef, useState } from 'react'
import { Tower } from './components';
import { Tower as TowerProps } from './types';
import "./style/App.global.scss";
import style from "./style/App.module.scss";;

const defaultBlocksCnt = 3;
const maxBlocksCnt = 20;
export const BlocksCntContext = createContext(defaultBlocksCnt);

function App() {
	const [blocksCnt, setBlocksCnt] = useState(defaultBlocksCnt);
	const cntEl = useRef<HTMLInputElement>(null);

	const [tower1, setTower1] = useState<TowerProps>({
		blocks: [
			{size: 1},
			{size: 2},
			{size: 3}
		],
		pos: 1
	});
	const [tower2, setTower2] = useState<TowerProps>({
		blocks: [],
		pos: 2
	});
	const [tower3, setTower3] = useState<TowerProps>({
		blocks: [],
		pos: 3
	});

	function restart() {
		if (!cntEl.current) return;
		if (isNaN(cntEl.current.value as any)) {
			cntEl.current.value = defaultBlocksCnt.toString();
			return;
		}

		let newCnt = +(cntEl.current.value);
		newCnt = Math.min(Math.max(1, newCnt), maxBlocksCnt);
		cntEl.current.value = newCnt.toString();

		let blocks = [];
		for (let i = 1; i <= newCnt; i++) {
			blocks.push({
				size: i
			});
		}

		setTower1({
			blocks: blocks,
			pos: 1
		});
		setTower2({
			blocks: [],
			pos: 2
		});
		setTower3({
			blocks: [],
			pos: 3
		});

		setBlocksCnt(newCnt);
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
						min={1}
						max={maxBlocksCnt}
					/>
					<button onClick={restart}>Apply and restart</button>
					<button>Restart</button>
					<button>Hint</button>
					<button>Solve</button>
				</div>

				<div className={style.inputs}>
					<p>Moves: {123}</p>
					<button>Show all</button>
				</div>
			</div>

			<BlocksCntContext.Provider value={blocksCnt}>
				<main className={style["game-area"]}>
					<Tower {...tower1}/>
					<Tower {...tower2}/>
					<Tower {...tower3}/>
				</main>
			</BlocksCntContext.Provider>
    	</div>
  	);
}

export default App
