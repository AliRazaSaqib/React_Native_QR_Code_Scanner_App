import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, ScrollView } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
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
  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }}
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
    alignItems: "center",
    justifyContent: "center",
    height: 280,
    overflow: "hidden",
    backgroundColor: "#F4717F",
  },
});
