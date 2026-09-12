import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../../layouts/styles";
import { Form, FormGroup, Label, Input, Button } from "../../components/Form";

const RegisterPage: React.FC<{ onLogin: (role: string) => void }> = ({ onLogin }) => {
  const [role, setRole] = useState<"customer" | "supplier" | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = (e.target as any).name.value;
    const email = (e.target as any).email.value;
    const password = (e.target as any).password.value;
    setRole(role === "customer" ? "customer" : "supplier");
    onLogin(role!);
    navigate(`/${role}`);
  };

  return (
    <Container>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Name</Label>
          <Input type="text" placeholder="enter your name" required />
        </FormGroup>
        <FormGroup>
          <Label>Email</Label>
          <Input type="email" placeholder="enter your email" required />
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <Input type="password" placeholder="enter your password" required />
        </FormGroup>
        <Button type="submit">Sign Up</Button>
        <p>
          <a href="#" onClick={() => onLogin("customer")}>Continue as customer</a>
        </p>
        <p>
          <a href="#" onClick={() => onLogin("supplier")}>Continue as supplier</a>
        </p>
      </form>
    </Container>
  );
};

export default RegisterPage;