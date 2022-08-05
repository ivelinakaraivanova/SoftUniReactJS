import { useContext, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GameContext } from "../../context/GameContext";
import { useAuthContext } from "../../context/AuthContext";
import * as gameService from '../../services/gameService';
import * as commentService from '../../services/commentService';

export const GameDetails = () => {
    const navigate = useNavigate();

    const { addComment, fetchGameDetails, selectGame, gameDelete } = useContext(GameContext);
    const { user } = useAuthContext();
    const { gameId } = useParams();

    const currentGame = selectGame(gameId);

    const isOwner = currentGame._ownerId === user._id;

    useEffect(() => {
        (async () => {
            const gameDetails = await gameService.getOne(gameId);
            const gameComments = await commentService.getByGameId(gameId);

            fetchGameDetails(gameId, { ...gameDetails, comments: gameComments.map(c => `${c.user.email}: ${c.text}`) });
        })();
    }, []);

    const addCommentHandler = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const comment = formData.get('comment');

        commentService.create(gameId, comment)
            .then(result => {
                addComment(gameId, comment);
            });
    };

    const gameDeleteHandler = (gameId) => {
        const confirmation = window.confirm('Are you shure you want to delete this game?');

        if (confirmation) {
            gameService.del(gameId)
                .then(() => {
                    gameDelete(gameId);
                    navigate('/catalog');
                });
        }
    }

    return (
        <section id="game-details">
            <h1>Game Details</h1>
            <div className="info-section">
                <div className="game-header">
                    <img className="game-img" src={currentGame.imageUrl} alt="" />
                    <h1>{currentGame.title}</h1>
                    <span className="levels">MaxLevel: {currentGame.maxLevel}</span>
                    <p className="type">{currentGame.category}y</p>
                </div>
                <p className="text">
                    {currentGame.summary}
                </p>
                {/* Bonus ( for Guests and Users ) */}
                <div className="details-comments">
                    <h2>Comments:</h2>
                    <ul>
                        {/* list all comments for current game (If any) */}
                        {currentGame.comments?.map(c =>
                            <li key={c} className="comment">
                                <p>{c}</p>
                            </li>
                        )}
                    </ul>

                    {/* Display paragraph: If there are no games in the database */}
                    {!currentGame.comments &&
                        <p className="no-comment">No comments.</p>
                    }
                </div>
                {/* Edit/Delete buttons ( Only for creator of this game )  */}
                {isOwner &&
                    <div className="buttons">
                        <Link to={`/games/${currentGame._id}/edit`} className="button">
                            Edit
                        </Link>
                        <button onClick={gameDeleteHandler} className="button">
                            Delete
                        </button>
                    </div>
                }
            </div>
            {/* Bonus */}
            {/* Add Comment ( Only for logged-in users, which is not creators of the current game ) */}
            <article className="create-comment">
                <label>Add new comment:</label>
                <form className="form" onSubmit={addCommentHandler}>
                    <textarea
                        name="comment"
                        placeholder="Comment......"
                    />
                    <input
                        className="btn submit"
                        type="submit"
                        value="Add Comment"
                    />
                </form>
            </article>
        </section>
    );
}