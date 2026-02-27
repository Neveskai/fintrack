import React from "react";
import { Button as ChakraButton, type ButtonProps } from "@chakra-ui/react";

export const Button: React.FC<ButtonProps> = (props) => {
  return <ChakraButton {...props} borderRadius="md" />;
};
