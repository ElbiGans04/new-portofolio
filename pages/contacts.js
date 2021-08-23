import Head from 'next/head'
import styled from 'styled-components'
import {IoLogoGithub, IoLogoFacebook, IoMail} from 'react-icons/io5'
import Text from '../Components/Text'
function Contacts () {
    return (
        <>
            <Head>
                <title>Let's Connect with me</title>
            </Head>
            <Text size={3}>
                <span>Contacts</span>
            </Text>
            <Text size={2} margin="1rem 0 0 0">
                interested in me? Please contact me 
            </Text>
            <ContainerIcon>
                <a href="https://github.com/ElbiGans04">
                    <IoLogoGithub color="white" size="2rem" title="github account"/>
                </a>
                <a href="https://www.facebook.com/rhafael.bijaksana04">
                    <IoLogoFacebook color="white" size="2rem" title="facebook account"/>
                </a>
                <a href="mailto:rhafaelbijaksana04@gmail.com">
                    <IoMail color="white" size="2rem" title="email account"/>
                </a>
            </ContainerIcon>

        </>
    )
}

export default Contacts;

const ContainerIcon = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    margin-top: 5rem;
    

    & a {
        margin: 0 1rem;
    }
`;