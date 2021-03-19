import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: #111;
`;

export const Content = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: 64px;
`;

export const UserName = styled.Text`
  color: #fff;
  font-size: 40px;
`;

export const SubText = styled.Text`
  color: #fff;
  font-size: 20px;
  margin-top: 8px;
`;

export const Controllers = styled.View`
  width: 100%;
  position: absolute;
  bottom: 32px;
  /* padding: 32px; */
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
`;

export const Button = styled.TouchableOpacity`
  width: 80px;
  height: 80px;
  background: #fd0065;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
`;
