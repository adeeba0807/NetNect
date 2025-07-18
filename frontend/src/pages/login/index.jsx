import UserLayout from '@/layout/UserLayout';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from "./style.module.css";
import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { emptyMessage } from '@/config/redux/reducer/authReducer';

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [userLoginMethod, setUserLoginMethod] = useState(false); // false = Sign Up
  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
  if (authState.registered) {
    router.push("/dashboard"); // Redirect to dashboard after registration
  }
}, [authState.registered]);


  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod]);

  const handleRegister = () => {
    dispatch(registerUser({ username, password, email, name }));
  };

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardleft__heading}>
              {userLoginMethod ? "Sign In" : "Sign Up"}
            </p>

            <p style={{ color: authState.isError ? "red" : "green" }}>
              {authState.message?.message || authState.message || ""}
            </p>

            <div className={styles.inputContainers}>
              {!userLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.inputField}
                    type='text'
                    placeholder='Username'
                  />
                  <input
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                    type='text'
                    placeholder='Name'
                  />
                </div>
              )}

              <input
                onChange={(e) => setEmailAddress(e.target.value)}
                className={styles.inputField}
                type='email'
                placeholder='Email'
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                type='password'
                placeholder='Password'
              />

              <div
                onClick={() => {
                  userLoginMethod ? handleLogin() : handleRegister();
                }}
                className={styles.buttonWithoutline}
              >
                <p>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
              </div>
            </div>
          </div>

          <div className={styles.cardContainer_right}>
            <p>
              {userLoginMethod
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>

            <div
              onClick={() => setUserLoginMethod(!userLoginMethod)}
              style={{ color: "black", textAlign: "center" }}
              className={styles.buttonWithOutline}
            >
              <p>{userLoginMethod ? "Sign Up" : "Sign In"}</p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
