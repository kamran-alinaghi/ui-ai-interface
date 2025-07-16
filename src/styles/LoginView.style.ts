import styled from 'styled-components';

export const LoginWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f3f8;
`;

export const LoginForm = styled.form`
  background: #ffffff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 360px;
`;

export const LoginTitle = styled.h2`
  margin-bottom: 24px;
  font-size: 24px;
  color: #333;
  text-align: center;
`;

export const LoginInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;

  &:focus {
    border-color: #2a93f5;
    outline: none;
  }
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #2a93f5;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: #1d74c4;
  }
`;

export const ErrorText = styled.p`
  margin-top: 12px;
  color: #e53935;
  font-size: 14px;
  text-align: center;
`;
export const GoogleButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #fff;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #f5f5f5;
  }
`;

export const SecondaryButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #e0e0e0;
  color: #333;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  margin-top: 10px;
  cursor: pointer;

  &:hover {
    background-color: #d5d5d5;
  }
`;

export const Divider = styled.div`
  text-align: center;
  margin: 16px 0;
  color: #999;
  font-size: 14px;

  &::before,
  &::after {
    content: '';
    display: inline-block;
    width: 40%;
    height: 1px;
    background-color: #ccc;
    vertical-align: middle;
    margin: 0 8px;
  }
`;
