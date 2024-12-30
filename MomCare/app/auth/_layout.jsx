import { Redirect, Stack } from "expo-router";


const AuthLayout = () => {


  return (
    <>
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            headerShown: false, // Hide header for login
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            headerShown: false, // Hide header for signup
          }}
        />
        <Stack.Screen
          name="forgotpassword"
          options={{
            headerShown: false, // Hide header for forgot password
          }}
        />
      </Stack>
    </>
  );
};

export default AuthLayout;
