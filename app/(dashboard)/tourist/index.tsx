import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { useTouristStore } from "@/store/tourist-store";
import { useAuthStore } from "@/store/auth-store";
import { colors } from "@/constants/colors";
import { UserPlus, Building, Car, LogOut, User } from "lucide-react-native";

export default function TouristDashboardScreen() {
  const router = useRouter();
  const { profile, hotels, cabs } = useTouristStore();
  const { logout } = useAuthStore();

  const handleAddMember = () => {
    router.push("/(dashboard)/tourist/add-member");
  };

  const handleHotels = () => {
    router.push("/(dashboard)/tourist/hotels");
  };

  const handleCabs = () => {
    router.push("/(dashboard)/tourist/cabs");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => {
          logout();
          router.replace("/(auth)/welcome");
        },
        style: "destructive",
      },
    ]);
  };

  if (!profile) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Profile Found</Text>
          <Text style={styles.emptySubtitle}>
            You need to register as a tourist first
          </Text>
          <Button
            title="Register Now"
            onPress={() => router.replace("/(dashboard)/tourist/register")}
            style={styles.registerButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.nameText}>{profile.name}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            {profile.profileImage ? (
              <Image
                source={{ uri: profile.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileIconContainer}>
                <User size={24} color={colors.white} />
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileDetail}>{profile.phone}</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.members.length}</Text>
              <Text style={styles.statLabel}>Members</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{hotels.length}</Text>
              <Text style={styles.statLabel}>Hotels</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{cabs.length}</Text>
              <Text style={styles.statLabel}>Cabs</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Services</Text>

        <View style={styles.featuresContainer}>
          <FeatureCard
            title="Add Member"
            description="Add family members to your profile"
            icon={UserPlus}
            onPress={handleAddMember}
          />

          <FeatureCard
            title="Hotels"
            description="Book hotels for your stay"
            icon={Building}
            onPress={handleHotels}
          />

          <FeatureCard
            title="Cabs"
            description="Book cabs for transportation"
            icon={Car}
            onPress={handleCabs}
          />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textLight,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  logoutButton: {
    padding: 8,
  },
  profileCard: {
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  profileDetail: {
    fontSize: 14,
    color: colors.textLight,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  featuresContainer: {
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
    marginBottom: 24,
  },
  registerButton: {
    width: "100%",
    maxWidth: 300,
  },
});
