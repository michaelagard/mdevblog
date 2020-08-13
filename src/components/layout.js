import React, { useState}  from 'react'
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import styled from 'styled-components'
import Header from "./header"

const WidthButton = styled.button`
  border: 0;
  padding: 0;
  line-height: 1;
  background: none;
  color: white;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
`;
const LayoutWrapper = styled.div`
  max-width: ${props => props.fullWidth ? '99%' : '600px'};
  margin: auto;
    @media (max-width: 768px) {
      width: 95%;
    }
`;

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
        author
      }
    }
  }
  `)

  const [widthToggle, setWidthToggle] = useState(false);

  return (
    <LayoutWrapper fullWidth={widthToggle}>
      <WidthButton onClick={() => setWidthToggle(!widthToggle)}>{widthToggle ? "><" : "<>"}</WidthButton>
      <Header siteTitle={data.site.siteMetadata.title} author={data.site.siteMetadata.author} />
      <div>
        <main>{children}</main>
      </div>
    </LayoutWrapper>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
