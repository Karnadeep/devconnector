import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addComment } from "../../actions/post";

const CommentForm = ({ postId, addComment }) => {
  const [text, setText] = useState("");

  return (
    <Fragment>
      <div class="post-form">
        <div class="post-form-header bg-primary">
          <h3>Leave a Comment...</h3>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addComment(postId, text);
            setText("");
          }}
          class="form my-1"
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            cols="30"
            rows="5"
            placeholder="Add a Comment"
          ></textarea>
          <input type="submit" value="Submit" class="btn btn-dark my-1" />
        </form>
      </div>
    </Fragment>
  );
};

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired,
};

export default connect(null, { addComment })(CommentForm);
