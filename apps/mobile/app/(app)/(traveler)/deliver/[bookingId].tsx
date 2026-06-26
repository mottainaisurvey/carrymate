import { useState, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { trpc } from '../../../../lib/trpc'

export default function DeliverScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>()
  const router = useRouter()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputs = useRef<(TextInput | null)[]>([])

  const { data: booking, isLoading } = trpc.bookings.getById.useQuery({ id: bookingId! })

  const confirmDelivery = trpc.bookings.confirmDeliveryOTP.useMutation({
    onSuccess: () => {
      Alert.alert(
        'Delivery confirmed! 🎉',
        'Payment has been released to your account. Thank you for your service!',
        [{ text: 'View earnings', onPress: () => router.replace('/(app)/(traveler)/earnings') }]
      )
    },
    onError: (err: { message: string }) => Alert.alert('Invalid code', err.message),
  })

  const handleChange = (val: string, idx: number) => {
    const newOtp = [...otp]
    newOtp[idx] = val.slice(-1)
    setOtp(newOtp)
    if (val && idx < 5) inputs.current[idx + 1]?.focus()
    if (!val && idx > 0) inputs.current[idx - 1]?.focus()
  }

  const handleConfirm = () => {
    const token = otp.join('')
    if (token.length < 6) {
      Alert.alert('Enter the 6-digit delivery code')
      return
    }
    confirmDelivery.mutate({ bookingId: bookingId!, otp: token })
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1D7A5F" />
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>🏠</Text>
        </View>
        <Text style={styles.heading}>Confirm Delivery</Text>
        <Text style={styles.sub}>
          Ask the recipient for the 6-digit delivery code to confirm successful delivery and
          release your payment.
        </Text>

        {booking && (
          <View style={styles.parcelCard}>
            <Text style={styles.parcelTitle}>Parcel: {booking.parcelId.slice(0, 8)}...</Text>
            <Text style={styles.parcelRoute}>Status: {booking.status}</Text>
            <View style={styles.earningsRow}>
              <Text style={styles.earningsLabel}>Your earnings</Text>
              <Text style={styles.earningsAmount}>£{booking.agreedPrice}</Text>
            </View>
          </View>
        )}

        <Text style={styles.otpLabel}>Enter delivery code</Text>
        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={(r) => (inputs.current[i] = r)}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
              value={digit}
              onChangeText={(v) => handleChange(v, i)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.btn, confirmDelivery.isPending && styles.btnDisabled]}
          onPress={handleConfirm}
          disabled={confirmDelivery.isPending}
        >
          {confirmDelivery.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Confirm Delivery & Get Paid</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Payment is held in escrow and released immediately upon delivery confirmation.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { padding: 24, paddingTop: 32, alignItems: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0faf7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  icon: { fontSize: 40 },
  heading: { fontSize: 24, fontWeight: '700', color: '#1a1a1a', marginBottom: 10, textAlign: 'center' },
  sub: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  parcelCard: {
    width: '100%',
    backgroundColor: '#f0faf7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#c6f0e0',
  },
  parcelTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  parcelRoute: { fontSize: 13, color: '#666', marginBottom: 12 },
  earningsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  earningsLabel: { fontSize: 14, color: '#555' },
  earningsAmount: { fontSize: 22, fontWeight: '800', color: '#1D7A5F' },
  otpLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 14, alignSelf: 'flex-start' },
  otpRow: { flexDirection: 'row', gap: 10, marginBottom: 32 },
  otpBox: {
    width: 46,
    height: 54,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  otpBoxFilled: { borderColor: '#1D7A5F', backgroundColor: '#f0faf7' },
  btn: {
    backgroundColor: '#1D7A5F',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  disclaimer: { fontSize: 13, color: '#999', textAlign: 'center', lineHeight: 18 },
})
