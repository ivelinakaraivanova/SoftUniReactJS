import { useContext } from "react";
import { Outlet, useParams, useNavigate, Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { GameContext } from "../../context/GameContext";

export const GameOwner = ({children}) => {
    const { selectGame} = useContext(GameContext);
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthContext();
    const {gameId} = useParams();

    const currentGame = selectGame(gameId);

    if (isAuthenticated && user._id !== currentGame._ownerId) {
        // return navigate ('/catalog', {replace: true});
        return <Navigate to='/catalog' replace />
    }

    return children ? children : <Outlet />;
}