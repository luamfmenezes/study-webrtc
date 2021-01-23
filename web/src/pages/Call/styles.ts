import styled, { css } from "styled-components";

interface IUser {
  isOnCall: boolean;
}

export const Container = styled.div`
  height: 100vw;
  height: 100vh;
  display: flex;
  background: #16151a;
  color: #ded9ef;
  * {
    outline: 0;
    border: 0;
  }
`;
export const Content = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const Users = styled.div<IUser>`
  width: 400px;
  height: 100%;
  padding: 32px;
  box-sizing: border-box;
  overflow: hidden;
  transition: 0.2s;
  h1 {
    font-size: 20px;
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    svg {
      margin-right: 16px;
    }
  }
  ${(props) =>
    props.isOnCall &&
    css`
      width: 0px;
      padding: 0px;
    `}
`;

export const User = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-radius: 8px;
  background: #1d1e23;
  padding: 16px;
  border: 0;
  margin-bottom: 10px;
  transition: 0.2s;
  cursor: pointer;
  div {
    display: flex;
    align-items: center;
    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-right: 16px;
    }
    p {
      color: #ded9ef;
    }
  }
  svg {
    opacity: 0;
    transition: 0.2s;
    fill: #7bff9e;
  }
  &:hover {
    svg {
      opacity: 1;
    }
  }
  &:active {
    transform: scale(0.98);
  }
`;

export const Video1 = styled.video`
  width: 160px;
  height: 90px;
  position: absolute;
  right: 32px;
  bottom: 32px;
  border-radius: 8px;
`;

export const Video2 = styled.video`
  width: 100%;
`;

export const Controllers = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 32px;
  button {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(#ed5e68, #fc7e87);
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0;
    cursor: pointer;
    transition: 0.2s;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
    &:active {
      transform: scale(0.98);
    }
    &:hover {
      box-shadow: 0 0 16px rgba(0, 0, 0, 0.1);
    }
  }
`;

export const ModalCalling = styled.div`
  position: absolute;
  padding: 32px;
  left: calc(50% - 150px);
  top: calc(50% - 150px);
  background: #1d1e23;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    font-size: 24px;
  }
  div {
    display: flex;
    margin-top: 16px;
    button {
      width: 48px;
      height: 48px;
      margin: 0 16px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      background: linear-gradient(#ed5e68, #fc7e87);
      align-items: center;
      border: 0;
      cursor: pointer;
      transition: 0.2s;
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
      &:active {
        transform: scale(0.98);
      }
      &:hover {
      }
    }
    button:nth-child(2) {
      background: linear-gradient(#7bff9e, #65f88c);
    }
  }
`;
