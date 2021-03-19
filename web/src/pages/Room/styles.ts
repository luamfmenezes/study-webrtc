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
  flex-direction: column;
  * {
    outline: 0;
    border: 0;
  }
`;

export const Calling = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const RemoteVideos = styled.video`
  width: 640px;
  height: 320px;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #000;
  padding: 16px;
  transition: 0.2s;
  div {
    width: 220px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Controllers = styled.div`
  width: 220px;
  button {
    width: 48px;
    height: 48px;
    margin: 0 16px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    background: linear-gradient(#fd0065, #dd0065);
    align-items: center;
    border: 0;
    cursor: pointer;
    transition: 0.2s;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
    &:active {
      transform: scale(0.98);
    }
    &:hover {
      transform: scale(1.1);
    }
  }
`;

export const LocalVideo = styled.video`
  width: 220px;
  height: 120px;
  border-radius: 8px;
`;
