import { createContext, useRef, useState } from 'react'
import { Tower } from './components';
import { Tower as TowerProps } from './types';

const defaultBlocksCnt = 3;
export const BlocksCntContext = createContext(defaultBlocksCnt);

function App() {
	const [blocksCnt, setBlocksCnt] = useState(defaultBlocksCnt);
	const cntEl = useRef<HTMLInputElement>(null);

	function restart() {
		const newCnt = +(cntEl.current?.value ?? defaultBlocksCnt);
		setBlocksCnt(newCnt);
	}

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
	
  	return (
		<div className="App">
			<label htmlFor="tower-cnt">Number of blocks:</label>
			<input 
				id="tower-cnt"
				type="number" 
				ref={cntEl} 
				defaultValue={defaultBlocksCnt}
			/>
			<button onClick={restart} >Apply and restart</button>

			<BlocksCntContext.Provider value={blocksCnt}>
				<div>
					<Tower {...tower1}/>
					<Tower {...tower2}/>
					<Tower {...tower3}/>
				</div>
			</BlocksCntContext.Provider>
    	</div>
  	)
}

export default App
