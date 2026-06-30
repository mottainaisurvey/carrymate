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
  ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'

type Role = 'sender' | 'traveler' | 'both'

const ROLES: { id: Role; label: string; emoji: string; desc: string }[] = [
  {
    id: 'sender',
    label: 'Sender',
    emoji: '📦',
    desc: 'I want to send parcels home',
  },
  {
    id: 'traveler',
    label: 'Traveler',
    emoji: '✈️',
    desc: 'I want to carry parcels and earn',
  },
  {
    id: 'both',
    label: 'Both',
    emoji: '🔄',
    desc: 'I want to do both',
  },
]

export default function SignupScreen() {
  const [role, setRole] = useState<Role | null>(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!role) {
      Alert.alert('Select a role', 'Please choose how you want to use CarryMate.')
      return
    }
    if (!fullName.trim()) {
      Alert.alert('Full name required', 'Please enter your full name.')
      return
    }

    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      Alert.alert('Session expired', 'Please log in again.')
      router.replace('/(auth)/phone')
      return
    }

    const { error } = await supabase.from('users').upsert({
      id: user.id,
      phone: user.phone,
      full_name: fullName.trim(),
      email: email.trim() || null,
      role,
      kyc_status: 'pending',
      carrier_tier: 'bronze',
    })

    setLoading(false)

    if (error) {
      Alert.alert('Error', error.message)
    } else {
      router.replace('/(auth)/kyc')
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Create your profile</Text>
        <Text style={styles.sub}>Tell us a bit about yourself to get started.</Text>

        {/* Role selection */}
        <Text style={styles.label}>How will you use CarryMate?</Text>
        <View style={styles.rolesGrid}>
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r.id}
              style={[styles.roleCard, role === r.id && styles.roleCardActive]}
              onPress={() => setRole(r.id)}
            >
              <Text style={styles.roleEmoji}>{r.emoji}</Text>
              <Text style={[styles.roleLabel, role === r.id && styles.roleLabelActive]}>
                {r.label}
              </Text>
              <Text style={[styles.roleDesc, role === r.id && styles.roleDescActive]}>
                {r.desc}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Full name */}
        <Text style={styles.label}>Full name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Amara Okafor"
          placeholderTextColor="#aaa"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />

        {/* Email (optional) */}
        <Text style={styles.label}>Email address (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Continue to Verification</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { padding: 24, paddingTop: 32, paddingBottom: 48 },
  heading: { fontSize: 26, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  sub: { fontSize: 15, color: '#666', marginBottom: 28 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 10, marginTop: 4 },
  rolesGrid: { flexDirection: 'row', gap: 10, marginBottom: 24, flexWrap: 'wrap' },
  roleCard: {
    flex: 1,
    minWidth: 100,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  roleCardActive: { borderColor: '#1D7A5F', backgroundColor: '#f0faf7' },
  roleEmoji: { fontSize: 28, marginBottom: 6 },
  roleLabel: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 4 },
  roleLabelActive: { color: '#1D7A5F' },
  roleDesc: { fontSize: 11, color: '#888', textAlign: 'center', lineHeight: 15 },
  roleDescActive: { color: '#2D9B7A' },
  input: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 20,
  },
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
