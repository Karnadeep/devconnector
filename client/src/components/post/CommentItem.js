import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Moment from "react-moment";
import { removeComment } from "../../actions/post";

const CommentItem = ({
  postId,
  removeComment,
  auth,
  comment: { _id, user, name, text, avatar, date },
}) => {
  return (
    <Fragment>
      <div className="post bg-white p-1 my-1">
        <div>
          <Link to={`/profile/${user}`}>
            <img className="round-img" src={avatar} alt="" />
            <h4>{name}</h4>
          </Link>
        </div>
        <div>
          <p className="my-1">{text}</p>
          <p className="post-date">
            Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
          </p>
          {!auth.laoding && user === auth.user._id && (
            <button
              className="btn btn-danger"
              onClick={(e) => {
                removeComment(postId, _id);
              }}
            >
              <span>
                <i className="fas fa-times"></i>
              </span>
            </button>
          )}
        </div>
      </div>
    </Fragment>
  );
};

CommentItem.propTypes = {
  removeComment: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { removeComment })(CommentItem);
