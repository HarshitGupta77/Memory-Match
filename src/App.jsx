import { GameHeader } from "./components/GameHeader";
import { Card } from "./components/Card";
import { WinMessage } from "./components/WinMessage";
import { useGameLogic } from "./hooks/useGameLogic";
import { useEffect, useState, useMemo } from "react";
import { DIFFICULTIES } from "./config/difficulty";

function App() {
  // difficulty
  const [difficulty, setDifficulty] = useState("easy");

  const {rows, cols, fruits} = DIFFICULTIES[difficulty];
  const cardValues = useMemo(() => {
    return [...fruits, ...fruits];
  }, [difficulty]);

  // call game logic hook
  const {cards, score, moves, time, gameWon, initializeGame, handleCardClick, lastGameStats} = useGameLogic(cardValues, difficulty);

  // timer:
  const mins = Math.floor(time/60);
  const secs = time % 60;
  const formattedTime = `${mins}:${secs.toString().padStart(2,'0')}`;
  
  let printedTime;
  if (mins > 0) {
    if (mins > 1) {
      printedTime = `${mins} minutes `;
    } else {
      printedTime = `${mins} minute `;
    }

    if (secs !== 1) {
      printedTime += `${secs} seconds`;
    } else {
      printedTime += `${secs} second`;
    }

  } else {
    if (secs !== 1) {
      printedTime = `${secs} seconds`;
    } else {
      printedTime = `${secs} second`;
    }
  }

  // highscores:
  const [highscores, setHighScores] = useState ({
    easy: {time: 0, moves: 0, game: {moves: 0, time:0}},
    medium: {time: 0, moves: 0, game: {moves: 0, time:0}},
    hard: {time: 0, moves: 0, game: {moves: 0, time:0}}
  });
  
  const [records, setNewRecords] = useState({
    time: false,
    moves: false,
    game: false
  });

  useEffect(() => {
    setNewRecords({time: false, moves: false, game: false});
  }, [difficulty])

  useEffect(() => {
    if (!gameWon) {
      return;
    }

    const {moves: lastMoves, time: lastTime} = lastGameStats[difficulty];

    setHighScores(prev => {
      const current = prev[difficulty];
      
      const records = {
        time: current.time === 0 || lastTime < current.time,
        moves: current.moves === 0 || lastMoves < current.moves,
        game: current.moves === 0 
              || lastMoves < current.game.moves
              || (lastMoves === current.game.moves && lastTime < current.game.time)
      };

      setNewRecords(records);

      return {
        ...prev, 
        [difficulty] : {
          time: records.time ? lastTime : current.time,
          moves: records.moves ? lastMoves : current.moves,
          game: records.game ? {moves: lastMoves, time: lastTime} : current.game
        }
      };
    });

  }, [gameWon, lastGameStats, difficulty]);

  const currentHighScores = highscores[difficulty];
  const gridWidth = difficulty === "easy" ? 600 : 700;

  
  return (
    <>
      <div className="timer"> Time: {formattedTime} </div>

      <div className="highscore">
        <div className="highscore-title">
          {difficulty.toUpperCase()}:
        </div>

        <div className="score-item"> 
          <span className="lable"> 🏆 Best Time: </span>
          <span className="value"> 
            {Math.floor(currentHighScores.time/60)}: 
              {(currentHighScores.time%60).toString().padStart(2,'0')} 
          </span>
        </div>

        <div className="score-item"> 
          <span className="lable"> 🏆 Best Moves: </span>
          <span className="value"> {currentHighScores.moves} </span> 
        </div>

        <div className="score-item"> 
          <span className="lable"> 🏆 Best Game: </span>
          <span className="value">
            {currentHighScores.game.moves} moves <br />
            and {Math.floor(currentHighScores.game.time/60)}:{(currentHighScores.game.time%60).toString().padStart(2,'0')}
          </span>
        </div>

      </div>

      {gameWon && (
        <WinMessage moves={moves} onReset={initializeGame} 
                    time={printedTime} newRecords={records} />
      )}

      <div className="app">
        <div className="board" style={{maxWidth: `min(${gridWidth}px, 95vh)`}}>
          <GameHeader score = {score} moves = {moves} onReset={initializeGame} 
                      difficulty={difficulty} setDifficulty={setDifficulty} />

          <div 
            className="cards-grid" 
            style={{gridTemplateColumns: `repeat(${cols}, 1fr)`}}
          >
            {cards.map((card) => (
              <Card key={card.id} card = {card} onClick = {handleCardClick} />
            ))}
          </div>
        </div>

      </div>
    </>
  );
}

export default App;
