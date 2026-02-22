export const WinMessage = ({moves, onReset, time, newRecords}) => {
    return(
        <div className="win-message">
            <div className="win-modal">
                <h2> 🎉 Congratulations!! </h2>
                <p> You completed the game in <strong> {moves} moves </strong> </p> 
                <p> and took <strong> {time} </strong>. </p>

                {(newRecords.time || newRecords.moves || newRecords.game) && (
                    <div className="new-record">
                        {newRecords.game && (
                            <div className="record">
                                New Best Game!
                            </div>
                        )}

                        {newRecords.moves && (
                            <div className="record">
                                New Best Moves!
                            </div>
                        )}

                        {newRecords.time && (
                            <div className="record">
                                New Best Time!
                            </div>
                        )}
                    </div>
                )}

                <button className="reset-btn" onClick={onReset}> Play Again </button>
            </div>
        </div>
    );
};
