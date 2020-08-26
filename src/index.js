import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

function Dot(props){
	const color = props.color;
	return (
		<button className={["dot", color].join(" ")} onClick={props.onClick}>
			<span className="dot-mark">
				{props.mark}
			</span>
		</button>
	);
}

function Circle(props) {
	let styles = {
		width: 60 * props.rl,
		height: 60 * props.rl,
		top: (10 - props.ry - props.rl) * 30 + 15,
		left: (props.rx - props.rl + 10) * 30 + 15,
		borderRadius: props.rl * 60
	}
	return (
		<div className="circle" style={styles}></div>
	);
}

function Points(props) {
	return (
		<p>
			{props.abc}: ({props.xy[0]}, {props.xy[1]})
		</p>
	);
}

function CircleData(props) {
	return (
		<p>
			中心: ({props.rx},{props.ry}) 半径: {props.rl}
		</p>
	)
}

class Board extends React.Component {
	constructor(props) {
		var tbl = new Array(21);
		for (let i = 0; i < 21; i++) {
			tbl[i] = new Array(21).fill('・');
		}
		super(props);
		this.state = {
			table: tbl,
			xy: [[null, null], [null, null], [null, null]],
			rx: null,
			ry: null,
			rl: null
		}
	}
	calculate() {
		const xy = this.state.xy.slice();
		const ax = xy[0][0];
		const ay = xy[0][1];
		const bx = xy[1][0];
		const by = xy[1][1];
		const cx = xy[2][0];
		const cy = xy[2][1];
		const abx = ax - bx;
		const aby = ay - by;
		const cbx = cx - bx;
		const cby = cy - by;
		const rx = (cby * (abx * (ax + bx) + aby * (ay + by)) - aby * (cbx * (cx + bx) + cby * (cy + by))) / (2 * abx * cby - 2 * aby * cbx);
		const ry = (-cbx * (abx * (ax + bx) + aby * (ay + by)) + abx * (cbx * (cx + bx) + cby * (cy + by))) / (2 * abx * cby - 2 * aby * cbx);
		const rl = Math.sqrt(((ax - rx) ** 2 + (ay - ry) ** 2));
		console.log(rx, ry, rl)
		this.setState({ rx: rx })
		this.setState({ ry: ry })
		this.setState({ rl: rl })
	}
	handleClick(i, j) {
		if (this.state.xy[2][0] != null) {
			this.calculate()
			return;
		} else {
			const table = this.state.table.slice();
			table[i][j] = '◉';
			this.setState({ table: table });
			const xy = this.state.xy.slice();
			for (let k = 0; k < 3; k++) {
				if (xy[k][0] === null) {
					xy[k] = [j - 10, 10 - i];
					break
				} else {
					continue;
				}
			}
			this.setState({ xy: xy })
		}
	}
	renderDots(i, j, color) {
		return (
			<Dot mark={this.state.table[i][j]} color={color} onClick={() => this.handleClick(i, j)} />
		);
	}
	render() {
    const dots = [];
		for (let i = 0; i < 21; i++) {
			let row_dot = [];
			for (let j = 0; j < 21; j++) {
				if (i === 10 || j === 10) {
					row_dot.push(
						this.renderDots(i, j, 'dark')
					);
				} else {
					row_dot.push(
						this.renderDots(i, j, 'gray')
					);
				}
			}
			dots.push(
				<div>
					{row_dot}
				</div>
			);
    }
		return (
			<div>
				<div className="container">
					<h1>3点を選んで円を作ろう</h1>
					<p>点を３つ選んで、最後にどこかをクリック！</p>
					<div className="calculate">
						<div className="data">
							<Points abc={'A'} xy={this.state.xy[0]}/>
							<Points abc={'B'} xy={this.state.xy[1]} />
							<Points abc={'C'} xy={this.state.xy[2]} />
							<CircleData rx={this.state.rx} ry={this.state.ry} rl={this.state.rl} />
						</div>
					</div>
					<div className="board-size">21 x 21</div>
					<div className="board">
						{dots}
						<Circle rx={this.state.rx} ry={this.state.ry} rl={this.state.rl} />
					</div>
				</div>
				
			</div>
    );
  }			
}

ReactDOM.render(
  <Board />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
