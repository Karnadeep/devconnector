import React, { Fragment, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createProfile } from "../../actions/profile";

const CreateProfile = ({ createProfile, history }) => {
  const [formData, setFormData] = useState({
    status: "",
    company: "",
    website: "",
    location: "",
    skills: "",
    githubusername: "",
    bio: "",
    twitter: "",
    facebook: "",
    youtube: "",
    linkedin: "",
    instagram: "",
  });

  const [displaySocilaInputs, toggleSocialInputs] = useState(false);
  const {
    status,
    company,
    website,
    location,
    skills,
    githubusername,
    bio,
    twitter,
    facebook,
    youtube,
    linkedin,
    instagram,
  } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    createProfile(formData, history);
  };

  return (
    <Fragment>
      <h1 class="large text-primary">Create Your Profile</h1>
      <p class="lead">
        <i class="fas fa-user"></i> Let's get some information to get your
        profile stand out
      </p>
      <small>* = required fields</small>
      <form class="form" onSubmit={(e) => onSubmit(e)}>
        <div class="form-group">
          <select name="status" value={status} onChange={(e) => onChange(e)}>
            <option value="0">Select Professional Status</option>
            <option value="Developer">Developer</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Manager">Manager</option>
            <option value="Student or Learning">Student or Learning</option>
            <option value="Instructor">Instructor</option>
            <option value="Intern">Intern</option>
            <option value="Other">Other</option>
          </select>
          <small class="form-text">
            Give us an idea of where you are at in your career
          </small>
        </div>
        <div class="form-group">
          <input
            type="text"
            name="company"
            value={company}
            onChange={(e) => onChange(e)}
            placeholder="Company"
          />
          <small class="form-text">
            Could be your own company or one you work for
          </small>
        </div>
        <div class="form-group">
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => onChange(e)}
            placeholder="Website"
          />
          <small class="form-text">
            Could be your own or a company website
          </small>
        </div>
        <div class="form-group">
          <input
            type="text"
            name="location"
            value={location}
            onChange={(e) => onChange(e)}
            placeholder="Location"
          />
          <small class="form-text">
            City & state suggested (eg. Boston, MA)
          </small>
        </div>
        <div class="form-group">
          <input
            type="text"
            value={skills}
            onChange={(e) => onChange(e)}
            placeholder="* Skills"
            name="skills"
          />
          <small class="form-text">
            Please use comma separated values (eg. HTML,CSS,JavaScript,PHP
          </small>
        </div>
        <div class="form-group">
          <input
            type="text"
            placeholder="Github Username"
            name="githubusername"
            value={githubusername}
            onChange={(e) => onChange(e)}
          />
          <small class="form-text">
            If you want your latest repos and a Github link, include your
            username
          </small>
        </div>
        <div class="form-group">
          <textarea
            placeholder="A short bio of yourself"
            name="bio"
            value={bio}
            onChange={(e) => onChange(e)}
          ></textarea>
          <small class="form-text">Tell us a little about yourself</small>
        </div>
        <div class="my-2">
          <button
            onClick={() => toggleSocialInputs(!displaySocilaInputs)}
            type="button"
            class="btn btn-light"
          >
            Add Social Network Links
          </button>
          <span>Optional</span>
        </div>

        {displaySocilaInputs && (
          <Fragment>
            <div class="form-group social-input">
              <i class="fab fa-twitter fa-2x"></i>
              <input
                type="text"
                placeholder="Twitter URL"
                name="twitter"
                value={twitter}
                onChange={(e) => onChange(e)}
              />
            </div>
            <div class="form-group social-input">
              <i class="fab fa-facebook fa-2x"></i>
              <input
                type="text"
                placeholder="Facebook URL"
                name="facebook"
                value={facebook}
                onChange={(e) => onChange(e)}
              />
            </div>
            <div class="form-group social-input">
              <i class="fab fa-youtube fa-2x"></i>
              <input
                type="text"
                placeholder="YouTube URL"
                name="youtube"
                value={youtube}
                onChange={(e) => onChange(e)}
              />
            </div>
            <div class="form-group social-input">
              <i class="fab fa-linkedin fa-2x"></i>
              <input
                type="text"
                placeholder="Linkedin URL"
                name="linkedin"
                value={linkedin}
                onChange={(e) => onChange(e)}
              />
            </div>
            <div class="form-group social-input">
              <i class="fab fa-instagram fa-2x"></i>
              <input
                type="text"
                placeholder="Instagram URL"
                name="instagram"
                value={instagram}
                onChange={(e) => onChange(e)}
              />
            </div>
          </Fragment>
        )}

        <input type="submit" class="btn btn-primary my-1" />
        <Link to="/dashboard" class="btn btn-light my-1">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
};

export default connect(null, { createProfile })(withRouter(CreateProfile));
