import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../../layouts/styles";
import { Form, FormGroup, Label, Input, Button } from "../../components/Form";

const LoginPage: React.FC<{ onLogin: (role: string) => void }> = ({ onLogin }) => {
  const [role, setRole] = useState<"customer" | "supplier" | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    const password = (e.target as any).password.value;
    
    // Mock login - just navigate based on role
    onLogin(role!);
    navigate(`/${role}`);
  };

  return (
    <Container>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Email</Label>
          <Input type="email" placeholder="enter your email" required />
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <Input type="password" placeholder="enter your password" required />
        </FormGroup>
        <Button type="submit">Sign In</Button>
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

export default LoginPage;