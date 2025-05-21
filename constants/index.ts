import arrowDown from "@/assets/icons/arrow-down.png";
import arrowUp from "@/assets/icons/arrow-up.png";
import backArrow from "@/assets/icons/back-arrow.png";
import chat from "@/assets/icons/chat.png";
import checkmark from "@/assets/icons/check.png";
import close from "@/assets/icons/close.png";
import dollar from "@/assets/icons/dollar.png";
import email from "@/assets/icons/email.png";
import eyecross from "@/assets/icons/eyecross.png";
import google from "@/assets/icons/google.png";
import home from "@/assets/icons/home.png";
import list from "@/assets/icons/list.png";
import lock from "@/assets/icons/lock.png";
import map from "@/assets/icons/map.png";
import marker from "@/assets/icons/marker.png";
import out from "@/assets/icons/out.png";
import person from "@/assets/icons/person.png";
import pin from "@/assets/icons/pin.png";
import point from "@/assets/icons/point.png";
import profile from "@/assets/icons/profile.png";
import search from "@/assets/icons/search.png";
import selectedMarker from "@/assets/icons/selected-marker.png";
import star from "@/assets/icons/star.png";
import target from "@/assets/icons/target.png";
import to from "@/assets/icons/to.png";
import check from "@/assets/images/check.png";
import getStarted from "@/assets/images/get-started.png";
import message from "@/assets/images/message.png";
import noResult from "@/assets/images/no-result.png";
import onboarding12 from "@/assets/images/onboarding12.jpg";
import onboarding2 from "@/assets/images/onboarding2.png";
import onboarding3 from "@/assets/images/onboarding3.png";
import signUpCar from "@/assets/images/signup-car.jpg";
import onboardingtourist from "@/assets/images/onboardingtourist.png";
import onboardinglabour from "@/assets/images/onboardinglabour.png";
import welcomeImage from "@/assets/images/welcome1.png";

export const images = {
  onboarding12,
  onboarding2,
  onboarding3,
  getStarted,
  signUpCar,
  check,
  noResult,
  message,
  onboardingtourist,
  onboardinglabour,
  welcomeImage,
};

export const icons = {
  arrowDown,
  arrowUp,
  backArrow,
  chat,
  checkmark,
  close,
  dollar,
  email,
  eyecross,
  google,
  home,
  list,
  lock,
  map,
  marker,
  out,
  person,
  pin,
  point,
  profile,
  search,
  selectedMarker,
  star,
  target,
  to,
};

export const onboarding = [
  // {
  //   id: 1,
  //   title: "The perfect ride is just a tap away!",
  //   description:
  //     "Your journey begins with Mlah. Find your ideal ride effortlessly.",
  //   image: images.onboarding12,
  // },
  // {
  //   id: 2,
  //   title: "Best car in your hands",
  //   description:
  //     "Discover the convenience of finding your perfect ride with Mlah",
  //   image: images.onboarding2,
  // },
  // {
  //   id: 3,
  //   title: "Your ride, your way. Let's go!",
  //   description:
  //     "Enter your destination, sit back, and let us take care of the rest.",
  //   image: images.onboarding3,
  // },
  {
    id: 1,
    title: "",
    image: images.welcomeImage,
    description:
      "Your one-stop solution for tourism and labour registration services.",
  },
  {
    id: 2,
    title: "Tourist Services",
    description:
      "Register as a tourist, add family members. Discover the convenience with Mlah",
    image: images.onboardingtourist,
  },
  {
    id: 3,
    title: "Labour Registration",
    description:
      "Apply for labour cards, renew existing cards, and manage your labour profile easily with Mlah.",
    image: images.onboardinglabour,
  },
];

export const data = {
  onboarding,
};

/////
// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   useWindowDimensions,
//   Image,
//   TouchableOpacity
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Button } from '@/components/ui/Button';
// import { colors } from '@/constants/colors';
// import { ArrowRight, ChevronRight } from 'lucide-react-native';

// interface OnboardingItem {
//   id: string;
//   title: string;
//   description: string;
//   image: string;
// }

// const onboardingData: OnboardingItem[] = [
//   {
//     id: '1',
//     title: 'Welcome to TourLabour',
//     description: 'Your one-stop solution for tourism and labour registration services.',
//     image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=2070&auto=format&fit=crop',
//   },
//   {
//     id: '2',
//     title: 'Tourist Services',
//     description: 'Register as a tourist, add family members, book hotels and cabs all in one place.',
//     image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop',
//   },
//   {
//     id: '3',
//     title: 'Labour Registration',
//     description: 'Apply for labour cards, renew existing cards, and manage your labour profile easily.',
//     image: 'https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?q=80&w=2070&auto=format&fit=crop',
//   },
// ];

// export default function OnboardingScreen() {
//   const router = useRouter();
//   const { width } = useWindowDimensions();
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const flatListRef = useRef<FlatList>(null);

//   const handleNext = () => {
//     if (currentIndex < onboardingData.length - 1) {
//       flatListRef.current?.scrollToIndex({
//         index: currentIndex + 1,
//         animated: true,
//       });
//     } else {
//       router.replace('/auth/login');
//     }
//   };

//   const handleSkip = () => {
//     router.replace('/auth/login');
//   };

//   const renderItem = ({ item }: { item: OnboardingItem }) => {
//     return (
//       <View style={[styles.slide, { width }]}>
//         <Image
//           source={{ uri: item.image }}
//           style={styles.image}
//           resizeMode="cover"
//         />
//         <View style={styles.textContainer}>
//           <Text style={styles.title}>{item.title}</Text>
//           <Text style={styles.description}>{item.description}</Text>
//         </View>
//       </View>
//     );
//   };

//   const renderDots = () => {
//     return (
//       <View style={styles.dotsContainer}>
//         {onboardingData.map((_, index) => (
//           <View
//             key={index}
//             style={[
//               styles.dot,
//               { backgroundColor: index === currentIndex ? colors.primary : colors.inactive }
//             ]}
//           />
//         ))}
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
//       <View style={styles.skipContainer}>
//         <TouchableOpacity onPress={handleSkip}>
//           <Text style={styles.skipText}>Skip</Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         ref={flatListRef}
//         data={onboardingData}
//         renderItem={renderItem}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onMomentumScrollEnd={(event) => {
//           const index = Math.round(event.nativeEvent.contentOffset.x / width);
//           setCurrentIndex(index);
//         }}
//         keyExtractor={(item) => item.id}
//       />

//       {renderDots()}

//       <View style={styles.buttonContainer}>
//         {currentIndex === onboardingData.length - 1 ? (
//           <Button
//             title="Get Started"
//             onPress={handleNext}
//             style={styles.button}
//           />
//         ) : (
//           <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
//             <ChevronRight size={24} color={colors.white} />
//           </TouchableOpacity>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.white,
//   },
//   skipContainer: {
//     position: 'absolute',
//     top: 16,
//     right: 16,
//     zIndex: 10,
//   },
//   skipText: {
//     fontSize: 16,
//     color: colors.primary,
//     fontWeight: '500',
//   },
//   slide: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   image: {
//     width: '100%',
//     height: '60%',
//   },
//   textContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 24,
//     marginTop: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: colors.text,
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   description: {
//     fontSize: 16,
//     color: colors.textLight,
//     textAlign: 'center',
//     lineHeight: 24,
//   },
//   dotsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 24,
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginHorizontal: 4,
//   },
//   buttonContainer: {
//     paddingHorizontal: 24,
//     paddingBottom: 24,
//     alignItems: 'center',
//   },
//   button: {
//     width: '100%',
//   },
//   nextButton: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: colors.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
