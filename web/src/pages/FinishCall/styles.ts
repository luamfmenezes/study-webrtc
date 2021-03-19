import styled from "styled-components";

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: #16151a;
  display: flex;
  margin: 0;
  padding: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    color: #fff;
  }
  button {
    border: 0;
    padding: 16px 32px;
    border-radius: 8px;
    background: #fd0065;
    margin-top: 16px;
    transition: 0.2s;
    color: #fff;
    cursor: pointer;
    font-weight: bold;
    &:hover {
      transform: scale(1.1);
    }
  }
`;
