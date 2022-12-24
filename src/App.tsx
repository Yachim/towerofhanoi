import { useRef, useState } from 'react'

const defaultBlocksCnt = 3;

function App() {
	const [blocksCnt, setBlocksCnt] = useState(defaultBlocksCnt);
	const cntEl = useRef<HTMLInputElement>(null);

	function restart() {
		const newCnt = +(cntEl.current?.value ?? defaultBlocksCnt);
		setBlocksCnt(newCnt);
	}

	const [tower1, setTower1] = useState();
	const [tower2, setTower2] = useState();
	const [tower3, setTower3] = useState();
	
  	return (
		<div className="App">
			<label htmlFor="tower-cnt">Number of blocks:</label>
			<input type="number" ref={cntEl} />
			<button onClick={restart} >Apply and restart</button>
    	</div>
  	)
}

export default App
