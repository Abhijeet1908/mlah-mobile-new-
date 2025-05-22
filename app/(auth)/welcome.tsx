// import { router } from "expo-router";
// import { useRef, useState } from "react";
// import { Image, Text, TouchableOpacity, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Swiper from "react-native-swiper";

// import CustomButton from "../../components/CustomButton";
// import { onboarding } from "../../constants";

// const Home = () => {
//   const swiperRef = useRef<Swiper>(null);
//   const [activeIndex, setActiveIndex] = useState(0);

//   const isLastSlide = activeIndex === onboarding.length - 1;

//   return (
//     <SafeAreaView className="flex h-full items-center justify-between bg-white">
//       <TouchableOpacity
//         onPress={() => {
//           router.replace("/(auth)/sign-up");
//         }}
//         className="w-full flex justify-end items-end p-5"
//       >
//         <Text className="text-black text-md font-JakartaBold">Skip</Text>
//       </TouchableOpacity>

//       <Swiper
//         ref={swiperRef}
//         loop={false}
//         dot={
//           <View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full" />
//         }
//         activeDot={
//           <View className="w-[32px] h-[4px] mx-1 bg-[#0286FF] rounded-full" />
//         }
//         onIndexChanged={(index) => setActiveIndex(index)}
//       >
//         {onboarding.map((item) => (
//           <View key={item.id} className="flex items-center justify-center p-5">
//             <Text className="text-black text-3xl font-bold mx-10 text-center">
//               {item.title}
//             </Text>

//             <View className="flex flex-row items-center justify-center w-full mt-10">
//               <Image
//                 source={item.image}
//                 className="w-full h-[300px]"
//                 resizeMode="contain"
//               />
//             </View>
//             <Text className="text-md font-JakartaSemiBold text-center text-[#858585] mx-10 mt-3">
//               {item.description}
//             </Text>
//           </View>
//         ))}
//       </Swiper>

//       <CustomButton
//         title={isLastSlide ? "Get Started" : "Next"}
//         onPress={() =>
//           isLastSlide
//             ? router.replace("/(auth)/login")
//             : swiperRef.current?.scrollBy(1)
//         }
//         className="w-11/12 mt-10 mb-5"
//       />
//     </SafeAreaView>
//   );
// };

// export default Home;
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SwiperFlatList } from "react-native-swiper-flatlist";

import CustomButton from "../../components/CustomButton";
import { onboarding } from "../../constants";

const { width, height } = Dimensions.get("window");

const Home = () => {
  const swiperRef = useRef<SwiperFlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button */}
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={() => router.replace("/(auth)/sign-up")}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Swiper Content */}
      <View style={styles.swiperContainer}>
        <SwiperFlatList
          ref={swiperRef}
          showPagination
          paginationStyleItem={styles.paginationDot}
          paginationActiveColor="#0286FF"
          paginationDefaultColor="#E2E8F0"
          index={0}
          onChangeIndex={({ index }) => setActiveIndex(index)}
          data={onboarding}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width }]}>
              <Text style={styles.title}>{item.title}</Text>

              <Image
                source={item.image}
                style={styles.image}
                resizeMode="contain"
              />

              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
        />
      </View>

      {/* Button */}
      <CustomButton
        title={isLastSlide ? "Get Started" : "Next"}
        onPress={() =>
          isLastSlide
            ? router.replace("/(auth)/login")
            : swiperRef.current?.scrollToIndex({
                index: activeIndex + 1,
                animated: true,
              })
        }
        style={styles.button}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  skipContainer: {
    width: "100%",
    alignItems: "flex-end",
    padding: 20,
  },
  skipText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  swiperContainer: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
  },
  title: {
    color: "#000",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  image: {
    width: width * 0.9,
    height: height * 0.4,
    marginTop: 30,
  },
  description: {
    fontSize: 16,
    fontWeight: "600",
    color: "#858585",
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  paginationDot: {
    width: 32,
    height: 4,
    marginHorizontal: 4,
    borderRadius: 2,
  },
  button: {
    width: "90%",
    alignSelf: "center",
    marginBottom: 20,
  },
});

export default Home;
