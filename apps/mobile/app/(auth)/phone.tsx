import { useState } from 'react'
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
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'

const COUNTRY_CODES = [
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+233', flag: '🇬🇭', name: 'Ghana' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+1', flag: '🇺🇸', name: 'US' },
  { code: '+353', flag: '🇮🇪', name: 'Ireland' },
]

export default function PhoneScreen() {
  const [phone, setPhone] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0])
  const [showPicker, setShowPicker] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const fullPhone = `${selectedCountry.code}${phone.replace(/^0/, '')}`

  const handleSendOTP = async () => {
    if (phone.length < 7) {
      Alert.alert('Invalid number', 'Please enter a valid phone number.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone })
    setLoading(false)
    if (error) {
      Alert.alert('Error', error.message)
    } else {
      router.push({ pathname: '/(auth)/verify', params: { phone: fullPhone } })
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.heading}>Enter your phone number</Text>
        <Text style={styles.sub}>
          We'll send a one-time code to verify your identity.
        </Text>

        <View style={styles.inputRow}>
          <TouchableOpacity
            style={styles.countryBtn}
            onPress={() => setShowPicker(!showPicker)}
          >
            <Text style={styles.flag}>{selectedCountry.flag}</Text>
            <Text style={styles.countryCode}>{selectedCountry.code}</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.phoneInput}
            placeholder="8012345678"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            maxLength={11}
          />
        </View>

        {showPicker && (
          <View style={styles.picker}>
            {COUNTRY_CODES.map((c) => (
              <TouchableOpacity
                key={c.code}
                style={styles.pickerItem}
                onPress={() => {
                  setSelectedCountry(c)
                  setShowPicker(false)
                }}
              >
                <Text style={styles.pickerFlag}>{c.flag}</Text>
                <Text style={styles.pickerName}>
                  {c.name} ({c.code})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleSendOTP}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Send OTP</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { flex: 1, padding: 24, paddingTop: 48 },
  heading: { fontSize: 26, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  sub: { fontSize: 15, color: '#666', marginBottom: 32 },
  inputRow: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  countryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    gap: 4,
  },
  flag: { fontSize: 20 },
  countryCode: { fontSize: 15, fontWeight: '600', color: '#333' },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1a1a1a',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 10,
  },
  pickerFlag: { fontSize: 22 },
  pickerName: { fontSize: 15, color: '#333' },
  btn: {
    backgroundColor: '#1D7A5F',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
})
