import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { BackButton } from "@/components/ui/BackButton";
import { useTouristStore } from "@/store/tourist-store";
import { colors } from "@/constants/colors";
import { Building, Calendar, Users, X } from "lucide-react-native";

export default function HotelsScreen() {
  const router = useRouter();
  const { bookHotel, hotels, cancelHotelBooking, isLoading, profile } =
    useTouristStore();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    hotelName: "",
    checkIn: "",
    checkOut: "",
    guests: "",
  });

  const [errors, setErrors] = useState({
    hotelName: "",
    checkIn: "",
    checkOut: "",
    guests: "",
  });

  // Redirect if no profile exists
  if (!profile) {
    router.replace("/(dashboard)/tourist/register");
    return null;
  }

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      hotelName: "",
      checkIn: "",
      checkOut: "",
      guests: "",
    };

    if (!formData.hotelName.trim()) {
      newErrors.hotelName = "Hotel name is required";
      isValid = false;
    }

    if (!formData.checkIn.trim()) {
      newErrors.checkIn = "Check-in date is required";
      isValid = false;
    }

    if (!formData.checkOut.trim()) {
      newErrors.checkOut = "Check-out date is required";
      isValid = false;
    }

    if (!formData.guests.trim()) {
      newErrors.guests = "Number of guests is required";
      isValid = false;
    } else if (isNaN(Number(formData.guests)) || Number(formData.guests) <= 0) {
      newErrors.guests = "Please enter a valid number of guests";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await bookHotel({
          hotelName: formData.hotelName,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          guests: Number(formData.guests),
        });

        setShowForm(false);
        setFormData({
          hotelName: "",
          checkIn: "",
          checkOut: "",
          guests: "",
        });

        Alert.alert("Success", "Hotel booked successfully");
      } catch (error) {
        Alert.alert("Error", "Failed to book hotel. Please try again.");
      }
    }
  };

  const handleCancel = (bookingId: string) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await cancelHotelBooking(bookingId);
              Alert.alert("Success", "Booking cancelled successfully");
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to cancel booking. Please try again."
              );
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Hotel Bookings</Text>
          <Button
            title={showForm ? "Cancel" : "Book Hotel"}
            variant={showForm ? "outline" : "primary"}
            onPress={() => setShowForm(!showForm)}
            size="small"
          />
        </View>

        {showForm && (
          <Card style={styles.formCard}>
            <Input
              label="Hotel Name *"
              placeholder="Enter hotel name"
              value={formData.hotelName}
              onChangeText={(text) => handleInputChange("hotelName", text)}
              error={errors.hotelName}
            />

            <Input
              label="Check-in Date *"
              placeholder="YYYY-MM-DD"
              value={formData.checkIn}
              onChangeText={(text) => handleInputChange("checkIn", text)}
              error={errors.checkIn}
            />

            <Input
              label="Check-out Date *"
              placeholder="YYYY-MM-DD"
              value={formData.checkOut}
              onChangeText={(text) => handleInputChange("checkOut", text)}
              error={errors.checkOut}
            />

            <Input
              label="Number of Guests *"
              placeholder="Enter number of guests"
              keyboardType="number-pad"
              value={formData.guests}
              onChangeText={(text) => handleInputChange("guests", text)}
              error={errors.guests}
            />

            <Button
              title="Book Now"
              onPress={handleSubmit}
              isLoading={isLoading}
              style={styles.submitButton}
            />
          </Card>
        )}

        {hotels.length > 0 ? (
          <View style={styles.bookingsContainer}>
            {hotels.map((booking) => (
              <Card key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <Text style={styles.hotelName}>{booking.hotelName}</Text>
                  {booking.status !== "cancelled" && (
                    <TouchableOpacity
                      onPress={() => handleCancel(booking.id)}
                      style={styles.cancelButton}
                    >
                      <X size={16} color={colors.error} />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.bookingDetails}>
                  <View style={styles.detailItem}>
                    <Calendar size={16} color={colors.primary} />
                    <Text style={styles.detailText}>
                      {booking.checkIn} to {booking.checkOut}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Users size={16} color={colors.primary} />
                    <Text style={styles.detailText}>
                      {booking.guests}{" "}
                      {booking.guests === 1 ? "Guest" : "Guests"}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    booking.status === "confirmed"
                      ? styles.confirmedBadge
                      : booking.status === "pending"
                        ? styles.pendingBadge
                        : styles.cancelledBadge,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Building size={48} color={colors.textLight} />
            <Text style={styles.emptyText}>No hotel bookings yet</Text>
            <Text style={styles.emptySubtext}>
              Book your first hotel by clicking the "Book Hotel" button above
            </Text>
          </View>
        )}
      </ScrollView>

      <LoadingOverlay visible={isLoading} message="Processing..." />
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
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  formCard: {
    padding: 16,
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 16,
  },
  bookingsContainer: {
    gap: 12,
  },
  bookingCard: {
    padding: 16,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  cancelButton: {
    padding: 4,
  },
  bookingDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.textLight,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confirmedBadge: {
    backgroundColor: colors.success + "20",
  },
  pendingBadge: {
    backgroundColor: colors.secondary + "20",
  },
  cancelledBadge: {
    backgroundColor: colors.error + "20",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.text,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: "center",
  },
});
