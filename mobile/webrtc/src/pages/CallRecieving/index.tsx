import { useNavigation } from "@react-navigation/core";
import React from "react";
import { Text } from "react-native";

import {
  Container,
  Content,
  UserName,
  SubText,
  Controllers,
  Button,
  ButtonText,
} from "./styles";

const CallRecieving: React.FC = () => {
  const { navigate } = useNavigation();

  const handleDenied = () => {
    // Return home and send socket canceling
    navigate("Home");
  };

  const handleAnswer = () => {
    navigate("Call", { roomId: "roomId" });
  };

  return (
    <Container>
      <Content>
        <UserName>Intercom 1</UserName>
        <SubText>is Calling</SubText>
      </Content>
      <Controllers>
        <Button onPress={handleDenied}>
          <ButtonText>Denied</ButtonText>
        </Button>
        <Button onPress={handleAnswer} style={{ backgroundColor: "#00bf7c" }}>
          <ButtonText>Answer</ButtonText>
        </Button>
      </Controllers>
    </Container>
  );
};

export default CallRecieving;
