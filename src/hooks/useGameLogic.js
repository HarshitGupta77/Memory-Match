import { useEffect, useState, useRef } from "react";
import flip from "../assets/flip.mp3"
import match from "../assets/match.mp3"
import won from "../assets/won.mp3"

export const useGameLogic = (cardValues, difficulty) => {
    const [cards, setCards] = useState([])
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(0); 
    const [isLocked, setLocked] = useState(false);
    const [time, setTime] = useState(0);
    const timeRef = useRef(null);
    const [lastGameStats, setLastGameStats] = useState({
        easy: {moves: 0, time: 0},
        medium: {moves: 0, time: 0},
        hard: {moves: 0, time: 0}
    });

    const flipSound = new Audio(flip);
    flipSound.volume = 0.4;
    const matchSound = new Audio(match);
    const wonSound = new Audio(won);

    // set timer to 0 
    const resetTimer = () => {
        if (timeRef.current) {
            clearInterval(timeRef.current);
            timeRef.current = null;
        }
    };

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    const isFirstGame = useRef(true);

    const initializeGame = () => {
        flipSound.play();
        resetTimer();
        setTime(0);
        const timeout = isFirstGame.current ? 0 : 600;

        if (!isFirstGame.current) {
            setCards(prev => 
                prev.map(card => ({
                    ...card,
                    isFlipped: false,
                    isMatched: false
                }))
            );

            setLocked(true);
        }

        // Shuffle the cards 
        setTimeout(() => {
            const shuffled = shuffleArray(cardValues);

            const finalCards = shuffled.map((value, index) => ({
                id: index,
                value,
                isFlipped: false,
                isMatched: false,
            }));

            setCards(finalCards);
            console.log(finalCards);
            setMoves(0);
            setScore(0);
            setMatchedCards([]);
            setFlippedCards([]);
            setLocked(false);
            isFirstGame.current = false;
        }, timeout);
    };

    useEffect(() => {
        initializeGame();
    }, [cardValues]);

    // start timer on first click
    useEffect(() => {
        if (flippedCards.length === 1 && !timeRef.current) {
            timeRef.current = setInterval(() => {
                setTime(prev => prev + 1);
            }, 1000);
        }
    }, [flippedCards]);

    const handleCardClick = (card) => {
        // Check if card already flipped or matched 
        if (card.isFlipped || card.isMatched || isLocked || flippedCards.length === 2) {
        return;
        }

        flipSound.play();

        const newCards = cards.map((c) => {
        if (c.id === card.id) {
            return {...c, isFlipped: true};
        } else {
            return c;
        }
        });

        setCards(newCards);

        const newFlippedCards = [...flippedCards, card.id];
        setFlippedCards(newFlippedCards);

        // check for a match
        if (flippedCards.length === 1) {
        setLocked(true);
        const firstCard = cards[flippedCards[0]];

        if (firstCard.value === card.value) {
            matchSound.play();
            setTimeout(() => {
            setMatchedCards((prev) => [...prev, firstCard.id, card.id]);
            setScore((prev) => prev + 1);
            
            setCards((prev) => 
                prev.map((c) => {
                if (c.id === card.id || c.id === firstCard.id) {
                    return {...c, isMatched: true};
                } else {
                    return c;
                }
                })
            );
            
            setFlippedCards([]);
            setLocked(false);
            }, 250);

        } else {
            // flip back cards 
            setTimeout(() => {
            const flippedBackCards = newCards.map((c) => {
                if (newFlippedCards.includes(c.id) || c.id === card.id) {
                return {...c, isFlipped: false};
                } else {
                return c;
                }
            });

            setCards(flippedBackCards);
            setFlippedCards([]);
            setLocked(false);
            }, 500);
        }

        setMoves((prev) => prev + 1);
        }
    };

    const gameWon = matchedCards.length === cardValues.length;

    // stop timer on win/reset
    useEffect(() => {
        if (!gameWon) {
            return;
        }

        if (gameWon && timeRef.current) {
            clearInterval(timeRef.current);
            timeRef.current = null;
            wonSound.play();
        }
        setLastGameStats(prev => ({
            ...prev,
            [difficulty]: {moves, time} 
        }));
    }, [gameWon, difficulty]);

    useEffect(() => {
        console.log(lastGameStats);
    }, [lastGameStats]);

    return {cards, score, moves, time, gameWon, initializeGame, handleCardClick, lastGameStats};
};
