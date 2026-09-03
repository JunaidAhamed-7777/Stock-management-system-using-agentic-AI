import React from "react";
import { Container } from "./styles";
import FormCard from "../components/FormCard";
import { Form, FormGroup, Label, Input, Button } from "../components/Form";

const AuthLayout: React.FC<{ onLogin: (role: string) => void }> = ({ onLogin }) => {
  return (
    <Container>
      <h2>Stock Management System</h2>
      <FormCard>
        <h3>Sign In</h3>
        <Form onSubmit={({ email, password, role }) => onLogin(role)}>
          <FormGroup>
            <Label>Email</Label>
            <Input type="email" placeholder="enter your email" />
          </FormGroup>
          <FormGroup>
            <Label>Password</Label>
            <Input type="password" placeholder="enter your password" />
          </FormGroup>
          <Button type="submit">Sign In</Button>
          <p>
            Don't have an account? <a href="#" onClick={() => onLogin("customer")}>
              Register as customer
            </a>{" "}
            {"| "}
            <a href="#" onClick={() => onLogin("supplier")}>Register as supplier</a>
          </p>
        </Form>
      </FormCard>
    </Container>
  );
};

export default AuthLayout;