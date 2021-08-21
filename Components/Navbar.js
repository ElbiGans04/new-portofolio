import styled from 'styled-components';
import Link from 'next/link'

function NavBar ({active}) {
    return (
        <Navbar>
            <NavbarHead>
                <Link href="/">
                    <NavbarHeadItem>
                        Elbi
                    </NavbarHeadItem>
                </Link>
            </NavbarHead>

            <NavbarMain>
                <Link href="/about" as="/about/f">
                    <ItemsActive>
                            About
                    </ItemsActive>
                </Link>
                <Link href="/contact">
                    <Items>
                        Contact
                    </Items>
                </Link>
                <Link href="/projects">
                    <Items>
                        Projects
                    </Items>
                </Link>
                <Link href="/tools">
                    <Items>
                        Tools
                    </Items>
                </Link>
            </NavbarMain>
        </Navbar>
    );
}

export default NavBar;



// Styled Component
const Navbar = styled.nav`
    width: 100%;
    padding: 1rem 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: black;
`;

const NavbarHead = styled.div`
    width: 60%;
`;

const Items = styled.p`
    color: white;
    cursor: pointer;
    font-weight: bold;
`;

const NavbarHeadItem = styled(Items)`
    color: var(--pink);
    font-size: 2rem;
`;

const NavbarMain = styled.div`
    display: flex;
    width: 40%;
    justify-content: space-between;
    align-items: center;
`;

const ItemsActive = styled(Items)`
    background-color: var(--pink);
    padding: .8rem;
    border-radius: .8rem;
    color: var(--dark)
`;