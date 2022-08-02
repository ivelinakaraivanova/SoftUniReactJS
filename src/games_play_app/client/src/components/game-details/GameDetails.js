import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as gameService from '../../services/gameService';

export const GameDetails = ({ addComment }) => {

    const { gameId } = useParams();
    const [currentGame, setCurrentGame] = useState({});
    const [comment, setComment] = useState({
        username: '',
        comment: '',
    });

    const [error, setError] = useState({
        username: '',
        comment: '',
    });

    useEffect(() => {
        gameService.getOne(gameId)
            .then(result => {
                setCurrentGame(result);
            });
    });

    const addCommentHandler = (e) => {
        e.preventDefault();
        addComment(gameId, `${comment.username}: ${comment.comment}`);
    }

    const onChange = (e) => {
        setComment(state => ({
            ...state,
            [e.target.name]: e.target.value
        }));
    }

    const validateUsername = (e) => {
        const username = e.target.value;
        let errorMessage = '';

        if (username.length <= 4) {
            errorMessage = 'Username must be longer than 4 characters';
        } else if (username.length >= 10) {
            errorMessage = 'Username must be shorter than 10 characters';
        };

        setError(state => ({
            ...state,
            username: errorMessage,
        }));
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
                        {/* {currentGame.comments?.map(c =>
                            <li className="comment">
                                <p>{c}</p>
                            </li>
                        )} */}
                    </ul>

                    {/* Display paragraph: If there are no games in the database */}
                    {/* {!currentGame.comments &&
                        <p className="no-comment">No comments.</p>
                    } */}
                </div>
                {/* Edit/Delete buttons ( Only for creator of this game )  */}
                <div className="buttons">
                    <Link to={`/games/${currentGame._id}/edit`} className="button">
                        Edit
                    </Link>
                    <Link to="#" className="button">
                        Delete
                    </Link>
                </div>
            </div>
            {/* Bonus */}
            {/* Add Comment ( Only for logged-in users, which is not creators of the current game ) */}
            <article className="create-comment">
                <label>Add new comment:</label>
                <form className="form" onSubmit={addCommentHandler}>
                    <input
                        type="text"
                        name="username"
                        placeholder="John Doe"
                        onChange={onChange}
                        onBlur={validateUsername}
                        value={comment.username}
                    />

                    {error.username &&
                        <div style={{ color: 'red' }}>{error.username}</div>
                    }

                    <textarea
                        name="comment"
                        placeholder="Comment......"
                        onChange={onChange}
                        value={comment.comment}
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