import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth-store";
import { colors } from "../../constants/colors";
import { Users, Briefcase } from "lucide-react-native";

export default function ChooseRegistrationScreen() {
  const router = useRouter();
  const { setUserType, user } = useAuthStore();

  const handleTouristRegistration = () => {
    setUserType("tourist");
    router.push("/(dashboard)/tourist/register");
  };

  const handleLabourRegistration = () => {
    setUserType("labour");
    router.push("/(dashboard)/labour/register");
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?q=80&w=2080&auto=format&fit=crop",
            }}
            style={styles.logo}
          />
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>
            Please select the type of registration you want to proceed with
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          <Card style={styles.card}>
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, styles.touristIcon]}>
                <Users size={32} color={colors.white} />
              </View>
              <Text style={styles.cardTitle}>Tourist Registration</Text>
              <Text style={styles.cardDescription}>
                Register as a tourist, add family members, book hotels and cabs
                all in one place.
              </Text>
              <Button
                title="Register as Tourist"
                onPress={handleTouristRegistration}
                style={styles.cardButton}
              />
            </View>
          </Card>

          <Card style={styles.card}>
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, styles.labourIcon]}>
                <Briefcase size={32} color={colors.white} />
              </View>
              <Text style={styles.cardTitle}>Labour Registration</Text>
              <Text style={styles.cardDescription}>
                Apply for labour cards, renew existing cards, and manage your
                labour profile easily.
              </Text>
              <Button
                title="Register as Labour"
                onPress={handleLabourRegistration}
                variant="secondary"
                style={styles.cardButton}
              />
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    padding: 0,
    overflow: "hidden",
  },
  cardContent: {
    padding: 24,
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  touristIcon: {
    backgroundColor: colors.primary,
  },
  labourIcon: {
    backgroundColor: colors.secondary,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: "center",
    marginBottom: 24,
  },
  cardButton: {
    width: "100%",
  },
});
