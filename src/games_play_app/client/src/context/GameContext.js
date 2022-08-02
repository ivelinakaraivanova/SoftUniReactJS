import { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as gameService from '../services/gameService';

export const GameContext = createContext();

const gameReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_GAMES':
            return [...action.payload]
        case 'ADD_GAME':
            return [...state, action.payload]
        case 'EDIT_GAME':
            return state.map(g => g._id === action.gameId ? action.payload : g)
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
                dispatcher(action)
            });
    }, []);

    const addComment = (gameId, comment) => {
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
    }

    return (
        <GameContext.Provider value={{ games, gameAdd, gameEdit, addComment }}>
            {children}
        </GameContext.Provider>
    );
};