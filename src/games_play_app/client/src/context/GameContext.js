import { createContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import * as gameService from '../services/gameService';

export const GameContext = createContext();

const gameReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_GAMES':
            return action.payload.map(g => ({ ...g, comments: [] }));
        case 'ADD_GAME':
            return [...state, action.payload];
        case 'FETCH_GAME-DETAILS':
        case 'EDIT_GAME':
            return state.map(g => g._id === action.gameId ? action.payload : g);
        case 'ADD_COMMENT':
            return state.map(g => g._id === action.gameId ? { ...g, comments: [...g.comments, action.payload] } : g);
        case 'DELETE_GAME':
            return state.filter(g => g._id !== action.gameId);
        default:
            return state
    }
}

export const GameProvider = ({ children }) => {

    const [games, dispatcher] = useReducer(gameReducer, []);
    const navigate = useNavigate();

    useEffect(() => {
        gameService.getAll()
            .then(result => {
                const action = {
                    type: 'ADD_GAMES',
                    payload: result
                }
                dispatcher(action);
            });
    }, []);

    const selectGame = (gameId) => {
        return games.find(g => g._id === gameId) || {};
    };

    const fetchGameDetails = (gameId, gameDetails) => {
        dispatcher({
            type: 'FETCH_GAME-DETAILS',
            payload: gameDetails,
            gameId,
        });
    };

    const addComment = (gameId, comment) => {
        dispatcher({
            type: 'ADD_COMMENT',
            payload: comment,
            gameId
        });

        // setGames(state => {
        //     const game = state.find(g => g._id === gameId);
        //     const comments = game.comments || [];
        //     comments.push(comment);

        //     return [
        //         ...state.filter(g => g._id !== gameId),
        //         { ...game, comments },
        //     ]
        // });
    };

    const gameAdd = (gameData) => {
        // setGames(state => [
        //     ...state,
        //     gameData,
        // ]);

        dispatcher({
            type: 'ADD_GAME',
            payload: gameData
        })

        navigate('/catalog');
    };

    const gameEdit = (gameId, gameData) => {
        // setGames(state => state.map(g => g._id === gameId ? gameData : g));
        dispatcher({
            type: 'EDIT_GAME',
            payload: gameData,
            gameId
        })
    };

    const gameDelete = (gameId) => {
        dispatcher({
            type: 'DELETE_GAME',
            gameId
        });
    };

    return (
        <GameContext.Provider value={{ games, gameAdd, gameEdit, addComment, fetchGameDetails, selectGame, gameDelete }}>
            {children}
        </GameContext.Provider>
    );
};