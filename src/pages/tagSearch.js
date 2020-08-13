import React from 'react';
import { graphql, Link } from 'gatsby';
import styled from 'styled-components';
import './index.css'
import Layout from '../components/layout';

const BlogPostSummaryContainer = styled.div`
	background: rgb(12, 12, 12, .5);
	border-radius: .55rem;
	margin-bottom: 1%;
	padding: 3%;
	p {
		margin-bottom: 0px;
	}
`;

const tagSearch = ({ data }) => {
	const { edges } = data.allMarkdownRemark;

	return (
		<Layout>
			<div>
				{edges.map(edge => {
					const { frontmatter } = edge.node;
					return (
						<BlogPostSummaryContainer>
							<div key={frontmatter.path}>
								<Link to={frontmatter.path}>{frontmatter.title}</Link>
								<br/>
								<small>
									{' '}
									<em>published on</em> {frontmatter.date}
								</small>
								<p>{frontmatter.excerpt}</p>
								{/* <br /> */}
							</div>
						</BlogPostSummaryContainer>
					);
				})}
			</div>
		</Layout>
	);
};

export const query = graphql`
	query TagPageQuery {
		allMarkdownRemark(sort: { order: DESC, fields: frontmatter___date }) {
			totalCount
			edges {
				node {
					id
					frontmatter {
						title
						date(formatString: "MMMM DD, YYYY")
						path
						tags
						excerpt
					}
				}
			}
		}
	}
`;

export default tagSearch;