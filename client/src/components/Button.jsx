import React from 'react'
import styled from 'styled-components'

function Button({ name, bg, padd, onClick, color, bdRad, hoverBg, hoverColor }) {
    return (
        <ButtonStyled
          style={{
              backgroundColor: bg,
              padding: padd,
              borderRadius: bdRad,
              color: color,
          }}
          onClick={onClick}
          hoverColor={hoverColor}
          hoverBg={hoverBg}
        >
            {name}
        </ButtonStyled>
    )
}

const ButtonStyled = styled.button`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 20px;
  width: 30%;
  border: none;
  border-radius: 5px;
  transition: all .2s ease-in-out;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
  }
  &:enabled {
    opacity: 1.0;
  }
`;


export default Button;