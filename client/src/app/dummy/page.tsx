"use client";

import { create } from 'zustand';
// import styles from './page.module.css';
import { combine } from 'zustand/middleware';

function Square({ value, onSquareClick }: { value: string, onSquareClick: () => void }) {
    return (
        <button
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                backgroundColor: "#fff",
                border: "1px solid #999",
                outline: 0,
                borderRadius: 0,
                fontSize: '1rem',
                fontWeight: 'bold',
                color: "black"
            }}
            onClick={onSquareClick}
        >
            {value}
        </button>
    )
}

const useGameStore = create(
    combine({ history: [Array<string>(9).fill('')], currentMove: 0 }, (set) => {
        return {
            setHistory: (nextHistory: string[][] | ((prev: string[][]) => string[][])) => {
                set((state) => ({
                    history:
                        typeof nextHistory === 'function'
                            ? nextHistory(state.history)
                            : nextHistory,
                }))
            },
            setCurrentMove: (nextCurrentMove: number | ((prev: number) => number)) => {
                set((state) => ({
                    currentMove: 
                        typeof nextCurrentMove === 'function'
                            ? nextCurrentMove(state.currentMove)
                            : nextCurrentMove
                }))
            }
        }
    })
)

function calculateWinner(squares: string[]) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] !== '' && squares[b] === squares[a] && squares[c] === squares[a]) {
            return squares[a];
        }
    }

    return null;
}

function calculateTurns(squares: string[]) {
    return squares.filter((square) => square === '').length;
}

function calculateStatus(winner: string | null, turns: number, player: string) {
    if (!winner && !turns) {
        return 'Draw';
    } else if (winner) {
        return `Winner ${winner}`;
    } else {
        return `Next player: ${player}`;
    }
}

type BoardProps = {
    xIsNext: boolean;
    squares: string[];
    onPlay: (squares: string[]) => void;
}

function Board({ xIsNext, squares, onPlay }: BoardProps) {
    const player = xIsNext ? 'X' : 'O';

    const winner = calculateWinner(squares);
    const turns = calculateTurns(squares);
    const status = calculateStatus(winner, turns, player);

    function handleClick(i: number) {
        if (squares[i] || winner) {
            return;
        }

        const nextSquares = squares.slice();
        nextSquares[i] = player;
        onPlay(nextSquares);
    } 

    return (
        <>
            <div style={{ marginBottom: '0.5rem' }}>{status}</div>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gridTemplateRows: "repeat(3, 1fr)",
                    width: 'calc(3 * 2.5rem)',
                    height: 'calc(3 * 2.5rem)',
                    border: '1px solid #999',
                }}
            >
                {squares.map((square, index) => (
                    <Square key={index} value={square} onSquareClick={() => handleClick(index)} />
                ))}
            </div>
        </>
    )
}

function Game() {
    const history = useGameStore(state => state.history);
    const setHistory = useGameStore(state => state.setHistory);

    const currentMove = useGameStore(state => state.currentMove);
    const currentSquares = history[currentMove];
    const setCurrentMove = useGameStore(state => state.setCurrentMove);

    const xIsNext = currentMove % 2 === 0;

    function handlePlay(nextSquares: string[]) {
        const nextHistory = history.slice(0, currentMove + 1).concat([nextSquares]);
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove: number) {
        setCurrentMove(nextMove);
    }

    return (
        <div
            style={{
                fontFamily: 'monospace',
                margin: '2rem',
            }}        
        >
            <div>
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div style={{ marginLeft: '1rem' }}>
                <ol>
                    {history.map((_, historyIndex) => {
                        const description = 
                            historyIndex > 0
                                ? `Go to move #${historyIndex}`
                                : `Go to game start`

                        return (
                            <li key={historyIndex}>
                                <button onClick={() => jumpTo(historyIndex)}>
                                    {description}
                                </button>
                            </li>
                        )
                    })}
                </ol>
            </div>
        </div>
    )
}

export default function Page() {
    return (
        <div>
            <Game />
        </div>
    )
}