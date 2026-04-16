import { useState } from "react";
import { View, Image, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../FirebaseFrontend";

export default function LoginScreen({ navigation }) {
  // These hold whatever the user has typed into the input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // loading prevents the user from tapping Login multiple times while it's processing
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Basic validation — don't even try if fields are empty
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password");
      return;
    }

    setLoading(true);
    try {
      // signInWithEmailAndPassword talks directly to Firebase Auth
      // If the email/password match, Firebase signs the user in
      // onAuthStateChanged in AuthContext will fire automatically after this
      // which sets currentUser and causes AppNavigator to switch to the main tabs
      await signInWithEmailAndPassword(auth, email, password);

      // No need to navigate manually — AuthContext handles it by updating currentUser

    } catch (error) {
      // Firebase gives us specific error codes for different failure cases
      if (error.code === "auth/invalid-credential") {
        Alert.alert("Error", "Incorrect email or password");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "Please enter a valid email address");
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } finally {
      // finally always runs whether it succeeded or failed
      // We always want to turn off the loading state
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/boarcast-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
      </View>
      <Text style={styles.title}>BoarCast</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}       // updates email state as the user types
        keyboardType="email-address"
        autoCapitalize="none"         // prevents auto-capitalizing the first letter of email
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}        // hides the password characters
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}            // prevents double tapping while processing
      >
        <Text style={styles.buttonText}>
          {loading ? "Signing in..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      {/* Link to the register screen for users who don't have an account yet */}
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: "#aaa",  // grey out the button while loading
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#007AFF",
    textAlign: "center",
    fontSize: 14,
  },

  logoContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#FFB81C',
    borderRadius: 100, 
    padding: 2, 
    marginBottom: 24,
    alignSelf: 'center',     
  },

  logo: {
    width: 200,
    height: 200,
  },
});
