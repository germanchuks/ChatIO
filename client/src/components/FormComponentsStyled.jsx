import styled from "styled-components";

export const DivStyled = styled.div`
  background-color: #FFF;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  font-size: smaller;
  padding: 1.5rem;
  border: 0.5px solid #000;
`

export const LabelStyled = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: 'black';
  margin-top: 0.5rem;

`

export const ButtonStyled = styled.button`
  background-color: #002c6a;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 10px;
  margin-top: 10px;
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
  &:hover {
    background-color: #7F94B5;
  }
`