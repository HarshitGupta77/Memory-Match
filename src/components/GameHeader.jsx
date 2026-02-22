import { DIFFICULTIES } from "../config/difficulty";

export const GameHeader = ({score, moves, onReset, difficulty, setDifficulty}) => {
    return (
        <div className="game-header">
            <h1> 🎮 Memory Match </h1>

            <div className="stats">
                <div className="stat-item"> 
                    <span className="stat-label"> Score: </span> 
                    <span className="stat-value"> {score} </span> 
                </div>
                <div className="stat-item">
                    <span className="stat-label"> Moves: </span> 
                    <span className="stat-value"> {moves} </span> 
                </div>
            </div>

            <div className="difficulty">
                {Object.entries(DIFFICULTIES).map(([key, value]) => (
                    <button 
                        key={key}
                        className={`reset-btn ${difficulty === key ? "active" : ""}`}
                        onClick={() => setDifficulty(key)}
                    >
                        {value.label} ({value.rows}x{value.cols})
                    </button>
                ))}

                <button className="reset-btn" onClick={onReset}> Reset Game </button> 
            </div>
            
        </div>
    );
};
