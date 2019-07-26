import styled from 'react-emotion';

import { flex, alignCenter } from './Flex.js';

const Navbar = styled('nav')`
	background: grey;
	color: #fff;
	padding: 1rem;
	font-weight: bold;
	${flex};
	${alignCenter};
`;

export default Navbar;