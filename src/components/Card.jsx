export const Card = ({card, onClick}) => {
    return (
        <div className="card" onClick={() => onClick(card)}>

            <div className={`card-inner ${card.isFlipped ? "flipped" : ""} 
                                        ${card.isMatched ? "matched" : ""} `} >
                <div className="card-front"> ? </div>
                <div className="card-back"> {card.value} </div>

            </div>
        </div>
    );
};
