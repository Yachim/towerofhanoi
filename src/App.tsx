import { createContext, useEffect, useRef, useState } from 'react'
import { Tower } from './components';
import { Tower as TowerProps } from './types';
import "./style/App.global.scss";
import style from "./style/App.module.scss";;

const defaultBlocksCnt = 3;
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
		if (!isNaN(cntEl.current.value as any)) {
			cntEl.current.value = defaultBlocksCnt.toString();
			return;
		}

		let newCnt = +(cntEl.current.value);
		newCnt = Math.min(Math.max(1, newCnt), 99);
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
			<BlocksCntContext.Provider value={blocksCnt}>
				<main>
					<Tower {...tower1}/>
					<Tower {...tower2}/>
					<Tower {...tower3}/>
				</main>
			</BlocksCntContext.Provider>

			<div className={style.inputs}>
				<label htmlFor="tower-cnt">Number of blocks:</label>
				<input 
					id="tower-cnt"
					type="number" 
					ref={cntEl} 
					defaultValue={defaultBlocksCnt}
					min={1}
					max={99}
				/>
				<button onClick={restart}>Apply and restart</button>
				<button>Log</button>
				<button>Restart</button>
				<button>Solve</button>
				<button>Hint</button>
			</div>
    	</div>
  	);
}

export default App
