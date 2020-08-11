import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import styled from 'styled-components';

import ProfilePicture from '../images/profile_picture.png'

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8% 0 2% 0;
  padding: 0 1% 0 1%;
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  border: .13rem solid #ffffff;
`;

const Header = ({ siteTitle, author }) => (
    <HeaderContainer>
      <h1>
        <Link to="/">
          {siteTitle}
        </Link>, by {author}
      </h1>
      <a href="https://www.linkedin.com">
        <ProfileImage className="profile-picture" src={ProfilePicture} alt="Michael Agard"/>
      </a>
    </HeaderContainer>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
