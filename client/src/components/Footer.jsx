import React from 'react';
import styled from 'styled-components';

function Footer() {
  return (
    <FooterStyled>Footer</FooterStyled>
  )
}

const FooterStyled = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(1, 2, 1, 0.9);
    height: 15%;
    width: 100%;
`

export default Footer;