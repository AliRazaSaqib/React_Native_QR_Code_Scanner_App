import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [textField, onChangeFieldText] = React.useState();
  const [passwordField, onChangePasswordField] = React.useState();
  const [error, setError] = React.useState();
  const [loginScreen, setLoginScreen] = useState(true);

  const [text, setText] = useState(
    "Not yet scanned please scan first to see the results!"
  );
  const [batch, setBatch] = useState("BSBI batch 23");

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  };

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data);
    setBatch("");
    // console.log("Type: " + type + "\nData: " + data);
  };

  //scan again function
  const handleScanAgain = () => {
    setScanned(false);
    setText("Not yet scanned please scan first to see the results!");
    setBatch("BSBI batch 23");
  };

  // validate user enter valid information or not...
  const handleLogin = () => {
    if (textField?.length < 6 && passwordField?.length < 6) {
      setError("Enter valid email and password");
    }
    if (
      textField === "aroojfatima@gmail.com" &&
      passwordField === "aroojfatima786"
    ) {
      setLoginScreen(false);
      setError("");
    }
  };

  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10, textAlign: "center" }}>
          No access to camera, if you want to scan your QR-Codes first allow
          your camera access
        </Text>
        <Button
          title={"Allow Camera"}
          onPress={() => askForCameraPermission()}
          color="#F4717F"
        />
      </View>
    );
  }

  // Return the View
  if (loginScreen) {
    return (
      <View style={styles.container}>
        <Image
          source={require("./assets/loginIcon.jpg")}
          style={{ height: 120, width: 120 }}
        />
        <Text style={styles.loginText}>Login</Text>

        <View style={styles.inputField}>
          <TextInput
            style={styles.input}
            onChangeText={onChangeFieldText}
            value={textField}
            placeholder="Email"
          />
          <TextInput
            style={styles.input}
            onChangeText={onChangePasswordField}
            value={passwordField}
            placeholder="Password"
          />
        </View>
        <View style={[{ width: "80%", margin: 10 }]}>
          <Button
            title="Login"
            color="#F4717F"
            style={{ borderRadius: 6 }}
            onPress={handleLogin}
          />
        </View>
        {error?.length ? <Text style={{ color: "red" }}>{error}</Text> : ""}
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 450, width: 400 }}
        />
      </View>
      <ScrollView style={{ height: 40 }}>
        <Text style={styles.maintext}>{text}</Text>
        <Text style={{ textAlign: "center", fontSize: 24, color: "#F4717F" }}>
          {batch}
        </Text>
      </ScrollView>

      {scanned && (
        <Button
          title={"Scan again"}
          onPress={handleScanAgain}
          color="#F4717F"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  maintext: {
    fontSize: 14,
    margin: 4,
    padding: 12,
    borderRadius: 12,
    textAlign: "center",
    overflow: "visible",
  },
  barcodebox: {
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
    height: 250,
    width: 300,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#F4717F",
  },

  // for login form

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: "#F4717F",
    borderRadius: 6,
  },

  inputField: {
    maxWidth: "86%",
    width: "100%",
    marginTop: 40,
  },

  loginText: {
    fontSize: 42,
    fontWeight: "bold",
  },
});
