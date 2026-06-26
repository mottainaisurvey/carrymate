import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { trpc } from '../../../lib/trpc'

export default function PostTripScreen() {
  const router = useRouter()
  const [originCity, setOriginCity] = useState('')
  const [originCode, setOriginCode] = useState('')
  const [destCity, setDestCity] = useState('')
  const [destCode, setDestCode] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [availableKg, setAvailableKg] = useState('')
  const [pricePerKg, setPricePerKg] = useState('')
  const [notes, setNotes] = useState('')

  const createTrip = trpc.trips.create.useMutation({
    onSuccess: () => {
      Alert.alert('Trip posted!', 'Your trip is now visible to senders on your route.', [
        { text: 'Browse parcels', onPress: () => router.replace('/(app)/(traveler)/browse') },
      ])
    },
    onError: (err: { message: string }) => Alert.alert('Error', err.message),
  })

  const handleSubmit = () => {
    if (!originCity.trim()) { Alert.alert('Origin city required'); return }
    if (!originCode.trim()) { Alert.alert('Origin code required (e.g. LHR)'); return }
    if (!destCity.trim()) { Alert.alert('Destination city required'); return }
    if (!destCode.trim()) { Alert.alert('Destination code required (e.g. LOS)'); return }
    if (!departureDate.trim()) { Alert.alert('Departure date required'); return }
    if (!availableKg || isNaN(Number(availableKg))) { Alert.alert('Valid capacity required'); return }
    if (!pricePerKg || isNaN(Number(pricePerKg))) { Alert.alert('Valid price per kg required'); return }

    createTrip.mutate({
      originCity: originCity.trim(),
      originCode: originCode.trim().toUpperCase(),
      destCity: destCity.trim(),
      destCode: destCode.trim().toUpperCase(),
      departureDate,
      availableKg: parseFloat(availableKg),
      pricePerKg: parseFloat(pricePerKg),
      notes: notes.trim() || undefined,
    })
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Post your trip</Text>
        <Text style={styles.sub}>
          Let senders know you're travelling and have space for parcels.
        </Text>

        <Text style={styles.label}>From (city) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. London"
          placeholderTextColor="#aaa"
          value={originCity}
          onChangeText={setOriginCity}
        />

        <Text style={styles.label}>Origin code (airport/city) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. LHR"
          placeholderTextColor="#aaa"
          value={originCode}
          onChangeText={setOriginCode}
          autoCapitalize="characters"
          maxLength={10}
        />

        <Text style={styles.label}>To (city) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Lagos"
          placeholderTextColor="#aaa"
          value={destCity}
          onChangeText={setDestCity}
        />

        <Text style={styles.label}>Destination code (airport/city) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. LOS"
          placeholderTextColor="#aaa"
          value={destCode}
          onChangeText={setDestCode}
          autoCapitalize="characters"
          maxLength={10}
        />

        <Text style={styles.label}>Departure date *</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#aaa"
          value={departureDate}
          onChangeText={setDepartureDate}
          keyboardType="numbers-and-punctuation"
        />

        <Text style={styles.label}>Available capacity (kg) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 10"
          placeholderTextColor="#aaa"
          value={availableKg}
          onChangeText={setAvailableKg}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Your price per kg (GBP) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 8"
          placeholderTextColor="#aaa"
          value={pricePerKg}
          onChangeText={setPricePerKg}
          keyboardType="decimal-pad"
        />

        <View style={styles.earningsHint}>
          <Text style={styles.earningsHintText}>
            💰 At £{pricePerKg || '8'}/kg with {availableKg || '10'} kg you could earn{' '}
            <Text style={styles.earningsHintBold}>
              £{((parseFloat(pricePerKg || '8') * parseFloat(availableKg || '10')) || 80).toFixed(0)}
            </Text>
          </Text>
        </View>

        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="e.g. No liquids, fragile items ok"
          placeholderTextColor="#aaa"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity
          style={[styles.btn, createTrip.isPending && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={createTrip.isPending}
        >
          {createTrip.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Post Trip</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { padding: 24, paddingBottom: 48 },
  heading: { fontSize: 24, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  sub: { fontSize: 15, color: '#666', marginBottom: 28, lineHeight: 22 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 4 },
  input: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#1a1a1a',
    marginBottom: 16,
  },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  earningsHint: {
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  earningsHintText: { fontSize: 14, color: '#166534' },
  earningsHintBold: { fontWeight: '700' },
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
