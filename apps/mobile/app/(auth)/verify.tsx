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
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { supabase } from '../../lib/supabase'

export default function VerifyScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const inputs = useRef<(TextInput | null)[]>([])
  const router = useRouter()

  const handleChange = (val: string, idx: number) => {
    const newOtp = [...otp]
    newOtp[idx] = val.slice(-1)
    setOtp(newOtp)
    if (val && idx < 5) inputs.current[idx + 1]?.focus()
    if (!val && idx > 0) inputs.current[idx - 1]?.focus()
  }

  const handleVerify = async () => {
    const token = otp.join('')
    if (token.length < 6) {
      Alert.alert('Enter the 6-digit code')
      return
    }
    setLoading(true)
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phone!,
      token,
      type: 'sms',
    })
    setLoading(false)
    if (error) {
      Alert.alert('Invalid code', error.message)
    } else {
      // Check if user has completed signup
      const { data: profile } = await supabase
        .from('users')
        .select('full_name, role')
        .eq('id', data.user!.id)
        .single()

      if (!profile?.full_name || !profile?.role) {
        router.replace('/(auth)/signup')
      } else {
        router.replace('/(app)/dashboard')
      }
    }
  }

  const handleResend = async () => {
    await supabase.auth.signInWithOtp({ phone: phone! })
    Alert.alert('Code resent', 'A new code has been sent to your phone.')
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.heading}>Verify your number</Text>
        <Text style={styles.sub}>
          Enter the 6-digit code sent to{'\n'}
          <Text style={styles.phone}>{phone}</Text>
        </Text>

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
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Verify</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.resendBtn} onPress={handleResend}>
          <Text style={styles.resendText}>Didn't receive a code? Resend</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { flex: 1, padding: 24, paddingTop: 48, alignItems: 'center' },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  sub: {
    fontSize: 15,
    color: '#666',
    marginBottom: 40,
    alignSelf: 'flex-start',
    lineHeight: 22,
  },
  phone: { fontWeight: '700', color: '#1D7A5F' },
  otpRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  otpBox: {
    width: 48,
    height: 56,
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
  resendBtn: { padding: 12 },
  resendText: { color: '#1D7A5F', fontSize: 14 },
})
