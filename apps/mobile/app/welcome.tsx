import { useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const { width } = Dimensions.get('window')

const SLIDES = [
  {
    id: '1',
    title: 'Send Anything Home',
    subtitle:
      'Connect with trusted travelers heading to your destination. Send parcels safely and affordably.',
    emoji: '📦',
    bg: '#1D7A5F',
  },
  {
    id: '2',
    title: 'Earn While You Travel',
    subtitle:
      'Turn your extra luggage allowance into income. Carry parcels for senders on your route.',
    emoji: '✈️',
    bg: '#2D9B7A',
  },
  {
    id: '3',
    title: 'Safe & Verified',
    subtitle:
      'Every user is KYC-verified. Payments are held in escrow until delivery is confirmed.',
    emoji: '🔒',
    bg: '#1D7A5F',
  },
]

export default function WelcomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)
  const router = useRouter()

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 })
      setActiveIndex(activeIndex + 1)
    } else {
      router.push('/(auth)/phone')
    }
  }

  const handleSkip = () => {
    router.push('/(auth)/phone')
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width)
          setActiveIndex(index)
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { backgroundColor: item.bg, width }]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex && styles.dotActive]}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextText}>
            {activeIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1D7A5F' },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emoji: { fontSize: 80, marginBottom: 32 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#1D7A5F',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 4,
  },
  dotActive: { backgroundColor: '#fff', width: 24 },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 8,
    backgroundColor: '#1D7A5F',
  },
  skipBtn: { padding: 12 },
  skipText: { color: 'rgba(255,255,255,0.7)', fontSize: 16 },
  nextBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
  },
  nextText: { color: '#1D7A5F', fontWeight: '700', fontSize: 16 },
})
