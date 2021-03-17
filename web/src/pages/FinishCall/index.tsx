import React from "react";
import { useHistory } from "react-router";

import { Container } from "./styles";

const FinishCall: React.FC = () => {
  const { push } = useHistory();

  const handleBack = () => push("/");

  return (
    <Container>
      <h1>Calling was finished</h1>
      <button onClick={handleBack}>Back to room</button>
    </Container>
  );
};

export default FinishCall;
