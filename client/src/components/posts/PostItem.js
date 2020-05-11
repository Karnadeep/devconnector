import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addLike, removeLike, deletePost } from "../../actions/post";
import Moment from "react-moment";

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  post: { _id, name, text, likes, comments, user, date, avatar },
  showActions,
}) => (
  <div class="post bg-white my-1 p-1">
    <div>
      <Link to={`/profile/${user}`}>
        <img src={avatar} alt="" class="round-img my-1" />
        <h4>{name}</h4>
      </Link>
    </div>
    <div>
      <p class="my-1">{text}</p>
      <p className="post-date">
        Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
      </p>
      {showActions && (
        <Fragment>
          <button onClick={(e) => addLike(_id)} class="btn">
            <i class="fas fa-thumbs-up"></i>{" "}
            <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
          </button>
          <button class="btn" onClick={(e) => removeLike(_id)}>
            <i class="fas fa-thumbs-down"></i>
          </button>
          <Link to={`/posts/${_id}`} class="btn btn-primary">
            Discusssion{" "}
            {comments.length > 0 && (
              <span className="comment-count">{comments.length}</span>
            )}
          </Link>
          {!auth.loading && user === auth.user._id && (
            <button onClick={(e) => deletePost(_id)} className="btn btn-danger">
              <i className="fas fa-times" />
            </button>
          )}
        </Fragment>
      )}
    </div>
  </div>
);
PostItem.propTypes = {
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

PostItem.defaultProps = {
  showActions: true,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
);
