import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { useLabourStore } from "@/store/labour-store";
import { useAuthStore } from "@/store/auth-store";
import { colors } from "../../../constants/colors";
import {
  User,
  FileText,
  Download,
  RefreshCw,
  Plus,
  LogOut,
  Briefcase,
} from "lucide-react-native";

export default function LabourDashboardScreen() {
  const router = useRouter();
  const { profile, isLoading } = useLabourStore();
  const { logout } = useAuthStore();

  const handleViewCard = () => {
    router.push("/(dashboard)/labour/view-card");
  };

  const handleDownloadCard = async () => {
    try {
      await useLabourStore.getState().downloadCard();
      Alert.alert("Success", "Card downloaded successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to download card. Please try again.");
    }
  };

  const handleRenewCard = async () => {
    try {
      await useLabourStore.getState().renewCard();
      Alert.alert("Success", "Card renewed successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to renew card. Please try again.");
    }
  };

  const handleApplyNewCard = async () => {
    try {
      //   await useLabourStore.getState().applyNewCard();

      Alert.alert("Success", "New card application submitted successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to apply for new card. Please try again.");
    }
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
            You need to register as a labour first
          </Text>
          <Button
            title="Register Now"
            onPress={() => router.replace("/(dashboard)/labour/register")}
            style={styles.registerButton}
            variant="secondary"
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
                <Briefcase size={24} color={colors.white} />
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileDetail}>{profile.phone}</Text>
            </View>
          </View>

          <View style={styles.cardInfo}>
            <Text style={styles.cardLabel}>Card Number</Text>
            <Text style={styles.cardValue}>{profile.cardNumber || "N/A"}</Text>

            <Text style={styles.cardLabel}>Status</Text>
            <View
              style={[
                styles.statusBadge,
                profile.cardStatus === "active"
                  ? styles.activeBadge
                  : profile.cardStatus === "expired"
                  ? styles.expiredBadge
                  : styles.pendingBadge,
              ]}
            >
              <Text style={styles.statusText}>
                {profile.cardStatus
                  ? profile.cardStatus.charAt(0).toUpperCase() +
                    profile.cardStatus.slice(1)
                  : "N/A"}
              </Text>
            </View>

            <Text style={styles.cardLabel}>Expiry Date</Text>
            <Text style={styles.cardValue}>
              {profile.cardExpiryDate || "N/A"}
            </Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Services</Text>

        <View style={styles.featuresContainer}>
          <FeatureCard
            title="View Labour Card"
            description="View your labour card details"
            icon={FileText}
            onPress={handleViewCard}
          />

          <FeatureCard
            title="Download Labour Card"
            description="Download your labour card as PDF"
            icon={Download}
            onPress={handleDownloadCard}
          />

          <FeatureCard
            title="Renew Labour Card"
            description="Renew your existing labour card"
            icon={RefreshCw}
            onPress={handleRenewCard}
          />

          <FeatureCard
            title="Apply for labour card for Other"
            description="Apply for labour card for Other"
            icon={Plus}
            onPress={handleApplyNewCard}
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
    backgroundColor: colors.secondary,
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
  cardInfo: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  cardLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  activeBadge: {
    backgroundColor: colors.success + "20",
  },
  expiredBadge: {
    backgroundColor: colors.error + "20",
  },
  pendingBadge: {
    backgroundColor: colors.secondary + "20",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.text,
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
