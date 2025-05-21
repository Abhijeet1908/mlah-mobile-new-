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
import { colors } from "../../../constants/colors";
import { Car, Calendar, Clock, Users, MapPin, X } from "lucide-react-native";

export default function CabsScreen() {
  const router = useRouter();
  const { bookCab, cabs, cancelCabBooking, isLoading, profile } =
    useTouristStore();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    passengers: "",
  });

  const [errors, setErrors] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    passengers: "",
  });

  // Redirect if no profile exists
  if (!profile) {
    router.replace("/(dashboard)/tourist/register");
    return null;
  }

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      from: "",
      to: "",
      date: "",
      time: "",
      passengers: "",
    };

    if (!formData.from.trim()) {
      newErrors.from = "Pickup location is required";
      isValid = false;
    }

    if (!formData.to.trim()) {
      newErrors.to = "Destination is required";
      isValid = false;
    }

    if (!formData.date.trim()) {
      newErrors.date = "Date is required";
      isValid = false;
    }

    if (!formData.time.trim()) {
      newErrors.time = "Time is required";
      isValid = false;
    }

    if (!formData.passengers.trim()) {
      newErrors.passengers = "Number of passengers is required";
      isValid = false;
    } else if (
      isNaN(Number(formData.passengers)) ||
      Number(formData.passengers) <= 0
    ) {
      newErrors.passengers = "Please enter a valid number of passengers";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await bookCab({
          from: formData.from,
          to: formData.to,
          date: formData.date,
          time: formData.time,
          passengers: Number(formData.passengers),
        });

        setShowForm(false);
        setFormData({
          from: "",
          to: "",
          date: "",
          time: "",
          passengers: "",
        });

        Alert.alert("Success", "Cab booked successfully");
      } catch (error) {
        Alert.alert("Error", "Failed to book cab. Please try again.");
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
              await cancelCabBooking(bookingId);
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
          <Text style={styles.title}>Cab Bookings</Text>
          <Button
            title={showForm ? "Cancel" : "Book Cab"}
            variant={showForm ? "outline" : "primary"}
            onPress={() => setShowForm(!showForm)}
            size="small"
          />
        </View>

        {showForm && (
          <Card style={styles.formCard}>
            <Input
              label="Pickup Location *"
              placeholder="Enter pickup location"
              value={formData.from}
              onChangeText={(text) => handleInputChange("from", text)}
              error={errors.from}
            />

            <Input
              label="Destination *"
              placeholder="Enter destination"
              value={formData.to}
              onChangeText={(text) => handleInputChange("to", text)}
              error={errors.to}
            />

            <Input
              label="Date *"
              placeholder="YYYY-MM-DD"
              value={formData.date}
              onChangeText={(text) => handleInputChange("date", text)}
              error={errors.date}
            />

            <Input
              label="Time *"
              placeholder="HH:MM"
              value={formData.time}
              onChangeText={(text) => handleInputChange("time", text)}
              error={errors.time}
            />

            <Input
              label="Number of Passengers *"
              placeholder="Enter number of passengers"
              keyboardType="number-pad"
              value={formData.passengers}
              onChangeText={(text) => handleInputChange("passengers", text)}
              error={errors.passengers}
            />

            <Button
              title="Book Now"
              onPress={handleSubmit}
              isLoading={isLoading}
              style={styles.submitButton}
            />
          </Card>
        )}

        {cabs.length > 0 ? (
          <View style={styles.bookingsContainer}>
            {cabs.map((booking) => (
              <Card key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <Text style={styles.routeText}>
                    {booking.from} to {booking.to}
                  </Text>
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
                    <Text style={styles.detailText}>{booking.date}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Clock size={16} color={colors.primary} />
                    <Text style={styles.detailText}>{booking.time}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Users size={16} color={colors.primary} />
                    <Text style={styles.detailText}>
                      {booking.passengers}{" "}
                      {booking.passengers === 1 ? "Passenger" : "Passengers"}
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
            <Car size={48} color={colors.textLight} />
            <Text style={styles.emptyText}>No cab bookings yet</Text>
            <Text style={styles.emptySubtext}>
              Book your first cab by clicking the "Book Cab" button above
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
  routeText: {
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
