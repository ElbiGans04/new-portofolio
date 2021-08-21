import styled from 'styled-components';
import Link from 'next/link'
import {useState} from 'react'

function NavBar ({active}) {
    let [navbarOpen, setNavbarOpen] = useState(false);
    return (
        <Navbar>
            <NavbarHead>
                <Link href="/">
                    <NavbarHeadItem>
                        Elbi
                    </NavbarHeadItem>
                </Link>
            </NavbarHead>

            <NavbarButton>
                <NavbarButtonInput defaultValue={navbarOpen} type="checkbox"></NavbarButtonInput>
                <NavbarButtonSpan></NavbarButtonSpan>
                <NavbarButtonSpan></NavbarButtonSpan>
                <NavbarButtonSpan></NavbarButtonSpan>
            </NavbarButton>

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
    display: grid;
    grid-template-columns: 2fr 1fr;
    justify-items: center;
    align-items: center;
    background-color: black;
    position: relative;
    
    @media (min-width: 768px) {
        & {
            grid-template-columns: 1fr 1fr;
        }
    }
`;

const NavbarButton = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index:3;
    position: relative;
    width: 40px;
    height: 100%;

    & input:checked ~ span:nth-child(2) {
        transform: rotate(45deg) translateY(15px) translateX(9px);;
    }
    
    & input:checked ~ span:nth-child(3) {
        display: none;
    }
    
    & input:checked ~ span:nth-child(4) {
        transform: rotate(-45deg) translateY(-13px) translateX(7px);;
    }
    @media (min-width: 768px) {
        & {
            display: none;
        }
    }
`;

const NavbarButtonInput = styled.input`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity:0;
    cursor: pointer;
`;

const NavbarButtonSpan = styled.span`
    width: 100%;
    height: 10%;
    background-color: var(--pink);
    transition: .5s;
`;

const NavbarHead = styled.div`
    justify-self: start;
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
    justify-content: space-between;
    align-items: center;
    width: 100%;
    @media (max-width: 768px) {
        & {
            top: -999px;
            left: 0;
            position: fixed;
            width: 100%;
            height: 100%;
            flex-direction: column;
            padding: 3rem 0;
            background-color: var(--dark);
        }
    }
`;

const ItemsActive = styled(Items)`
    background-color: var(--pink);
    padding: .8rem;
    border-radius: .8rem;
    color: var(--dark)
`;