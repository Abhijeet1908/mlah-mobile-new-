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
import { BackButton } from "@/components/ui/BackButton";
import { useLabourStore } from "@/store/labour-store";
import { colors } from "../../../constants/colors";
import { User } from "lucide-react-native";

export default function ViewCardScreen() {
  const router = useRouter();
  const { profile, isLoading } = useLabourStore();

  // Redirect if no profile exists
  if (!profile) {
    router.replace("/(dashboard)/labour/register");
    return null;
  }

  const handleDownload = async () => {
    try {
      await useLabourStore.getState().downloadCard();
      Alert.alert("Success", "Card downloaded successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to download card. Please try again.");
    }
  };

  const handleRenew = async () => {
    try {
      await useLabourStore.getState().renewCard();
      Alert.alert("Success", "Card renewed successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to renew card. Please try again.");
    }
  };

  const isExpired = () => {
    if (!profile.cardExpiryDate) return false;

    const expiryDate = new Date(profile.cardExpiryDate);
    const today = new Date();

    return expiryDate < today;
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Labour Card</Text>

        <Card style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>LABOUR IDENTIFICATION CARD</Text>
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
          </View>

          <View style={styles.cardBody}>
            <View style={styles.photoSection}>
              {profile.profileImage ? (
                <Image
                  source={{ uri: profile.profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <User size={40} color={colors.white} />
                </View>
              )}
            </View>

            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Card Number:</Text>
              <Text style={styles.cardValue}>
                {profile.cardNumber || "N/A"}
              </Text>
            </View>

            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Name:</Text>
              <Text style={styles.cardValue}>{profile.name}</Text>
            </View>

            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Phone:</Text>
              <Text style={styles.cardValue}>{profile.phone}</Text>
            </View>

            {profile.address && (
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Address:</Text>
                <Text style={styles.cardValue}>{profile.address}</Text>
              </View>
            )}

            {profile.idProof && (
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>ID Proof:</Text>
                <Text style={styles.cardValue}>{profile.idProof}</Text>
              </View>
            )}

            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Expiry Date:</Text>
              <Text
                style={[
                  styles.cardValue,
                  isExpired() ? styles.expiredText : {},
                ]}
              >
                {profile.cardExpiryDate || "N/A"}
                {isExpired() && " (Expired)"}
              </Text>
            </View>

            {profile.skills && profile.skills.length > 0 && (
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Skills:</Text>
                <Text style={styles.cardValue}>{profile.skills}</Text>
              </View>
            )}
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.footerText}>
              This card is the property of the Labour Department. If found,
              please return to the nearest Labour Office.
            </Text>
          </View>
        </Card>

        <View style={styles.actionsContainer}>
          <Button
            title="Download Card"
            onPress={handleDownload}
            isLoading={isLoading}
            style={styles.actionButton}
            variant="outline"
            textStyle={{ color: colors.secondary }}
          />

          <Button
            title="Renew Card"
            onPress={handleRenew}
            isLoading={isLoading}
            style={styles.actionButton}
            variant="secondary"
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 24,
  },
  cardContainer: {
    padding: 0,
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: colors.secondary,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.white + "30",
  },
  activeBadge: {
    backgroundColor: colors.success + "30",
  },
  expiredBadge: {
    backgroundColor: colors.error + "30",
  },
  pendingBadge: {
    backgroundColor: colors.white + "30",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.white,
  },
  cardBody: {
    padding: 16,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  cardRow: {
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    color: colors.text,
  },
  expiredText: {
    color: colors.error,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
  },
  footerText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: "center",
    fontStyle: "italic",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
